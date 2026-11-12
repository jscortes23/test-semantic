#!/usr/bin/env bash
# Creates the branch rulesets for main, develop and deploy/*.
# Usage: RELEASE_APP_ID=<github-app-id> ./scripts/github-rulesets.sh <owner/repo>
# Requires: gh CLI authenticated as a repository admin.
set -euo pipefail

repo="${1:?usage: RELEASE_APP_ID=<id> github-rulesets.sh <owner/repo>}"
app_id="${RELEASE_APP_ID:?set RELEASE_APP_ID to the numeric ID of the release GitHub App}"

bypass_actors=$(cat <<JSON
[{ "actor_id": ${app_id}, "actor_type": "Integration", "bypass_mode": "always" }]
JSON
)

source_branch_ruleset() {
  local name="$1" branch="$2" strict="$3"

  cat <<JSON
{
  "name": "${name}",
  "target": "branch",
  "enforcement": "active",
  "conditions": { "ref_name": { "include": ["refs/heads/${branch}"], "exclude": [] } },
  "bypass_actors": ${bypass_actors},
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    {
      "type": "pull_request",
      "parameters": {
        "required_approving_review_count": 1,
        "dismiss_stale_reviews_on_push": false,
        "require_code_owner_review": false,
        "require_last_push_approval": false,
        "required_review_thread_resolution": true,
        "allowed_merge_methods": ["merge"]
      }
    },
    {
      "type": "required_status_checks",
      "parameters": {
        "strict_required_status_checks_policy": ${strict},
        "required_status_checks": [
          { "context": "Lint, typecheck and build" },
          { "context": "Commit messages" },
          { "context": "Secret scan" },
          { "context": "Conventional PR title" }
        ]
      }
    }
  ]
}
JSON
}

deploy_ruleset() {
  cat <<JSON
{
  "name": "deploy branches",
  "target": "branch",
  "enforcement": "active",
  "conditions": { "ref_name": { "include": ["refs/heads/deploy/*"], "exclude": [] } },
  "bypass_actors": ${bypass_actors},
  "rules": [
    { "type": "deletion" },
    { "type": "update" }
  ]
}
JSON
}

create() {
  echo "Creating ruleset: $1"
  gh api --method POST "repos/${repo}/rulesets" --input - >/dev/null
}

source_branch_ruleset "main" "main" true | create "main"
source_branch_ruleset "develop" "develop" false | create "develop"
deploy_ruleset | create "deploy branches"

echo "Done. Review them at https://github.com/${repo}/settings/rules"
