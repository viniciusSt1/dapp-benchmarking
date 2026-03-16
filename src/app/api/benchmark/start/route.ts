import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

import { spawn } from "child_process";
import * as cheerio from "cheerio";

function runScript(args: string[], cwd: string) {
  return new Promise((resolve, reject) => {
    const child = spawn("./run-caliper.sh", args, {
      cwd,
      shell: false,
      detached: false,
      stdio: "inherit",
    });

    child.on("error", reject);

    child.on("close", (code) => {
      if (code === 0) resolve(true);
      else reject(new Error(`Caliper exited with code ${code}`));
    });
  });
}

export async function POST(req: Request) {
  const { functionName, targetSendRate, numTransactions, workers, contractAddress, wsEndpoint } = await req.json();

  const reportPath = path.resolve(process.cwd(), "src/caliper/report.html");

  // delete old report
  if (fs.existsSync(reportPath)) {
    fs.unlinkSync(reportPath);
  }

  // run benchmark
  const caliperPath = path.resolve(process.cwd(), "src/caliper");
  try {
    await runScript([functionName, targetSendRate.toString(), numTransactions.toString(), workers.toString(), contractAddress, wsEndpoint], caliperPath);
  } catch (err) {
    console.log("Erro ao executar benchmark:", err);
    return NextResponse.json({ finished: true, error: "Erro ao executar benchmark" });
  }

  return NextResponse.json({ finished: true });
}

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
    latency:{min: Number(row.eq(5).text()), avg: Number(row.eq(6).text()), max: Number(row.eq(4).text())},
    date: Date.now(),
    status: "completed",
  };

  return NextResponse.json({ result });
}