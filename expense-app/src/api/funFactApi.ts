const API_URL = import.meta.env.VITE_FUNFACT_API_URL || 'http://localhost:5004';

export interface FunFactResponse {
  fact: string;
}

export const funFactApi = {
  // GET /funfact
  getRandomFact: async (): Promise<FunFactResponse> => {
    const response = await fetch(`${API_URL}/funfact`);

    if (!response.ok) {
      const errorText = await response.text().catch(() => null);
      throw new Error(errorText || "Failed to fetch fun fact");
    }

    return response.json();
  }
};
