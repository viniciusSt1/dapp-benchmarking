import { NextResponse } from "next/server";
import { ContractFactory } from "ethers";
import { wallet } from "@/lib/besu";
import { compileSolidity } from "@/lib/compile";

export async function POST(req: Request) {
  try {
    const { contractSource, contractName } = await req.json();

    const { abi, bytecode } = compileSolidity(
      contractSource,
      contractName
    );

    console.log("Bytecode length:", bytecode.length);

    const factory = new ContractFactory(abi, bytecode, wallet);

    const deployTx = await factory.getDeployTransaction();

    const estimatedGas = await wallet.estimateGas(deployTx);

    console.log("Estimated gas:", estimatedGas.toString());

    const contract = await factory.deploy({
      gasLimit: estimatedGas,
    });

    await contract.waitForDeployment();

    return NextResponse.json({
      address: await contract.getAddress(),
      txHash: contract.deploymentTransaction()?.hash,
      abi,
      bytecode
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message ?? "Deploy failed" },
      { status: 500 }
    );
  }
}
