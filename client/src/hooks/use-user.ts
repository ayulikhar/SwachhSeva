import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useUser() {
  return useQuery({
    queryKey: [api.users.me.path],
    queryFn: async () => {
      const res = await fetch(api.users.me.path);
      if (!res.ok) throw new Error("Failed to fetch user");
      
      // Handle the case where the user might not be logged in (null response)
      // The API contract says 200: User | null. 
      // Sometimes APIs return 401, but the spec says 200 with nullable user.
      const data = await res.json();
      return api.users.me.responses[200].parse(data);
    },
    retry: false,
  });
}
