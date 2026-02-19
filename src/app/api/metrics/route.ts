import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { metricsUrl } = await req.json();

    if (!metricsUrl) {
      return NextResponse.json(
        { error: "metricsUrl não fornecido" },
        { status: 400 }
      );
    }

    const res = await fetch(metricsUrl);
    const text = await res.text();

    return new Response(text, {
      headers: { "Content-Type": "text/plain" }
    });

  } catch (e: any) {
    console.error("Metrics API error:", e);
    return NextResponse.json(
      { error: e.message ?? "Erro ao buscar métricas" },
      { status: 500 }
    );
  }
}
