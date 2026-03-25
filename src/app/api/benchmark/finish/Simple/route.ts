import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import * as cheerio from "cheerio";

export async function GET() {
  const reportPath = path.resolve(process.cwd(), "src/caliper/report.html");

  if (!fs.existsSync(reportPath)) {
    return NextResponse.json({ finished: false });
  }

  const html = fs.readFileSync(reportPath, "utf-8");
  const $ = cheerio.load(html);

  // Seleciona a PRIMEIRA tabela do “summary”
  const summaryTable = $("#benchmarksummary table");

  // Pega a segunda linha (primeira de dados)
  const row = summaryTable.find("tr").eq(1).find("td");

  const result = {
    name: row.eq(0).text(),
    success: Number(row.eq(1).text()),
    failures: Number(row.eq(2).text()),
    sendRate: Number(row.eq(3).text()),
    throughput: Number(row.eq(7).text()),
    latency: { min: Number(row.eq(5).text()), avg: Number(row.eq(6).text()), max: Number(row.eq(4).text()) },
    date: Date.now(),
    status: "completed",
  };

  return NextResponse.json({ result });
}