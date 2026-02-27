import { Webhook } from "svix"

export async function POST(req) {
  const payload = await req.text()
  const headers = req.headers

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

  let event

  try {
    event = wh.verify(payload, {
      "svix-id": headers.get("svix-id"),
      "svix-timestamp": headers.get("svix-timestamp"),
      "svix-signature": headers.get("svix-signature"),
    })
  } catch (err) {
    return new Response("Invalid signature", { status: 400 })
  }

  // Example: handle user creation
  if (event.type === "user.created") {
    console.log("New user:", event.data.id)

    // 👉 Create user in your database here
  }

  return new Response("Webhook received", { status: 200 })
}


