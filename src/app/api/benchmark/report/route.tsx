import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET() {
  const reportPath = path.resolve(process.cwd(), "src/caliper/report.html");

  if (!fs.existsSync(reportPath)) {
    return NextResponse.json({ error: "Relatório não encontrado" }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(reportPath);

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "text/html",
      "Content-Disposition": "attachment; filename=report.html",
    },
  });
}