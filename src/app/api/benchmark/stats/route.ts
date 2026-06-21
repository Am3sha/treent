// GET /api/benchmark/stats — aggregate stats across all stored Assessments, used by the
// benchmark landing + results + insights pages to show "how you compare" and overall dataset shape.
// Returns counts, average overall score, per-dimension averages, tier distribution,
// breakdowns by industry and company size, and a submission trend over the last 12 weeks.
// Averages are rounded to integers for a clean readout. Empty dataset returns zeros.

import { db } from "@/lib/db";

type Tier = "Nascent" | "Developing" | "Established" | "Leading";

function emptyTierDist(): Record<Tier, number> {
  return { Nascent: 0, Developing: 0, Established: 0, Leading: 0 };
}

export async function GET() {
  try {
    const totalAssessments = await db.assessment.count();

    if (totalAssessments === 0) {
      return Response.json(
        {
          totalAssessments: 0,
          averageOverall: 0,
          dimensionAverages: {
            strategy: 0,
            technology: 0,
            culture: 0,
            data: 0,
            operations: 0,
          },
          tierDistribution: emptyTierDist(),
          byIndustry: [],
          byCompanySize: [],
          trend: [],
          avgDurationSec: 0,
        },
        { status: 200 }
      );
    }

    // Prisma aggregate: avg of each score column.
    const agg = await db.assessment.aggregate({
      _avg: {
        overallScore: true,
        strategyScore: true,
        technologyScore: true,
        cultureScore: true,
        dataScore: true,
        operationsScore: true,
        durationSec: true,
      },
    });

    // Tier distribution via groupBy.
    const grouped = await db.assessment.groupBy({
      by: ["tier"],
      _count: { _all: true },
    });
    const tierDistribution = emptyTierDist();
    for (const g of grouped) {
      if (g.tier in tierDistribution) {
        tierDistribution[g.tier as Tier] = g._count._all;
      }
    }

    // Breakdown by industry (avg overall + count per industry).
    const byIndustryRows = await db.assessment.groupBy({
      by: ["industry"],
      _count: { _all: true },
      _avg: { overallScore: true },
      orderBy: { _count: { industry: "desc" } },
    });
    const byIndustry = byIndustryRows
      .filter((r) => r.industry && r.industry.trim().length > 0)
      .slice(0, 10)
      .map((r) => ({
        label: r.industry,
        count: r._count._all,
        average: Math.round(r._avg.overallScore ?? 0),
      }));

    // Breakdown by company size, in a fixed display order.
    const SIZE_ORDER = ["1-10", "11-50", "51-200", "201-1000", "1000+"];
    const byCompanySizeRows = await db.assessment.groupBy({
      by: ["companySize"],
      _count: { _all: true },
      _avg: { overallScore: true },
    });
    const byCompanySize = SIZE_ORDER.map((size) => {
      const row = byCompanySizeRows.find((r) => r.companySize === size);
      return {
        label: size,
        count: row?._count._all ?? 0,
        average: Math.round(row?._avg.overallScore ?? 0),
      };
    }).filter((r) => r.count > 0);

    // Submission trend: last 12 weeks (count + avg score per week bucket).
    // For SQLite we compute buckets in JS from createdAt to avoid dialect-specific date SQL.
    const allAssessments = await db.assessment.findMany({
      select: { overallScore: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });
    const now = Date.now();
    const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
    const buckets: { weekStart: string; count: number; average: number; sum: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const start = now - i * WEEK_MS;
      const startDay = new Date(start);
      // align to Monday
      const day = startDay.getUTCDay();
      const offset = day === 0 ? 6 : day - 1;
      startDay.setUTCDate(startDay.getUTCDate() - offset);
      startDay.setUTCHours(0, 0, 0, 0);
      buckets.push({
        weekStart: startDay.toISOString().slice(0, 10),
        count: 0,
        sum: 0,
        average: 0,
      });
    }
    for (const a of allAssessments) {
      const t = a.createdAt.getTime();
      // find the bucket this falls into
      for (let i = 0; i < buckets.length; i++) {
        const bucketStart = new Date(buckets[i].weekStart).getTime();
        const bucketEnd = bucketStart + WEEK_MS;
        if (t >= bucketStart && t < bucketEnd) {
          buckets[i].count += 1;
          buckets[i].sum += a.overallScore;
          break;
        }
      }
    }
    const trend = buckets.map((b) => ({
      weekStart: b.weekStart,
      count: b.count,
      average: b.count > 0 ? Math.round(b.sum / b.count) : 0,
    }));

    const r = (n: number | null) => (n == null ? 0 : Math.round(n));

    return Response.json(
      {
        totalAssessments,
        averageOverall: r(agg._avg.overallScore),
        dimensionAverages: {
          strategy: r(agg._avg.strategyScore),
          technology: r(agg._avg.technologyScore),
          culture: r(agg._avg.cultureScore),
          data: r(agg._avg.dataScore),
          operations: r(agg._avg.operationsScore),
        },
        tierDistribution,
        byIndustry,
        byCompanySize,
        trend,
        avgDurationSec: r(agg._avg.durationSec),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[api/benchmark/stats] error:", err);
    return Response.json({ ok: false, error: "internal error" }, { status: 500 });
  }
}
