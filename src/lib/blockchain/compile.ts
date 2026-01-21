import solc from "solc";

export function compileSolidity(source: string, contractName: string) {
    const input = {
        language: "Solidity",
        sources: {
            "Contract.sol": {
                content: source,
            },
        },
        settings: {
            evmVersion: "london", // --> Definido no genesis.json (evm um pouco antiga no momento)
            outputSelection: {
                "*": {
                    "*": ["abi", "evm.bytecode"],
                },
            },
        },
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));

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
