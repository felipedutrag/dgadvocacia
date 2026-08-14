import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { handle, redirect_url, items } = body;

    if (!handle || !items) {
      return NextResponse.json(
        { error: "Dados incompletos para processar o checkout." },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.checkout.infinitepay.io/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        handle,
        redirect_url,
        items
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("InfinitePay checkout link generation failed:", errorText);
      return NextResponse.json(
        { error: "Erro na resposta do InfinitePay." },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in checkout API route:", error);
    return NextResponse.json(
      { error: error?.message || "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
