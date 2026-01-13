import { z } from 'zod';
import { insertReportSchema, reports, users } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  analyze: {
    method: 'POST' as const,
    path: '/api/analyze',
    input: z.object({ image: z.string() }), // Base64 image
    responses: {
      200: z.object({
        category: z.string(),
        severity: z.enum(['LOW', 'MEDIUM', 'HIGH']),
        description: z.string()
      }),
      400: errorSchemas.validation,
      500: errorSchemas.internal
    }
  },
  reports: {
    list: {
      method: 'GET' as const,
      path: '/api/reports',
      responses: {
        200: z.array(z.custom<typeof reports.$inferSelect>())
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/reports',
      input: insertReportSchema,
      responses: {
        201: z.custom<typeof reports.$inferSelect>(),
        400: errorSchemas.validation
      }
    }
  },
  users: {
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.custom<typeof users.$inferSelect>().nullable()
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
