import { NextResponse } from "next/server";

import { completePasswordReset } from "@/lib/server/password-auth";

type PasswordResetCompleteBody = {
  token?: unknown;
  newPassword?: unknown;
};

export async function POST(request: Request) {
  const body = (await request.json()) as PasswordResetCompleteBody;

  if (typeof body.token !== "string" || typeof body.newPassword !== "string") {
    return NextResponse.json(
      { error: "Invalid password reset completion" },
      { status: 400 },
    );
  }

  try {
    const response = await completePasswordReset({
      newPassword: body.newPassword,
      token: body.token,
    });
    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Password reset completion failed" },
      { status: 400 },
    );
  }
}
