// GET /api/benchmark/stats — aggregate stats across all stored Assessments, used by the
// benchmark landing + results + insights pages to show "how you compare" and overall dataset shape.
// Returns counts, average overall score, per-dimension averages, tier distribution,
// breakdowns by industry and company size, and a submission trend over the last 12 weeks.
// Averages are rounded to integers for a clean readout. Empty dataset returns zeros.

import { COMPANY_SIZES } from "@/lib/benchmark-constants";
import { db } from "@/lib/db";

type Tier = "Nascent" | "Developing" | "Established" | "Leading";

function emptyTierDist(): Record<Tier, number> {
  return { Nascent: 0, Developing: 0, Established: 0, Leading: 0 };
}

export async function GET() {
  try {
    interface TrendRow {
      weekStart: string;
      count: number;
      average: number;
    }

    const [
      totalAssessments,
      agg,
      grouped,
      byIndustryRows,
      byCompanySizeRows,
      trendRows,
    ] = await Promise.all([
      db.assessment.count(),
      db.assessment.aggregate({
        _avg: {
          overallScore: true,
          governanceScore: true,
          riskScore: true,
          executionScore: true,
          reportingScore: true,
          capabilityScore: true,
          durationSec: true,
        },
      }),
      db.assessment.groupBy({
        by: ["tier"],
        _count: { _all: true },
      }),
      db.assessment.groupBy({
        by: ["industry"],
        _count: { _all: true },
        _avg: { overallScore: true },
        orderBy: { _count: { industry: "desc" } },
      }),
      db.assessment.groupBy({
        by: ["companySize"],
        _count: { _all: true },
        _avg: { overallScore: true },
      }),
      db.$queryRaw<TrendRow[]>`
        SELECT
          TO_CHAR(DATE_TRUNC('week', "createdAt"), 'YYYY-MM-DD') AS "weekStart",
          COUNT(*)::int AS "count",
          COALESCE(ROUND(AVG("overallScore"))::int, 0) AS "average"
        FROM "Assessment"
        WHERE "createdAt" > NOW() - INTERVAL '12 weeks'
        GROUP BY DATE_TRUNC('week', "createdAt")
        ORDER BY DATE_TRUNC('week', "createdAt") ASC
      `,
    ]);

    if (totalAssessments === 0) {
      return Response.json(
        { ok: true, data: {
          totalAssessments: 0,
          averageOverall: 0,
          dimensionAverages: {
            governance: 0,
            risk: 0,
            execution: 0,
            reporting: 0,
            capability: 0,
          },
          tierDistribution: emptyTierDist(),
          byIndustry: [],
          byCompanySize: [],
          trend: [],
          avgDurationSec: 0,
        } },
        { status: 200 }
      );
    }

    const tierDistribution = emptyTierDist();
    for (const g of grouped) {
      if (g.tier in tierDistribution) {
        tierDistribution[g.tier as Tier] = g._count._all;
      }
    }

    const byIndustry = byIndustryRows
      .filter((r) => r.industry && r.industry.trim().length > 0)
      .slice(0, 10)
      .map((r) => ({
        label: r.industry,
        count: r._count._all,
        average: Math.round(r._avg.overallScore ?? 0),
      }));

        const byCompanySize = COMPANY_SIZES.map((size) => {
      const row = byCompanySizeRows.find((r) => r.companySize === size);
      return {
        label: size,
        count: row?._count._all ?? 0,
        average: Math.round(row?._avg.overallScore ?? 0),
      };
    }).filter((r) => r.count > 0);

    const trendMap = new Map(trendRows.map((r) => [r.weekStart, r]));
    const now = Date.now();
    const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
    const trend: { weekStart: string; count: number; average: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const start = new Date(now - i * WEEK_MS);
      const day = start.getUTCDay();
      const offset = day === 0 ? 6 : day - 1;
      start.setUTCDate(start.getUTCDate() - offset);
      start.setUTCHours(0, 0, 0, 0);
      const key = start.toISOString().slice(0, 10);
      const row = trendMap.get(key);
      trend.push({
        weekStart: key,
        count: row?.count ?? 0,
        average: row?.average ?? 0,
      });
    }

    const r = (n: number | null) => (n == null ? 0 : Math.round(n));

    return Response.json(
      { ok: true, data: {
        totalAssessments,
        averageOverall: r(agg._avg.overallScore),
        dimensionAverages: {
          governance: r(agg._avg.governanceScore),
          risk: r(agg._avg.riskScore),
          execution: r(agg._avg.executionScore),
          reporting: r(agg._avg.reportingScore),
          capability: r(agg._avg.capabilityScore),
        },
        tierDistribution,
        byIndustry,
        byCompanySize,
        trend,
        avgDurationSec: r(agg._avg.durationSec),
      } },
      { status: 200 }
    );
  } catch (err) {
    console.error("[api/benchmark/stats] error:", err);
    return Response.json({ ok: false, error: "internal error" }, { status: 500 });
  }
}
