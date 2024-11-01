import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

export async function GET(req: Request, res: Response) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session!.user!.email!,
    },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    return new NextResponse("Benuter existiert nicht", { status: 401 });
  }

  const addresses = await prisma.address.findMany({
    where: {
      userId: user?.id,
    },
    select: {
      id: true,
      createdAt: true,
      genderType: true,
      firstname: true,
      lastname: true,
      companyName: true,
      street: true,
      number: true,
      additional: true,
      postalCode: true,
      city: true,
      addressType: true,
    },
  });

  return NextResponse.json(addresses, { status: 200 });
}

export async function POST(req: Request, res: Response) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  const params = await req.json();

  const user = await prisma.user.findUnique({
    where: {
      email: session!.user!.email!,
    },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    return NextResponse.json("Benuter existiert nicht", { status: 400 });
  }

  const address = await prisma.address.create({
    data: {
      genderType: params.genderType,
      firstname: params.firstname,
      lastname: params.lastname,
      companyName: params.companyName,
      street: params.street,
      number: params.number,
      additional: params.additional,
      postalCode: params.postalCode,
      city: params.city,
      addressType: params.addressType,
      userId: user?.id!,
    },
    select: {
      id: true,
      genderType: true,
      firstname: true,
      lastname: true,
      companyName: true,
      street: true,
      number: true,
      additional: true,
      postalCode: true,
      city: true,
      addressType: true,
    },
  });

  return NextResponse.json(address, { status: 200 });
}

export async function PUT(req: Request, res: Response) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session!.user!.email!,
    },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    return NextResponse.json("Benuter existiert nicht", { status: 400 });
  }

  const params = await req.json();

  if (params.addressType === "PRIVATE") {
    params.companyName = null;
  }

  const address = await prisma.address.update({
    data: {
      genderType: params.genderType,
      firstname: params.firstname,
      lastname: params.lastname,
      companyName: params.companyName,
      street: params.street,
      number: params.number,
      additional: params.additional,
      postalCode: params.postalCode,
      city: params.city,
      addressType: params.addressType,
    },
    where: {
      id: params.id,
      userId: user?.id,
    },
    select: {
      id: true,
      genderType: true,
      firstname: true,
      lastname: true,
      companyName: true,
      street: true,
      number: true,
      additional: true,
      postalCode: true,
      city: true,
      addressType: true,
    },
  });

  return NextResponse.json(address, { status: 200 });
}

export async function DELETE(req: NextRequest, res: Response) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json(null, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session!.user!.email!,
    },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    return NextResponse.json("Benuter existiert nicht", { status: 400 });
  }

  const address = await prisma.address.delete({
    where: {
      id: id,
      userId: user?.id,
    },
  });

  return NextResponse.json(address, { status: 200 });
}
