#!/bin/bash

set -e

echo "🚀 Iniciando benchmark com Hyperledger Caliper..."

npx caliper launch manager \
  --caliper-workspace ./ \
  --caliper-benchconfig benchmarks/scenario-monitoring/Simple/config.yaml \
  --caliper-networkconfig ./networks/besu/networkconfig.json \
  --caliper-bind-sut besu:latest \
  --caliper-flow-skip-install

echo "✅ Benchmark finalizado"
