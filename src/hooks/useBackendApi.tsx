import { useState } from "react";

const BASE_URL = "https://backend-hackaton-2-739886072483.europe-west1.run.app";

export const useBackendApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const get = async <T,>(route: string): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}${route}`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const post = async <T,>(route: string, body: any): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}${route}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`Erro ao enviar dados: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { get, post, loading, error };
};
