import User from "@/models/User";

interface ClerkUserCreatedData {
  id: string;
  email_addresses: {
    email_address: string;
  }[];
  first_name?: string;
  last_name?: string;
}

export async function handleUserCreated(
  data: ClerkUserCreatedData
) {
  const email = data.email_addresses[0]?.email_address;
    if (!email) {
    console.log(
      "Webhook received user without email"
    );

    return null;
  }

  const firstName = data.first_name || null;
  const lastName = data.last_name || null;
  const fullName = `${data.first_name || ""} ${data.last_name || ""}`.trim() || null;

  const name =
    fullName || email;

  const existingUser = await User.findOne({
    clerkId: data.id,
  });

  if (existingUser) {
    return existingUser;
  }

  const user = await User.create({
    clerkId: data.id,
    email,
    name,
    firstName,
    lastName,
    fullName,
  });

  return user;
}