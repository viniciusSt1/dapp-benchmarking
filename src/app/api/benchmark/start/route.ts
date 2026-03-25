import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

import { spawn } from "child_process";

function runScript(args: string[], cwd: string, contractName: string) {
  return new Promise((resolve, reject) => {
    var sh: string = '';

    if (contractName == "simple")
      sh = "./run-caliper-simple.sh";
    else if (contractName == "MyERC20")
      sh = "./run-caliper-erc20.sh";
    else if (contractName == "MyERC721")
      sh = "./run-caliper-erc721.sh";

    const child = spawn(sh, args, {
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
  const { contractName, functionName, targetSendRate, targetSendRateMint, targetSendRateTransfer, numTransactions, workers, contractAddress, wsEndpoint } = await req.json();

  const reportPath = path.resolve(process.cwd(), "src/caliper/report.html");

  // delete old report
  if (fs.existsSync(reportPath)) {
    fs.unlinkSync(reportPath);
  }

  // run benchmark
  const caliperPath = path.resolve(process.cwd(), "src/caliper");
  var args: string[] = [];
  if (contractName == "simple")
    args = [functionName, targetSendRate.toString(), numTransactions.toString(), workers.toString(), contractAddress, wsEndpoint];
  else if (contractName == "MyERC20")
    args = [functionName, targetSendRate.toString(), numTransactions.toString(), workers.toString(), contractAddress, wsEndpoint];
  else if (contractName == "MyERC721")
    args = [functionName, targetSendRateMint.toString(), targetSendRateTransfer.toString(), numTransactions.toString(), workers.toString(), contractAddress, wsEndpoint];
  else
    return NextResponse.json({ finished: true, error: "É necessário informar o nome do contrato (simple, MyERC20 ou MyERC721)" });

  try {
    console.log("Executando script:", args);
    await runScript(args, caliperPath, contractName);
  } catch (err) {
    console.log("Erro ao executar benchmark:", err);
    return NextResponse.json({ finished: true, error: "Erro ao executar benchmark" });
  }

  return NextResponse.json({ finished: true });
}