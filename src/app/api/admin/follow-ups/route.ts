import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const params = url.searchParams;
    const search = params.get("search") || undefined;
    const status = params.get("status") || undefined;
    const page = Math.max(1, parseInt(params.get("page") || "1", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(params.get("pageSize") || "10", 10)));

    const where: any = {};
    if (status && status !== "all") where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, records] = await Promise.all([
      db.assessmentFollowUp.count({ where }),
      db.assessmentFollowUp.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          assessment: {
            select: {
              overallScore: true,
              tier: true,
              industry: true,
            },
          },
        },
      }),
    ]);

    return Response.json({
      ok: true,
      data: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        records: records.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
        })),
      },
    });
  } catch (err) {
    console.error("[api/admin/follow-ups] error:", err);
    return Response.json({ ok: false, error: "internal error" }, { status: 500 });
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
    if (!id) return Response.json({ ok: false, error: "Missing id" }, { status: 400 });

    await db.assessmentFollowUp.delete({ where: { id } });
    return Response.json({ ok: true, data: { success: true } });
  } catch (err) {
    console.error("[api/admin/follow-ups DELETE] error:", err);
    return Response.json({ ok: false, error: "internal error" }, { status: 500 });
  }
}
