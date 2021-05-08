#!/bin/bash
set -ex
DEFAULT_RELEASE_TYPE=npm


RELEASE_TYPE=$1
if [ -z ${1+x} ]; then
  RELEASE_TYPE=$DEFAULT_RELEASE_TYPE
fi

TAG=$2
if [ -z ${2+x} ]; then
  LATEST_TAG=`git for-each-ref --sort=-taggerdate --count=1 --format '%(tag)' refs/tags | cut -d'-' -f2-`
  IFS='.'
  read -ra PARTS <<< "$LATEST_TAG"
  IFS=' '
  PARTS[2]=$((PARTS[2] + 1))
  TAG=`echo ${PARTS[0]}.${PARTS[1]}.${PARTS[2]}`
fi

CURRENT_BRANCH=`git branch | grep \* | cut -d ' ' -f2`
CURRENT_COMMIT=`git rev-parse --short HEAD`
npm run tsc

cp widget.* dist/

git checkout releases/$RELEASE_TYPE
rm -f *.js *.css

git pull
cp -rf dist-prod/* .
git add .

TAG=$RELEASE_TYPE-$TAG
git tag -a $TAG -m "Tagging $TAG"

git commit -m "Release to $RELEASE_TYPE from branch $CURRENT_BRANCH with commit id: $CURRENT_COMMIT with tag $TAG"
echo "Release to $RELEASE_TYPE from branch $CURRENT_BRANCH with commit id: $CURRENT_COMMIT with tag $TAG"
git push
git push --tags
git checkout $CURRENT_BRANCH

echo "Release with tag $TAG was pushed"



