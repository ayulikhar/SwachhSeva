import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type Report, type InsertReport, type AnalyzeResponse } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// Fetch all reports
export function useReports() {
  return useQuery({
    queryKey: [api.reports.list.path],
    queryFn: async () => {
      const res = await fetch(api.reports.list.path);
      if (!res.ok) throw new Error("Failed to fetch reports");
      const data = await res.json();
      return api.reports.list.responses[200].parse(data);
    },
  });
}

// Analyze waste image
export function useAnalyzeWaste() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (base64Image: string) => {
      // Small client-side validation just in case
      if (!base64Image.startsWith('data:image')) {
        throw new Error("Invalid image format");
      }

      const res = await fetch(api.analyze.path, {
        method: api.analyze.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.analyze.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Analysis failed");
      }

      return api.analyze.responses[200].parse(await res.json());
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}

// Create a new report
export function useCreateReport() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertReport) => {
      const validated = api.reports.create.input.parse(data);
      
      const res = await fetch(api.reports.create.path, {
        method: api.reports.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.reports.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create report");
      }

      return api.reports.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.reports.list.path] });
      toast({
        title: "Report Submitted!",
        description: "Your contribution to a cleaner environment has been recorded.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
