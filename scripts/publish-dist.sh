#!/usr/bin/env bash
set -euo pipefail

branch="${1:?usage: publish-dist.sh <deploy-branch> <version>}"
version="${2:?usage: publish-dist.sh <deploy-branch> <version>}"
dist="$(pwd)/dist"
repo_url="https://x-access-token:${DEPLOY_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
work="$(mktemp -d)"

if [ ! -f "$dist/index.html" ]; then
  echo "dist/index.html not found. Run the build first." >&2
  exit 1
fi

cd "$work"
git init -q
git remote add origin "$repo_url"

if git ls-remote --exit-code --heads origin "$branch" >/dev/null 2>&1; then
  git fetch -q --depth=1 origin "$branch"
  git checkout -q -b "$branch" FETCH_HEAD
else
  git checkout -q --orphan "$branch"
fi

git rm -rq --ignore-unmatch . >/dev/null 2>&1 || true
cp -R "$dist"/. .
git config user.name "release-bot"
git config user.email "release-bot@users.noreply.github.com"
git add -A

if git diff --cached --quiet; then
  echo "No changes to deploy on $branch."
  exit 0
fi

git commit -q -m "deploy: v${version} (${GITHUB_SHA:0:7})"
git push -q origin "$branch"
echo "Published v${version} to $branch."
