#!/bin/bash

set -e

echo "🚀 Iniciando benchmark com Hyperledger Caliper..."

functionName=$1 # Não utilizado no momento
targetSendRateMint=$2
targetSendRateTransfer=$3
numTransactions=$4
workers=$5
contractAddress=$6
wsEndpoint=$7
privateKey=$8
publicKey=$9

tokenId=$(date +%s%3N)

NETWORK_CONFIG="networks/besu/networkconfig.json"

pathConfigYaml="benchmarks/scenario-monitoring/ERC721/config.yaml"

echo "📄 Usando config: $pathConfigYaml"

# atualizar networkconfig.json
echo "🔧 Atualizando networkconfig.json..."

tmp=$(mktemp)

jq --arg addr "$contractAddress" \
  '.ethereum.contracts.MyERC721.address = $addr' \
  "$NETWORK_CONFIG" > "$tmp" && mv "$tmp" "$NETWORK_CONFIG"

jq --arg ws "$wsEndpoint" \
  '.ethereum.url = $ws' \
  "$NETWORK_CONFIG" > "$tmp" && mv "$tmp" "$NETWORK_CONFIG"

jq --arg pk "$publicKey" \
  '.ethereum.fromAddress = $pk' \
  "$NETWORK_CONFIG" > "$tmp" && mv "$tmp" "$NETWORK_CONFIG"

jq --arg pk "$privateKey" \
  '.ethereum.fromAddressPrivateKey = $pk' \
  "$NETWORK_CONFIG" > "$tmp" && mv "$tmp" "$NETWORK_CONFIG"

# atualizar YAML
echo "🔧 Atualizando parâmetros do benchmark..."

sed -i "s/txNumber:.*/txNumber: $numTransactions/" $pathConfigYaml
sed -i "s/tps:.*/tps: $targetSendRate/" $pathConfigYaml
sed -i "/workers:/,/rounds:/ s/number:.*/number: $workers/" $pathConfigYaml
sed -i "s/tokenId: &tokenId .*/tokenId: \&tokenId $tokenId/" $pathConfigYaml

echo "🚀 Executando Caliper..."

npx caliper launch manager \
  --caliper-workspace ./ \
  --caliper-benchconfig $pathConfigYaml \
  --caliper-networkconfig ./networks/besu/networkconfig.json \
  --caliper-bind-sut besu:latest \
  --caliper-flow-skip-install

echo "✅ Benchmark finalizado"
exit 0
