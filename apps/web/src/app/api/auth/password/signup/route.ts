import { NextResponse } from "next/server";

import { signupWithPassword } from "@/lib/server/password-auth";

type PasswordSignupBody = {
  email?: unknown;
  password?: unknown;
};

export async function POST(request: Request) {
  const body = (await request.json()) as PasswordSignupBody;

  if (typeof body.email !== "string" || typeof body.password !== "string") {
    return NextResponse.json(
      { error: "Invalid signup request" },
      { status: 400 },
    );
  }

  try {
    const response = await signupWithPassword({
      email: body.email,
      password: body.password,
    });
    return NextResponse.json(response, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Password signup failed" },
      { status: 400 },
    );
  }
}
