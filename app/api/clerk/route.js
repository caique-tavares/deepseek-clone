import { Webhook } from "svix";
import connectDB from "@/config/db";
import User from "@/models/user";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  const headerPayload = headers();

  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id"),
    "svix-timestamp": headerPayload.get("svix-timestamp"),
    "svix-signature": headerPayload.get("svix-signature"),
  };

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let data, type;

  try {
    const wh = new Webhook(process.env.SIGNING_SECRET);
    ({ data, type } = wh.verify(body, svixHeaders));
    console.log("✅ Webhook verificado com sucesso:", type);
  } catch (err) {
    console.error("❌ Erro ao verificar o webhook:", err);
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    console.log("✅ Conexão com MongoDB estabelecida.");

    const userData = {
      _id: data.id,
      email: data.email_addresses?.[0]?.email_address || "",
      name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      image: data.image_url,
    };

    switch (type) {
      case "user.created":
        await User.create(userData);
        console.log("👤 Usuário criado:", userData);
        break;
      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData);
        console.log("🔄 Usuário atualizado:", userData);
        break;
      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        console.log("🗑️ Usuário deletado:", data.id);
        break;
      default:
        console.warn("⚠️ Evento não tratado:", type);
    }

    return NextResponse.json(
      { message: "Evento processado com sucesso." },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Erro ao processar o webhook:", err);
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}
