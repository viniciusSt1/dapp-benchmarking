import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { rpcEndpoint, ...rpcRequest } = body;

    console.log("RPC Request:", rpcRequest);
    console.log("RPC Endpoint:", rpcEndpoint);

    if (!rpcEndpoint) {
      return NextResponse.json(
        { error: "rpcEndpoint não fornecida" },
        { status: 400 }
      );
    }

    const response = await fetch(rpcEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rpcRequest),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (e: any) {
    console.log(e);
    return NextResponse.json(
      { error: e.message ?? "Erro ao chamar RPC" },
      { status: 500 }
    );
  }
}
