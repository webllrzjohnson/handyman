import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const quote = await db.select().from(schema.quotes).where(eq(schema.quotes.id, Number(id)));
    
    if (quote.length === 0) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    const items = await db.select().from(schema.quoteItems).where(eq(schema.quoteItems.quoteId, Number(id)));

    return NextResponse.json({ quote: quote[0], items });
  } catch (error) {
    console.error("Error fetching quote:", error);
    return NextResponse.json({ error: "Failed to fetch quote" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { quote, items } = body;

    const result = await db.update(schema.quotes)
      .set({ ...quote, updatedAt: new Date() })
      .where(eq(schema.quotes.id, Number(id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    if (items) {
      await db.delete(schema.quoteItems).where(eq(schema.quoteItems.quoteId, Number(id)));
      if (items.length > 0) {
        const itemsWithQuoteId = items.map((item: any) => ({
          ...item,
          quoteId: Number(id),
        }));
        await db.insert(schema.quoteItems).values(itemsWithQuoteId);
      }
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating quote:", error);
    return NextResponse.json({ error: "Failed to update quote" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await db.delete(schema.quotes).where(eq(schema.quotes.id, Number(id))).returning();
    
    if (result.length === 0) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting quote:", error);
    return NextResponse.json({ error: "Failed to delete quote" }, { status: 500 });
  }
}
