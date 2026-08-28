import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";

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

type QuoteItem = {
  jobId: string;
  jobName: string;
  jobCategory: string;
  quantity: number;
  conditionId: string;
  conditionLabel: string;
  conditionAmount: number;
  materialId: string;
  materialCost: number;
  materialMarkupPercent: number;
  materialPickupFee: number;
  selectedAddOnIds: string;
  location: string;
  lineSubtotal: number;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quote, items } = body as { quote: typeof schema.quotes.$inferInsert; items: QuoteItem[] };

    const result = await db.insert(schema.quotes).values(quote).returning();
    const savedQuote = result[0];

    if (items && items.length > 0) {
      const itemsWithQuoteId = items.map((item) => ({
        ...item,
        quoteId: savedQuote.id,
      }));
      await db.insert(schema.quoteItems).values(itemsWithQuoteId);
    }

    return NextResponse.json(savedQuote, { status: 201 });
  } catch (error) {
    console.error("Error creating quote:", error);
    return NextResponse.json({ error: "Failed to create quote" }, { status: 500 });
  }
}
