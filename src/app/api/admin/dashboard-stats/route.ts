import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";
import { prismaRetry } from "@/lib/prisma-retry";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Group 1: Counts and KPIs (critical)
    const countsAndKpis = await prismaRetry(async () => {
      const [
        totalAssessments,
        avgScoreData,
        avgDurationData,
        totalFollowUps,
        totalContacts,
        totalCareers,
        totalNewsletter,
      ] = await Promise.all([
        db.assessment.count(),
        db.assessment.aggregate({ _avg: { overallScore: true } }),
        db.assessment.aggregate({ _avg: { durationSec: true } }),
        db.assessmentFollowUp.count(),
        db.contactInquiry.count(),
        db.careerApplication.count(),
        db.newsletterSubscriber.count(),
      ]);

      return {
        totalAssessments,
        averageScore: avgScoreData._avg.overallScore ? Math.round(avgScoreData._avg.overallScore) : 0,
        averageDuration: avgDurationData._avg.durationSec ? Math.round(avgDurationData._avg.durationSec) : 0,
        totalFollowUps,
        totalContacts,
        totalCareers,
        totalNewsletter,
      };
    });

    // Group 2: Recent Activity (optional - graceful degradation)
    let latestAssessments: any[] = [];
    let recentContacts: any[] = [];
    let recentCareers: any[] = [];

    try {
      [latestAssessments, recentContacts, recentCareers] = await prismaRetry(async () => {
        return await Promise.all([
          db.assessment.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              companyName: true,
              respondentName: true,
              respondentEmail: true,
              overallScore: true,
              tier: true,
              createdAt: true,
            },
          }),
          db.contactInquiry.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
          db.careerApplication.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
        ]);
      });
    } catch (error) {
      console.warn("[Dashboard Stats] Recent activity failed to load:", error);
      // Leave as empty arrays
    }

    return Response.json({
      ...countsAndKpis,
      latestAssessments,
      recentContacts,
      recentCareers,
    });
  } catch (error) {
    console.error("[Dashboard Stats] Critical error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
