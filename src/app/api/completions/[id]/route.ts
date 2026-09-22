import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { completionVariance, jsonError, parseCompletionPayload, parseRouteId } from "@/lib/api-helpers";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const completionId = parseRouteId(id);
    if (!completionId) return jsonError("Invalid completion ID", 400);

    const completion = await db.select().from(schema.jobCompletions).where(eq(schema.jobCompletions.id, completionId));
    
    if (completion.length === 0) {
      return NextResponse.json({ error: "Completion not found" }, { status: 404 });
    }

    return NextResponse.json(completion[0]);
  } catch (error) {
    console.error("Error fetching completion:", error);
    return NextResponse.json({ error: "Failed to fetch completion" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const completionId = parseRouteId(id);
    if (!completionId) return jsonError("Invalid completion ID", 400);

    const body = await request.json();
    const completion = parseCompletionPayload(body);
    if ("error" in completion) return jsonError(completion.error, 400);

    const { variance, variancePercent } = completionVariance(completion);

    const result = await db.update(schema.jobCompletions)
      .set({
        ...completion,
        variance,
        variancePercent,
        updatedAt: new Date(),
      })
      .where(eq(schema.jobCompletions.id, completionId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Completion not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating completion:", error);
    return NextResponse.json({ error: "Failed to update completion" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const completionId = parseRouteId(id);
    if (!completionId) return jsonError("Invalid completion ID", 400);

    const result = await db.delete(schema.jobCompletions).where(eq(schema.jobCompletions.id, completionId)).returning();
    
    if (result.length === 0) {
      return NextResponse.json({ error: "Completion not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting completion:", error);
    return NextResponse.json({ error: "Failed to delete completion" }, { status: 500 });
  }
}
