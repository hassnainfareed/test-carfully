import { ApplyJobItem } from "@/components/JoinTheTeam";
import { SendMailJobApply } from "@/templates/mail/sendMailJobApply";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: NextResponse) {
  const applyJobItem: ApplyJobItem = await req.json();

  await SendMailJobApply(applyJobItem);

  return NextResponse.json(null);
}
