import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { getLiveblocks, getUserCursorColor } from "@/lib/liveblocks";
import { getCurrentIdentity, getProjectAccess } from "@/lib/project-access";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const room: string | undefined = body?.room;

  if (!room) {
    return NextResponse.json({ error: "Missing room" }, { status: 400 });
  }

  const identity = await getCurrentIdentity();
  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await getProjectAccess(room, identity);
  if (!project) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const lb = getLiveblocks();

  await lb.getOrCreateRoom(room, {
    defaultAccesses: ["room:write"],
  });

  const user = await currentUser();
  const name =
    user?.fullName ??
    user?.firstName ??
    identity.email ??
    "Anonymous";
  const avatar = user?.imageUrl ?? "";
  const cursorColor = getUserCursorColor(identity.userId);

  const { status, body: responseBody } = await lb.identifyUser(
    identity.userId,
    { userInfo: { name, avatar, cursorColor } }
  );

  return new Response(responseBody, { status });
}
