#!/bin/bash
set -ex
npm run tsc
cp README.md dist
cp package.json dist
cd dist
npm publish

