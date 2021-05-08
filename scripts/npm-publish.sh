#!/bin/bash
set -ex
projectFolder=`pwd`
tmpFolder="/tmp/RELEASE_$RANDOM"
mkdir $tmpFolder
npm run tsc
cd $tmpFolder
npm pack $projectFolder
tarfile=`ls`
tar xvf $tarfile
cd package
mv README.md dist
mv package.json dist
cd dist
echo $tmpFolder
 npm publish
 rm -rf tmpFolder
 cd $projectFolder

