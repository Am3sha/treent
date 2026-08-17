// GET /api/admin/assessments — returns paginated assessment records with responses
// for the admin reporting view. Supports filtering by tier, industry, companySize.
// Query params: ?tier=Leading&industry=Technology&companySize=201-1000&page=1&pageSize=20

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";

const VALID_TIERS = ["Nascent", "Developing", "Established", "Leading"];

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const url = new URL(req.url);
    const params = url.searchParams;
    const tier = params.get("tier") || undefined;
    const industry = params.get("industry") || undefined;
    const companySize = params.get("companySize") || undefined;
    const page = Math.max(1, parseInt(params.get("page") || "1", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(params.get("pageSize") || "20", 10)));

    // Build where clause
    const where: {
      tier?: string;
      industry?: string;
      companySize?: string;
    } = {};
    if (tier && VALID_TIERS.includes(tier)) where.tier = tier;
    if (industry) where.industry = industry;
    if (companySize) where.companySize = companySize;

    const [total, records] = await Promise.all([
    db.assessment.count({ where }),
    db.assessment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        followUps: {
          select: {
            id: true,
            interest: true,
            status: true,
            createdAt: true,
          },
        },
      },
    }),
  ]);

    // Also fetch distinct industries + company sizes for filter dropdowns
    const [industries, companySizes] = await Promise.all([
      db.assessment.findMany({
        where: { industry: { not: null } },
        distinct: ["industry"],
        select: { industry: true },
        orderBy: { industry: "asc" },
      }),
      db.assessment.findMany({
        where: { companySize: { not: null } },
        distinct: ["companySize"],
        select: { companySize: true },
        orderBy: { companySize: "asc" },
      }),
    ]);

    return Response.json({ ok: true, data: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      records: await Promise.all(records.map(async (r) => ({
        id: r.id,
        respondentName: r.respondentName,
        respondentEmail: r.respondentEmail,
        companyName: r.companyName,
        companySize: r.companySize,
        industry: r.industry,
        country: r.country,
        role: r.role,
        consentContact: r.consentContact,
        overallScore: Math.round(r.overallScore),
        scores: {
          governance: Math.round(r.governanceScore),
          risk: Math.round(r.riskScore),
          execution: Math.round(r.executionScore),
          reporting: Math.round(r.reportingScore),
          capability: Math.round(r.capabilityScore),
        },
        tier: r.tier,
        questionCount: r.questionCount,
        durationSec: r.durationSec,
        createdAt: r.createdAt.toISOString(),
        answers: await db.assessmentAnswer.findMany({ where: { assessmentId: r.id } }),
        followUps: r.followUps.map((f) => ({
          id: f.id,
          interest: f.interest,
          status: f.status,
          createdAt: f.createdAt.toISOString(),
        })),
      }))),
      filters: {
        industries: industries
          .map((i) => i.industry)
          .filter((i): i is string => !!i),
        companySizes: companySizes
          .map((c) => c.companySize)
          .filter((c): c is string => !!c),
        tiers: VALID_TIERS,
      },
    }});
  } catch (err) {
    console.error("[api/admin/assessments] error:", err);
    return Response.json(
      { ok: false, error: "internal error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    
    if (!id) {
      return Response.json({ ok: false, error: "Missing id parameter" }, { status: 400 });
    }

    // Check if assessment exists
    const existingAssessment = await db.assessment.findUnique({ where: { id } });
    if (!existingAssessment) {
      return Response.json({ ok: false, error: "Assessment not found" }, { status: 404 });
    }

    console.warn("[ADMIN AUDIT]", {
      admin: session.user?.email ?? session.user?.id ?? "unknown",
      action: "delete",
      resource: "assessment",
      id,
      timestamp: new Date().toISOString(),
    });

    // Delete the assessment (Prisma should handle cascading deletes if configured)
    await db.assessment.delete({ where: { id } });

    return Response.json({ ok: true, data: { success: true } }, { status: 200 });
  } catch (err) {
    console.error("[api/admin/assessments DELETE] error:", err);
    return Response.json(
      { ok: false, error: "internal error" },
      { status: 500 }
    );
  }
}
