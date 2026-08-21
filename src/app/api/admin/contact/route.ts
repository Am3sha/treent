import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const topic = searchParams.get("topic") || "";
    const skip = (page - 1) * limit;

    const where: Prisma.ContactInquiryWhereInput = {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { company: { contains: search, mode: "insensitive" } },
                { message: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        topic ? { topic } : {},
      ],
    };

    const [total, contacts] = await Promise.all([
      db.contactInquiry.count({ where }),
      db.contactInquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    return Response.json({
      ok: true,
      data: contacts,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("[Contact API Error]:", error);
    return Response.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
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

    console.warn("[ADMIN AUDIT]", {
      admin: session.user?.email ?? session.user?.id ?? "unknown",
      action: "delete",
      resource: "contactInquiry",
      id,
      timestamp: new Date().toISOString(),
    });

    await db.contactInquiry.delete({
      where: { id },
    });

    return Response.json({ ok: true, data: { success: true } });
  } catch (error) {
    console.error("[Contact DELETE API Error]:", error);
    return Response.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
  }
}
