import { headers } from "next/headers";
import { Webhook } from "svix";

import { connectToDatabase } from "@/lib/db";
import { handleUserCreated } from "@/services/webhook.service";

export async function POST(req: Request) {
  const WEBHOOK_SECRET =
    process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return Response.json(
      {
        success: false,
        message: "Webhook secret missing",
      },
      { status: 500 }
    );
  }

  const payload = await req.text();

  const headerPayload = await headers();

  const svixId =
    headerPayload.get("svix-id");

  const svixTimestamp =
    headerPayload.get("svix-timestamp");

  const svixSignature =
    headerPayload.get("svix-signature");

  if (
    !svixId ||
    !svixTimestamp ||
    !svixSignature
  ) {
    return Response.json(
      {
        success: false,
        message: "Missing Svix headers",
      },
      { status: 400 }
    );
  }

  const wh = new Webhook(
    WEBHOOK_SECRET
  );

  let evt: Record<string, unknown>;

  try {
    evt = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as Record<string, unknown>;
  } catch {
    return Response.json(
      {
        success: false,
        message: "Invalid webhook signature",
      },
      { status: 400 }
    );
  }

  const eventType = evt.type;

  await connectToDatabase();

  if (eventType === "user.created") {
    await handleUserCreated(
      evt.data as never
    );
  }

  return Response.json({
    success: true,
  });
}