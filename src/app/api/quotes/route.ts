import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const clientId = searchParams.get("clientId");
    const status = searchParams.get("status");

    let query = db.select().from(schema.quotes);

    if (clientId) {
      query = query.where(eq(schema.quotes.clientId, Number(clientId))) as any;
    }
    
    if (status) {
      query = query.where(eq(schema.quotes.status, status)) as any;
    }

    const quotes = await query.orderBy(desc(schema.quotes.createdAt));
    return NextResponse.json(quotes);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quote, items } = body;

    const result = await db.insert(schema.quotes).values(quote).returning();
    const savedQuote = result[0];

    if (items && items.length > 0) {
      const itemsWithQuoteId = items.map((item: any) => ({
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
