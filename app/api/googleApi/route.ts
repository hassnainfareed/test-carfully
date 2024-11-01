import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request, res: NextResponse) {
  const { token } = await req.json();

  const response = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_RECAPTCHA_SECRET_KEY}&response=${token}`
  );

  return NextResponse.json(response.data);
}
