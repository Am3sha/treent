import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";
import { authOptions } from "@/auth";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return Response.json(
      { ok: false, error: "Current password and new password are required." },
      { status: 400 }
    );
  }

  if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
    return Response.json(
      { ok: false, error: "Invalid input types." },
      { status: 400 }
    );
  }

  if (newPassword.length < 12) {
    return Response.json(
      { ok: false, error: "New password must be at least 12 characters." },
      { status: 400 }
    );
  }

  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminPasswordHash) {
    return Response.json(
      { ok: false, error: "Server configuration error." },
      { status: 500 }
    );
  }

  const currentMatch = await bcrypt.compare(currentPassword, adminPasswordHash);
  if (!currentMatch) {
    return Response.json(
      { ok: false, error: "Current password is incorrect." },
      { status: 403 }
    );
  }

  const newHash = await bcrypt.hash(newPassword, 12);

  return Response.json({
    ok: true,
    newHash,
    instructions:
      "Copy the new hash below and update the ADMIN_PASSWORD_HASH environment variable in your hosting platform (e.g., Vercel → Settings → Environment Variables). After updating, restart the application and log in with your new password.",
  });
}
