import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { completionVariance, jsonError, parseCompletionPayload } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const quoteId = searchParams.get("quoteId");

    let queryBuilder = db.select().from(schema.jobCompletions).$dynamic();

    if (quoteId) {
      queryBuilder = queryBuilder.where(eq(schema.jobCompletions.quoteId, Number(quoteId)));
    }

    const completions = await queryBuilder.orderBy(desc(schema.jobCompletions.completedAt));
    return NextResponse.json(completions);
  } catch (error) {
    console.error("Error fetching completions:", error);
    return NextResponse.json({ error: "Failed to fetch completions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const completion = parseCompletionPayload(body);
    if ("error" in completion) return jsonError(completion.error, 400);
    
    const { variance, variancePercent } = completionVariance(completion);

    const result = await db.insert(schema.jobCompletions).values({
      ...completion,
      variance,
      variancePercent,
    }).returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating completion:", error);
    return NextResponse.json({ error: "Failed to create completion" }, { status: 500 });
  }
}
