import { NextResponse } from "next/server";

import { isLocale } from "@/i18n/config";
import { signupWithPassword } from "@/lib/server/password-auth";

type PasswordSignupBody = {
  email?: unknown;
  locale?: unknown;
  password?: unknown;
};

export async function POST(request: Request) {
  let body: PasswordSignupBody;

  try {
    body = (await request.json()) as PasswordSignupBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid signup request" },
      { status: 400 },
    );
  }

  if (
    typeof body.email !== "string" ||
    typeof body.password !== "string" ||
    typeof body.locale !== "string" ||
    !isLocale(body.locale)
  ) {
    return NextResponse.json(
      { error: "Invalid signup request" },
      { status: 400 },
    );
  }

  try {
    const response = await signupWithPassword({
      email: body.email,
      locale: body.locale,
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
