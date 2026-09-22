import type { ApiClient, ApiCompletion, ApiQuote, ClientPayload, CompletionPayload, QuoteSavePayload, QuoteWithItems } from "./api-types";

async function parseResponse<T>(res: Response, fallbackMessage: string): Promise<T> {
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const message = typeof data === "object" && data !== null && "error" in data && typeof data.error === "string"
      ? data.error
      : fallbackMessage;
    throw new Error(message);
  }
  return data as T;
}

export async function fetchClients(): Promise<ApiClient[]> {
  const res = await fetch("/api/clients");
  return parseResponse<ApiClient[]>(res, "Failed to fetch clients");
}

export async function createClient(data: ClientPayload): Promise<ApiClient> {
  const res = await fetch("/api/clients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return parseResponse<ApiClient>(res, "Failed to create client");
}

export async function updateClient(id: number, data: ClientPayload): Promise<ApiClient> {
  const res = await fetch(`/api/clients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return parseResponse<ApiClient>(res, "Failed to update client");
}

export async function deleteClient(id: number): Promise<{ success: true }> {
  const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
  return parseResponse<{ success: true }>(res, "Failed to delete client");
}

export async function fetchQuotes(params?: { clientId?: number; status?: string }): Promise<ApiQuote[]> {
  const searchParams = new URLSearchParams();
  if (params?.clientId) searchParams.set("clientId", params.clientId.toString());
  if (params?.status) searchParams.set("status", params.status);
  
  const res = await fetch(`/api/quotes?${searchParams.toString()}`);
  return parseResponse<ApiQuote[]>(res, "Failed to fetch quotes");
}

export async function fetchQuote(id: number): Promise<QuoteWithItems> {
  const res = await fetch(`/api/quotes/${id}`);
  return parseResponse<QuoteWithItems>(res, "Failed to fetch quote");
}

export async function createQuote(data: QuoteSavePayload): Promise<ApiQuote> {
  const res = await fetch("/api/quotes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return parseResponse<ApiQuote>(res, "Failed to create quote");
}

export async function updateQuote(id: number, data: QuoteSavePayload): Promise<ApiQuote> {
  const res = await fetch(`/api/quotes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return parseResponse<ApiQuote>(res, "Failed to update quote");
}

export async function deleteQuote(id: number): Promise<{ success: true }> {
  const res = await fetch(`/api/quotes/${id}`, { method: "DELETE" });
  return parseResponse<{ success: true }>(res, "Failed to delete quote");
}

export async function fetchCompletions(quoteId?: number): Promise<ApiCompletion[]> {
  const searchParams = new URLSearchParams();
  if (quoteId) searchParams.set("quoteId", quoteId.toString());
  
  const res = await fetch(`/api/completions?${searchParams.toString()}`);
  return parseResponse<ApiCompletion[]>(res, "Failed to fetch completions");
}

export async function createCompletion(data: CompletionPayload): Promise<ApiCompletion> {
  const res = await fetch("/api/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return parseResponse<ApiCompletion>(res, "Failed to create completion");
}

export async function updateCompletion(id: number, data: CompletionPayload): Promise<ApiCompletion> {
  const res = await fetch(`/api/completions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return parseResponse<ApiCompletion>(res, "Failed to update completion");
}
