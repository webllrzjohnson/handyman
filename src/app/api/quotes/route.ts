import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { isDuplicateQuoteNumber, jsonError, parseQuoteItemPayloads, parseQuotePayload } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const clientId = searchParams.get("clientId");
    const status = searchParams.get("status");

    let queryBuilder = db.select().from(schema.quotes).$dynamic();

    if (clientId) {
      queryBuilder = queryBuilder.where(eq(schema.quotes.clientId, Number(clientId)));
    }
    
    if (status) {
      queryBuilder = queryBuilder.where(eq(schema.quotes.status, status));
    }

    const quotes = await queryBuilder.orderBy(desc(schema.quotes.createdAt));
    return NextResponse.json(quotes);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const quote = parseQuotePayload(body?.quote);
    if ("error" in quote) return jsonError(quote.error, 400);

    const items = parseQuoteItemPayloads(body?.items);
    if ("error" in items) return jsonError(items.error, 400);

    const savedQuote = db.transaction((tx) => {
      const createdQuote = tx.insert(schema.quotes).values(quote).returning().get();

      if (items.length > 0) {
        const itemsWithQuoteId = items.map((item) => ({
          quoteId: createdQuote.id,
          jobId: item.jobId,
          jobName: item.jobName,
          jobCategory: item.jobCategory,
          quantity: item.quantity,
          conditionId: item.conditionId,
          conditionLabel: item.conditionLabel,
          conditionAmount: item.conditionAmount,
          materialId: item.materialId,
          materialCost: item.materialCost,
          materialMarkupPercent: item.materialMarkupPercent,
          materialPickupFee: item.materialPickupFee,
          selectedAddOnIds: item.selectedAddOnIds,
          location: item.location,
          lineSubtotal: item.lineSubtotal,
        }));
        tx.insert(schema.quoteItems).values(itemsWithQuoteId).run();
      }

      return createdQuote;
    });

    return NextResponse.json(savedQuote, { status: 201 });
  } catch (error) {
    console.error("Error creating quote:", error);
    if (isDuplicateQuoteNumber(error)) return jsonError("Quote number already exists", 409);
    return NextResponse.json({ error: "Failed to create quote" }, { status: 500 });
  }
}
