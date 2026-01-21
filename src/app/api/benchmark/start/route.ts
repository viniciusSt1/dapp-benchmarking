import { exec } from "child_process";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { promisify } from "util";

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

const statusFileName = "bench-status.json";

function statusFilePath() {
  return path.resolve(process.cwd(), "caliper", statusFileName);
}

async function writeStatus(obj: any) {
  const p = statusFilePath();
  try {
    await writeFile(p, JSON.stringify(obj, null, 2), "utf8");
  } catch (e) {
    console.error("Failed to write status file", e);
  }
}

async function readStatus() {
  const p = statusFilePath();
  try {
    const raw = await readFile(p, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return { running: false, finished: false, stdout: null, stderr: null };
  }
}

export async function GET() { // Get current benchmark status
  let s = await readStatus();

  // If status says running but report.html exists, consider it finished.
  try {
    const reportPath = path.resolve(process.cwd(), "caliper", "report.html");
    if (s.running && fs.existsSync(reportPath)) {
      s = {
        running: false,
        finished: true,
        stdout: `report generated: ${reportPath}`,
        stderr: null,
        finishedAt: new Date().toISOString(),
      };
      await writeStatus(s);
    }
  } catch (e) {
    console.error("Error checking report file", e);
  }

  return NextResponse.json(s);
}

export async function POST() {  // Start a new benchmark
  const current = await readStatus();
  if (current.running) {
    return NextResponse.json({ error: "Benchmark já em execução" }, { status: 409 });
  }

  const initial = { running: true, finished: false, stdout: null, stderr: null, startedAt: new Date().toISOString() };
  await writeStatus(initial);

  const caliperPath = path.resolve(process.cwd(), "caliper");

  exec("./run-caliper.sh", { cwd: caliperPath }, async (err, stdout, stderr) => {
    const result = {
      running: false,
      finished: true,
      stdout: typeof stdout === "string" ? stdout : String(stdout || ""),
      stderr: typeof stderr === "string" ? stderr : String(stderr || ""),
      finishedAt: new Date().toISOString(),
    };

    if (err) {
      result.stderr = (result.stderr || "") + "\n" + String(err.message || err);
      console.error("Erro no Caliper:", err, result.stderr);
    } else {
      console.log(result.stdout);
    }

    await writeStatus(result);
  });

  return NextResponse.json({ status: "started" });
}
