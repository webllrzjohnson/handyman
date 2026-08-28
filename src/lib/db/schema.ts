import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const clients = sqliteTable("clients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

export const quotes = sqliteTable("quotes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  quoteNumber: text("quote_number").notNull().unique(),
  clientId: integer("client_id").references(() => clients.id),
  clientName: text("client_name").notNull(),
  clientAddress: text("client_address"),
  status: text("status").notNull().default("draft"), // draft, sent, approved, completed, cancelled
  pricingMode: text("pricing_mode").notNull(),
  travelAmount: real("travel_amount").notNull().default(0),
  parkingAmount: real("parking_amount").notNull().default(0),
  accessAmount: real("access_amount").notNull().default(0),
  urgencyType: text("urgency_type").notNull().default("flat"),
  urgencyAmount: real("urgency_amount").notNull().default(0),
  hstPercent: real("hst_percent").notNull().default(0),
  subtotal: real("subtotal").notNull(),
  tax: real("tax").notNull(),
  total: real("total").notNull(),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

export const quoteItems = sqliteTable("quote_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  quoteId: integer("quote_id").notNull().references(() => quotes.id, { onDelete: "cascade" }),
  jobId: text("job_id").notNull(),
  jobName: text("job_name").notNull(),
  jobCategory: text("job_category").notNull(),
  quantity: integer("quantity").notNull(),
  conditionId: text("condition_id").notNull(),
  conditionLabel: text("condition_label").notNull(),
  conditionAmount: real("condition_amount").notNull(),
  materialId: text("material_id").notNull().default("client"),
  materialCost: real("material_cost").notNull().default(0),
  materialMarkupPercent: real("material_markup_percent").notNull().default(0),
  materialPickupFee: real("material_pickup_fee").notNull().default(0),
  selectedAddOnIds: text("selected_add_on_ids").notNull().default("[]"), // JSON array
  location: text("location").notNull().default("Other"),
  lineSubtotal: real("line_subtotal").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

export const photos = sqliteTable("photos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  quoteId: integer("quote_id").references(() => quotes.id, { onDelete: "cascade" }),
  completionId: integer("completion_id").references(() => jobCompletions.id, { onDelete: "cascade" }),
  filename: text("filename").notNull(),
  filepath: text("filepath").notNull(),
  caption: text("caption"),
  type: text("type").notNull(), // before, during, after, reference
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

export const jobCompletions = sqliteTable("job_completions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  quoteId: integer("quote_id").notNull().references(() => quotes.id, { onDelete: "cascade" }),
  quoteItemId: integer("quote_item_id").references(() => quoteItems.id, { onDelete: "set null" }),
  jobId: text("job_id").notNull(),
  jobName: text("job_name").notNull(),
  estimatedTime: real("estimated_time"), // hours
  actualTime: real("actual_time"), // hours
  estimatedCost: real("estimated_cost").notNull(),
  actualLabourCost: real("actual_labour_cost"),
  actualMaterialCost: real("actual_material_cost"),
  actualTotalCost: real("actual_total_cost"),
  variance: real("variance"), // actual - estimated
  variancePercent: real("variance_percent"),
  notes: text("notes"),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
export type Quote = typeof quotes.$inferSelect;
export type NewQuote = typeof quotes.$inferInsert;
export type QuoteItem = typeof quoteItems.$inferSelect;
export type NewQuoteItem = typeof quoteItems.$inferInsert;
export type Photo = typeof photos.$inferSelect;
export type NewPhoto = typeof photos.$inferInsert;
export type JobCompletion = typeof jobCompletions.$inferSelect;
export type NewJobCompletion = typeof jobCompletions.$inferInsert;
