// API Client for database operations

export async function fetchClients() {
  const res = await fetch("/api/clients");
  if (!res.ok) throw new Error("Failed to fetch clients");
  return res.json();
}

export async function createClient(data: { name: string; email?: string; phone?: string; address?: string; notes?: string }) {
  const res = await fetch("/api/clients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create client");
  return res.json();
}

export async function updateClient(id: number, data: { name: string; email?: string; phone?: string; address?: string; notes?: string }) {
  const res = await fetch(`/api/clients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update client");
  return res.json();
}

export async function deleteClient(id: number) {
  const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete client");
  return res.json();
}

export async function fetchQuotes(params?: { clientId?: number; status?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.clientId) searchParams.set("clientId", params.clientId.toString());
  if (params?.status) searchParams.set("status", params.status);
  
  const res = await fetch(`/api/quotes?${searchParams.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch quotes");
  return res.json();
}

export async function fetchQuote(id: number) {
  const res = await fetch(`/api/quotes/${id}`);
  if (!res.ok) throw new Error("Failed to fetch quote");
  return res.json();
}

export async function createQuote(data: { quote: any; items: any[] }) {
  const res = await fetch("/api/quotes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create quote");
  return res.json();
}

export async function updateQuote(id: number, data: { quote: any; items: any[] }) {
  const res = await fetch(`/api/quotes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update quote");
  return res.json();
}

export async function deleteQuote(id: number) {
  const res = await fetch(`/api/quotes/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete quote");
  return res.json();
}

export async function fetchCompletions(quoteId?: number) {
  const searchParams = new URLSearchParams();
  if (quoteId) searchParams.set("quoteId", quoteId.toString());
  
  const res = await fetch(`/api/completions?${searchParams.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch completions");
  return res.json();
}

export async function createCompletion(data: any) {
  const res = await fetch("/api/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create completion");
  return res.json();
}

export async function updateCompletion(id: number, data: any) {
  const res = await fetch(`/api/completions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update completion");
  return res.json();
}
