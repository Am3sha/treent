import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const contacts = await db.contactInquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
    return Response.json(contacts);
  } catch (error) {
    console.error("[Contact API Error]:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Missing id parameter" }, { status: 400 });
    }

    await db.contactInquiry.delete({
      where: { id },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("[Contact DELETE API Error]:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
