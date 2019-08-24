#!/bin/bash

set -eu

if [ -e ./build/docs/node_modules ]; then
  mv ./build/docs/node_modules ./cache/docs-node_modules
fi

rm -rf ./build/docs
cp -r origin ./build/docs
rm -rf ./build/docs/.git

if [ -e ./cache/docs-node_modules ]; then
  mv ./cache/docs-node_modules ./build/docs/node_modules
fi

(cd ./build/docs && yarn install)
npx ts-node scripts/patch-for-docs.ts
(cd ./build/docs && yarn run site.structure)
npx ts-node scripts/translate-structure.ts
(cd ./build/docs && yarn run docs && yarn run prerender)
npx ts-node scripts/translation-stats.ts
