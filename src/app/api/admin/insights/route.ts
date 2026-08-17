import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";
import { BENCHMARK_QUESTIONS } from "@/lib/content";
import { prismaRetry } from "@/lib/prisma-retry";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        return await prismaRetry(async () => {
            // Date ranges for new metrics
            const now = new Date();
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        // 1. Core aggregates using Prisma GroupBy and Aggregate
        const [
            totalCount,
            scoreAggregates,
            tierGroups,
            industryGroups,
            sizeGroups,
            countryGroups,
            assessmentsForHeatmap,
            assessmentsThisWeek,
            assessmentsThisMonth,
            assessmentsLastMonth,
            recentAssessments,
        ] = await Promise.all([
            db.assessment.count(),
            db.assessment.aggregate({
                _avg: {
                    overallScore: true,
                    durationSec: true,
                    governanceScore: true,
                    riskScore: true,
                    executionScore: true,
                    reportingScore: true,
                    capabilityScore: true,
                },
            }),
            db.assessment.groupBy({
                by: ["tier"],
                _count: { _all: true },
                _avg: { overallScore: true },
            }),
            db.assessment.groupBy({
                by: ["industry"],
                _count: { _all: true },
                _avg: {
                    overallScore: true,
                    governanceScore: true,
                    riskScore: true,
                    executionScore: true,
                    reportingScore: true,
                    capabilityScore: true,
                },
            }),
            db.assessment.groupBy({
                by: ["companySize"],
                _count: { _all: true },
                _avg: { overallScore: true },
            }),
            db.assessment.groupBy({
                by: ["country"],
                _count: { _all: true },
                _avg: { overallScore: true },
            }),
        // For question heatmap, monthly trend, completion time trend, etc.
        // LIMIT to last 500 assessments for heatmap to avoid loading the entire
        // dataset into memory. This is a known scaling trade-off: the heatmap
        // reflects recent submissions rather than the full historical dataset.
        // If full-dataset heatmap is needed, this should be moved to a raw SQL
        // query using PostgreSQL JSON operators.
        db.assessment.findMany({
            orderBy: { createdAt: "desc" },
            take: 500,
            select: {
                id: true,
                createdAt: true,
                overallScore: true,
                durationSec: true,
                reportingScore: true,
                answers: true,
            },
        }),
            db.assessment.count({ where: { createdAt: { gte: oneWeekAgo } } }),
            db.assessment.count({ where: { createdAt: { gte: currentMonthStart } } }),
            db.assessment.count({ where: { createdAt: { gte: previousMonthStart, lte: previousMonthEnd } } }),
            db.assessment.findMany({
                take: 10,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    companyName: true,
                    country: true,
                    industry: true,
                    overallScore: true,
                    tier: true,
                    createdAt: true,
                },
            }),
        ]);

            const sa = scoreAggregates._avg ?? { overallScore: 0, durationSec: 0, governanceScore: 0, riskScore: 0, executionScore: 0, reportingScore: 0, capabilityScore: 0 };

        const assessments = assessmentsForHeatmap;

        // 2. Format Score Distribution
        interface ScoreDistItem {
            range: string;
            count: number;
            percentage?: number;
        }

        const scoreDistribution: ScoreDistItem[] = [
            { range: "0-25", count: 0 },
            { range: "26-50", count: 0 },
            { range: "51-75", count: 0 },
            { range: "76-100", count: 0 },
        ];

        assessments.forEach((a) => {
            const score = a.overallScore;
            if (score <= 25) scoreDistribution[0].count++;
            else if (score <= 50) scoreDistribution[1].count++;
            else if (score <= 75) scoreDistribution[2].count++;
            else scoreDistribution[3].count++;
        });

        scoreDistribution.forEach((d) => {
            d.percentage = totalCount ? Math.round((d.count / totalCount) * 100) : 0;
        });

        // 3. Format Monthly Trend
        const monthlyMap: Record<string, { scores: number[]; count: number }> = {};
        const completionTimeMap: Record<string, { times: number[] }> = {};
        const aiAdoptionTrendMap: Record<string, { aiScores: number[] }> = {};
        assessments.forEach((a) => {
            const month = a.createdAt.toISOString().slice(0, 7);
            if (!monthlyMap[month]) monthlyMap[month] = { scores: [], count: 0 };
            monthlyMap[month].scores.push(a.overallScore);
            monthlyMap[month].count++;
            
            if (a.durationSec) {
                if (!completionTimeMap[month]) completionTimeMap[month] = { times: [] };
                completionTimeMap[month].times.push(a.durationSec);
            }
            
            if (!aiAdoptionTrendMap[month]) aiAdoptionTrendMap[month] = { aiScores: [] };
            aiAdoptionTrendMap[month].aiScores.push(a.reportingScore);
        });

        const monthlyTrend = Object.entries(monthlyMap)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([month, { scores, count }]) => ({
                month,
                count,
                avgScore: Math.round(scores.reduce((s, n) => s + n, 0) / scores.length),
            }));

        const completionTimeTrend = Object.entries(completionTimeMap)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([month, { times }]) => ({
                month,
                avgDuration: Math.round(times.reduce((s, n) => s + n, 0) / times.length),
            }));

        const aiAdoptionTrend = Object.entries(aiAdoptionTrendMap)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([month, { aiScores }]) => ({
                month,
                avgAiScore: Math.round(aiScores.reduce((s, n) => s + n, 0) / aiScores.length),
            }));

        // 4. Question Heatmap
        const questionStats: Record<string, number[]> = {};
        assessments.forEach((a) => {
            for (const ans of (a.answers ?? [])) {
                const qId = String(ans.questionId);
                if (!questionStats[qId]) questionStats[qId] = [];
                questionStats[qId].push(ans.score);
            }
        });

        const questionHeatmap = Object.entries(questionStats)
            .map(([questionId, values]) => {
                const avgValue = values.reduce((s, n) => s + n, 0) / values.length;
                const dimension = questionId.split("-")[0];
                const question = BENCHMARK_QUESTIONS.find((q) => q.id === questionId);
                return {
                    questionId,
                    questionText: question?.prompt ?? questionId,
                    dimension,
                    avgValue: Math.round(avgValue * 10) / 10,
                    avgScore: Math.round(((avgValue - 1) / 4) * 100),
                    responseCount: values.length,
                };
            })
            .sort((a, b) => a.avgScore - b.avgScore);

        // 5. Calculate new metrics
        const monthlyGrowth = assessmentsLastMonth > 0 
            ? Math.round(((assessmentsThisMonth - assessmentsLastMonth) / assessmentsLastMonth) * 100) 
            : 0;

        const dimensionAvgScores = {
            governance: Math.round(sa.governanceScore || 0),
            risk: Math.round(sa.riskScore || 0),
            execution: Math.round(sa.executionScore || 0),
            reporting: Math.round(sa.reportingScore || 0),
            capability: Math.round(sa.capabilityScore || 0),
        };

        const dimensions = Object.entries(dimensionAvgScores);
        const [highestDimension, highestScore] = dimensions.reduce((max, current) => current[1] > max[1] ? current : max, ['', 0]);
        const [lowestDimension, lowestScore] = dimensions.reduce((min, current) => current[1] < min[1] ? current : min, ['', 100]);

        const topCountries = countryGroups
            .filter(g => g.country)
            .map(g => ({
                country: g.country || "Unknown",
                count: g._count._all,
                avgScore: Math.round((g._avg?.overallScore ?? 0)),
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        const topIndustries = industryGroups
            .filter(g => g.industry)
            .map(g => ({
                industry: g.industry || "Unknown",
                count: g._count._all,
                avgScore: Math.round((g._avg?.overallScore ?? 0)),
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // 6. Final Assembly
        return Response.json({ ok: true, data: {
            totalAssessments: totalCount,
            averageScore: Math.round(sa.overallScore || 0),
            averageDuration: Math.round(sa.durationSec || 0),
            completionRate: totalCount > 0 ? 100 : 0,
            scoreDistribution,
            tierBreakdown: tierGroups.map((g) => ({
                tier: g.tier,
                count: g._count._all,
                percentage: totalCount ? Math.round((g._count._all / totalCount) * 100) : 0,
                avgScore: Math.round((g._avg?.overallScore ?? 0)),
            })),
            industryBenchmark: industryGroups.map((g) => ({
                industry: g.industry || "Unknown",
                count: g._count._all,
                avgScore: Math.round((g._avg?.overallScore ?? 0)),
                avgGovernanceScore: Math.round((g._avg?.governanceScore ?? 0)),
                avgRiskScore: Math.round((g._avg?.riskScore ?? 0)),
                avgExecutionScore: Math.round((g._avg?.executionScore ?? 0)),
                avgReportingScore: Math.round((g._avg?.reportingScore ?? 0)),
                avgCapabilityScore: Math.round((g._avg?.capabilityScore ?? 0)),
            })),
            sizeBenchmark: sizeGroups.map((g) => ({
                size: g.companySize || "Unknown",
                count: g._count._all,
                avgScore: Math.round((g._avg?.overallScore ?? 0)),
            })),
            countryBreakdown: countryGroups.map((g) => ({
                country: g.country || "Unknown",
                count: g._count._all,
            })),
            dimensionAverages: dimensionAvgScores,
            questionHeatmap,
            topQuestions: [...questionHeatmap].reverse().slice(0, 5),
            bottomQuestions: [...questionHeatmap].slice(0, 5),
            aiAdoptionScore: Math.round(sa.reportingScore || 0),
            monthlyTrend,
            // New metrics
            assessmentsThisWeek,
            assessmentsThisMonth,
            assessmentsLastMonth,
            monthlyGrowth,
            topCountries,
            topIndustries,
            highestPerformingDimension: { name: highestDimension, score: highestScore },
            lowestPerformingDimension: { name: lowestDimension, score: lowestScore },
            completionTimeTrend,
            aiAdoptionTrend,
            recentAssessments,
        }});
        });
    } catch (error) {
        console.error("[Insights API Error]:", error);
        return Response.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
    }
}
