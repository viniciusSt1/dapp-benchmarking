#!/bin/bash

set -e

echo "🚀 Iniciando benchmark com Hyperledger Caliper..."

# Parâmetros: $1 = functionName, $2 = targetSendRate, $3 = numTransactions, $4 = workers, $5 = contractAddress
functionName=$1
targetSendRate=$2
numTransactions=$3
workers=$4
contractAddress=$5

# Depois preparar os arquivos dados os parametros
# ...

# Definir arquivo YAML com base na função
if [ "$functionName" = "open" ]; then
  pathConfigYaml="benchmarks/scenario-monitoring/Simple/config-open.yaml"
elif [ "$functionName" = "query" ]; then
  pathConfigYaml="benchmarks/scenario-monitoring/Simple/config-query.yaml"
elif [ "$functionName" = "transfer" ]; then
  pathConfigYaml="benchmarks/scenario-monitoring/Simple/config-transfer.yaml"
else
  echo "❌ Erro: função inválida: $functionName"
  exit 1
fi

npx caliper launch manager \
  --caliper-workspace ./ \
  --caliper-benchconfig $pathConfigYaml \
  --caliper-networkconfig ./networks/besu/networkconfig.json \
  --caliper-bind-sut besu:latest \
  --caliper-flow-skip-install

echo "✅ Benchmark finalizado"
exit 0