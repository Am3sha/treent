// GET /api/admin/assessments — returns paginated assessment records with responses
// for the admin reporting view. Supports filtering by tier, industry, companySize.
// Query params: ?tier=Leading&industry=Technology&companySize=201-1000&page=1&pageSize=20
//
// NOTE: In a production deployment this route MUST be behind authentication
// (e.g. NextAuth admin role check). For this demo it is open — clearly marked.

import { db } from "@/lib/db";

const VALID_TIERS = ["Nascent", "Developing", "Established", "Leading"];

export async function GET(req: Request) {
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
          responses: {
            orderBy: { questionId: "asc" },
          },
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

    return Response.json({
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      records: records.map((r) => ({
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
          strategy: Math.round(r.strategyScore),
          technology: Math.round(r.technologyScore),
          culture: Math.round(r.cultureScore),
          data: Math.round(r.dataScore),
          operations: Math.round(r.operationsScore),
        },
        tier: r.tier,
        questionCount: r.questionCount,
        durationSec: r.durationSec,
        createdAt: r.createdAt.toISOString(),
        responses: r.responses.map((resp) => ({
          questionId: resp.questionId,
          dimension: resp.dimension,
          value: resp.value,
          questionText: resp.questionText,
        })),
        followUps: r.followUps.map((f) => ({
          id: f.id,
          interest: f.interest,
          status: f.status,
          createdAt: f.createdAt.toISOString(),
        })),
      })),
      filters: {
        industries: industries
          .map((i) => i.industry)
          .filter((i): i is string => !!i),
        companySizes: companySizes
          .map((c) => c.companySize)
          .filter((c): c is string => !!c),
        tiers: VALID_TIERS,
      },
    });
  } catch (err) {
    console.error("[api/admin/assessments] error:", err);
    return Response.json(
      { ok: false, error: "internal error" },
      { status: 500 }
    );
  }
}
