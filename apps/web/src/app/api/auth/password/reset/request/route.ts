import { NextResponse } from "next/server";

import { requestPasswordReset } from "@/lib/server/password-auth";

type PasswordResetRequestBody = {
  email?: unknown;
};

export async function POST(request: Request) {
  const body = (await request.json()) as PasswordResetRequestBody;

  if (typeof body.email !== "string") {
    return NextResponse.json(
      { error: "Invalid password reset request" },
      { status: 400 },
    );
  }

  try {
    const response = await requestPasswordReset({ email: body.email });
    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Password reset request failed" },
      { status: 400 },
    );
  }
}
