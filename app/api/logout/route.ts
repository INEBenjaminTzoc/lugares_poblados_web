import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function GET() {
  const cookie = serialize("user_role", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(0),
  });

  const response = NextResponse.json({ message: "Sesión cerrada" });
  response.headers.set("Set-Cookie", cookie);

  return response;
}