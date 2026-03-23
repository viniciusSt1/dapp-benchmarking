import path from "path";
import fs from "fs";
import solc from "solc";

export function compileSolidity(
  source: string,
  contractName: string,
  evmVersion: string = "shanghai"
) {

  console.log("Compilando com: ", evmVersion);
  const input = {
    language: "Solidity",
    sources: {
      "Contract.sol": {
        content: source,
      },
    },
    settings: {
      evmVersion,
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode"],
        },
      },
    },
  };

  function findImports(importPath: string) {
    try {
      // resolve dentro do node_modules
      const fullPath = path.resolve("node_modules", importPath);
      const content = fs.readFileSync(fullPath, "utf8");

      return { contents: content };
    } catch (err) {
      try {
        // resolve imports locais (caso tenha)
        const content = fs.readFileSync(importPath, "utf8");
        return { contents: content };
      } catch {
        return { error: "File not found" };
      }
    }
  }

  const output = JSON.parse(
    solc.compile(JSON.stringify(input), {
      import: findImports,
    })
  );

  if (output.errors) {
    const fatal = output.errors.find((e: any) => e.severity === "error");
    if (fatal) {
      throw new Error(fatal.formattedMessage);
    }
  }

  const contract = output.contracts?.["Contract.sol"]?.[contractName];

  if (!contract) {
    throw new Error(`Contrato '${contractName}' não encontrado`);
  }

  const bytecode = contract.evm.bytecode.object;

  if (!bytecode || bytecode.length === 0) {
    throw new Error("Bytecode vazio");
  }

  return {
    abi: contract.abi,
    bytecode: bytecode.startsWith("0x") ? bytecode : `0x${bytecode}`,
  };
}