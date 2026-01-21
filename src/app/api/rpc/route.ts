import { NextResponse } from "next/server";

const RPC_URL = "http://127.0.0.1:8545";

export async function POST(req: Request) {
  const body = await req.json();

  const response = await fetch(RPC_URL, { // Make RPC call
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data);
}
