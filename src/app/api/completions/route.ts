import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, desc, and, isNotNull } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const quoteId = searchParams.get("quoteId");

    let query = db.select().from(schema.jobCompletions);

    if (quoteId) {
      query = query.where(eq(schema.jobCompletions.quoteId, Number(quoteId))) as any;
    }

    const completions = await query.orderBy(desc(schema.jobCompletions.completedAt));
    return NextResponse.json(completions);
  } catch (error) {
    console.error("Error fetching completions:", error);
    return NextResponse.json({ error: "Failed to fetch completions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const variance = body.actualTotalCost && body.estimatedCost 
      ? body.actualTotalCost - body.estimatedCost 
      : null;
    
    const variancePercent = variance && body.estimatedCost 
      ? (variance / body.estimatedCost) * 100 
      : null;

    const result = await db.insert(schema.jobCompletions).values({
      ...body,
      variance,
      variancePercent,
    }).returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating completion:", error);
    return NextResponse.json({ error: "Failed to create completion" }, { status: 500 });
  }
}
