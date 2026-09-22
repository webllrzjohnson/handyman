import type { Client, JobCompletion, NewClient, NewJobCompletion, NewQuote, NewQuoteItem, Quote, QuoteItem } from "./db/schema";

export type QuoteStatus = "draft" | "sent" | "approved" | "completed" | "cancelled";

export type ClientPayload = Pick<NewClient, "name" | "email" | "phone" | "address" | "notes">;

export type QuotePayload = Omit<NewQuote, "id" | "createdAt" | "updatedAt">;

export type QuoteItemPayload = Omit<NewQuoteItem, "quoteId" | "createdAt"> & {
  id?: number;
};

export type QuoteSavePayload = {
  quote: QuotePayload;
  items: QuoteItemPayload[];
};

export type QuoteWithItems = {
  quote: Quote;
  items: QuoteItem[];
};

export type CompletionPayload = Omit<NewJobCompletion, "id" | "variance" | "variancePercent" | "createdAt" | "updatedAt">;

export type ApiClient = Client;
export type ApiQuote = Quote;
export type ApiCompletion = JobCompletion;
