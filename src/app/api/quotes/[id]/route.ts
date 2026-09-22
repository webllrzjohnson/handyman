import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { and, eq, notInArray } from "drizzle-orm";
import { isDuplicateQuoteNumber, jsonError, parseQuoteItemPayloads, parseQuotePayload, parseRouteId } from "@/lib/api-helpers";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const quoteId = parseRouteId(id);
    if (!quoteId) return jsonError("Invalid quote ID", 400);

    const quote = await db.select().from(schema.quotes).where(eq(schema.quotes.id, quoteId));
    
    if (quote.length === 0) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    const items = await db.select().from(schema.quoteItems).where(eq(schema.quoteItems.quoteId, quoteId));

    return NextResponse.json({ quote: quote[0], items });
  } catch (error) {
    console.error("Error fetching quote:", error);
    return NextResponse.json({ error: "Failed to fetch quote" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const quoteId = parseRouteId(id);
    if (!quoteId) return jsonError("Invalid quote ID", 400);

    const body = await request.json();
    const quote = parseQuotePayload(body?.quote);
    if ("error" in quote) return jsonError(quote.error, 400);

    const items = parseQuoteItemPayloads(body?.items);
    if ("error" in items) return jsonError(items.error, 400);

    const savedQuote = db.transaction((tx) => {
      const updatedQuote = tx.update(schema.quotes)
        .set({ ...quote, updatedAt: new Date() })
        .where(eq(schema.quotes.id, quoteId))
        .returning()
        .get();

      if (!updatedQuote) return null;

      const existingItems = tx
        .select({ id: schema.quoteItems.id })
        .from(schema.quoteItems)
        .where(eq(schema.quoteItems.quoteId, quoteId))
        .all();
      const existingIds = new Set(existingItems.map((item) => item.id));
      const retainedIds: number[] = [];
      const newItems = [];

      for (const item of items) {
        const { id: itemId, ...values } = item;
        if (itemId && existingIds.has(itemId)) {
          retainedIds.push(itemId);
          tx.update(schema.quoteItems)
            .set(values)
            .where(and(eq(schema.quoteItems.id, itemId), eq(schema.quoteItems.quoteId, quoteId)))
            .run();
        } else {
          newItems.push({ ...values, quoteId });
        }
      }

      if (retainedIds.length > 0) {
        tx.delete(schema.quoteItems)
          .where(and(eq(schema.quoteItems.quoteId, quoteId), notInArray(schema.quoteItems.id, retainedIds)))
          .run();
      } else {
        tx.delete(schema.quoteItems).where(eq(schema.quoteItems.quoteId, quoteId)).run();
      }

      if (newItems.length > 0) {
        tx.insert(schema.quoteItems).values(newItems).run();
      }

      return updatedQuote;
    });

    if (!savedQuote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json(savedQuote);
  } catch (error) {
    console.error("Error updating quote:", error);
    if (isDuplicateQuoteNumber(error)) return jsonError("Quote number already exists", 409);
    return NextResponse.json({ error: "Failed to update quote" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const quoteId = parseRouteId(id);
    if (!quoteId) return jsonError("Invalid quote ID", 400);

    const result = await db.delete(schema.quotes).where(eq(schema.quotes.id, quoteId)).returning();
    
    if (result.length === 0) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting quote:", error);
    return NextResponse.json({ error: "Failed to delete quote" }, { status: 500 });
  }
}
