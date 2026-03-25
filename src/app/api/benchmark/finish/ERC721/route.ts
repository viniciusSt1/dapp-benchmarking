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
  const row1 = summaryTable.find("tr").eq(1).find("td");
  const row2 = summaryTable.find("tr").eq(2).find("td");

  const result = {
    mint: {
        name: row1.eq(0).text(),
        success: Number(row1.eq(1).text()),
        failures: Number(row1.eq(2).text()),
        sendRate: Number(row1.eq(3).text()),
        throughput: Number(row1.eq(7).text()),
        latency: { min: Number(row1.eq(5).text()), avg: Number(row1.eq(6).text()), max: Number(row1.eq(4).text()) },
        date: Date.now(),
        status: "completed",
    }, 
    transferfrom: {
        name: row2.eq(0).text(),
        success: Number(row2.eq(1).text()),
        failures: Number(row2.eq(2).text()),
        sendRate: Number(row2.eq(3).text()),
        throughput: Number(row2.eq(7).text()),
        latency: { min: Number(row2.eq(5).text()), avg: Number(row2.eq(6).text()), max: Number(row2.eq(4).text()) },
        date: Date.now(),
        status: "completed",
    }
  };

  return NextResponse.json({ result });
}