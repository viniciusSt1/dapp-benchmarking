#!/bin/bash

set -e

echo "🚀 Iniciando benchmark com Hyperledger Caliper..."

functionName=$1
targetSendRate=$2
numTransactions=$3
workers=$4
contractAddress=$5
wsEndpoint=$6

NETWORK_CONFIG="networks/besu/networkconfig.json"

# escolher yaml
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

echo "📄 Usando config: $pathConfigYaml"

# atualizar networkconfig.json
echo "🔧 Atualizando networkconfig.json..."

tmp=$(mktemp)

jq --arg addr "$contractAddress" \
  '.ethereum.contracts.simple.address = $addr' \
  "$NETWORK_CONFIG" > "$tmp" && mv "$tmp" "$NETWORK_CONFIG"

jq --arg ws "$wsEndpoint" \
  '.ethereum.url = $ws' \
  "$NETWORK_CONFIG" > "$tmp" && mv "$tmp" "$NETWORK_CONFIG"

# atualizar YAML
echo "🔧 Atualizando parâmetros do benchmark..."

sed -i "s/txNumber:.*/txNumber: $numTransactions/" $pathConfigYaml
sed -i "s/tps:.*/tps: $targetSendRate/" $pathConfigYaml
sed -i "/workers:/,/rounds:/ s/number:.*/number: $workers/" $pathConfigYaml

echo "🚀 Executando Caliper..."

npx caliper launch manager \
  --caliper-workspace ./ \
  --caliper-benchconfig $pathConfigYaml \
  --caliper-networkconfig ./networks/besu/networkconfig.json \
  --caliper-bind-sut besu:latest \
  --caliper-flow-skip-install

echo "✅ Benchmark finalizado"
exit 0
