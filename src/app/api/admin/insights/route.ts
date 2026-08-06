import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";
import { BENCHMARK_QUESTIONS } from "@/lib/content";
import { prismaRetry } from "@/lib/prisma-retry";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
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
                    strategyScore: true,
                    technologyScore: true,
                    cultureScore: true,
                    dataScore: true,
                    operationsScore: true,
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
                    strategyScore: true,
                    technologyScore: true,
                    cultureScore: true,
                    dataScore: true,
                    operationsScore: true,
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
            db.assessment.findMany({
                select: {
                    responses: true,
                    createdAt: true,
                    overallScore: true,
                    durationSec: true,
                    dataScore: true,
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
            aiAdoptionTrendMap[month].aiScores.push(a.dataScore);
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
            const responses = a.responses as Record<string, number>;
            if (!responses) return;
            Object.entries(responses).forEach(([qId, val]) => {
                if (!questionStats[qId]) questionStats[qId] = [];
                questionStats[qId].push(val);
            });
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
            strategy: Math.round(scoreAggregates._avg.strategyScore || 0),
            technology: Math.round(scoreAggregates._avg.technologyScore || 0),
            culture: Math.round(scoreAggregates._avg.cultureScore || 0),
            data: Math.round(scoreAggregates._avg.dataScore || 0),
            operations: Math.round(scoreAggregates._avg.operationsScore || 0),
        };

        const dimensions = Object.entries(dimensionAvgScores);
        const [highestDimension, highestScore] = dimensions.reduce((max, current) => current[1] > max[1] ? current : max, ['', 0]);
        const [lowestDimension, lowestScore] = dimensions.reduce((min, current) => current[1] < min[1] ? current : min, ['', 100]);

        const topCountries = countryGroups
            .filter(g => g.country)
            .map(g => ({
                country: g.country || "Unknown",
                count: g._count._all,
                avgScore: Math.round(g._avg.overallScore || 0),
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        const topIndustries = industryGroups
            .filter(g => g.industry)
            .map(g => ({
                industry: g.industry || "Unknown",
                count: g._count._all,
                avgScore: Math.round(g._avg.overallScore || 0),
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // 6. Final Assembly
        return Response.json({
            totalAssessments: totalCount,
            averageScore: Math.round(scoreAggregates._avg.overallScore || 0),
            averageDuration: Math.round(scoreAggregates._avg.durationSec || 0),
            completionRate: totalCount > 0 ? 100 : 0,
            scoreDistribution,
            tierBreakdown: tierGroups.map((g) => ({
                tier: g.tier,
                count: g._count._all,
                percentage: totalCount ? Math.round((g._count._all / totalCount) * 100) : 0,
                avgScore: Math.round(g._avg.overallScore || 0),
            })),
            industryBenchmark: industryGroups.map((g) => ({
                industry: g.industry || "Unknown",
                count: g._count._all,
                avgScore: Math.round(g._avg.overallScore || 0),
                avgStrategyScore: Math.round(g._avg.strategyScore || 0),
                avgTechnologyScore: Math.round(g._avg.technologyScore || 0),
                avgCultureScore: Math.round(g._avg.cultureScore || 0),
                avgDataScore: Math.round(g._avg.dataScore || 0),
                avgOperationsScore: Math.round(g._avg.operationsScore || 0),
            })),
            sizeBenchmark: sizeGroups.map((g) => ({
                size: g.companySize || "Unknown",
                count: g._count._all,
                avgScore: Math.round(g._avg.overallScore || 0),
            })),
            countryBreakdown: countryGroups.map((g) => ({
                country: g.country || "Unknown",
                count: g._count._all,
            })),
            dimensionAverages: dimensionAvgScores,
            questionHeatmap,
            topQuestions: [...questionHeatmap].reverse().slice(0, 5),
            bottomQuestions: [...questionHeatmap].slice(0, 5),
            aiAdoptionScore: Math.round(scoreAggregates._avg.dataScore || 0),
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
        });
        });
    } catch (error) {
        console.error("[Insights API Error]:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
