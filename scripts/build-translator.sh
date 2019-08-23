#!/bin/bash

set -eu

if [ -e ./build/translator/node_modules ]; then
  mv ./build/translator/node_modules ./cache/translator-node_modules
fi

rm -rf ./build/translator
cp -r origin ./build/translator
rm -rf ./build/translator/.git

if [ -e ./cache/translator-node_modules ]; then
  mv ./cache/translator-node_modules ./build/translator/node_modules
fi

(cd ./build/translator && yarn add turndown @types/turndown)
npx ts-node scripts/patch-for-translator.ts
(cd ./build/translator && yarn run build)

mkdir -p ./build/translator/www/__/firebase
cp ./config/init.json ./build/translator/www/__/firebase
