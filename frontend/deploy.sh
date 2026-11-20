#!/usr/bin/env bash
# =============================================================================
# 手元（Mac mini・MacBook Air）から mothershipremote.com へデプロイする
#
#   ./deploy.sh            確認 → ビルド → アップロード
#   ./deploy.sh --dry-run  何が変わるかを表示するだけ（サーバーは変えない）
#
# 前提：~/.ssh/config に「Host mothership」（エックスサーバーへの接続）があること。
#
# 本番に出すのは「GitHub の main と同じコード」だけ。
# コミットしていない変更や、push していないコミットがあると止まる。
# （WordPress の更新で GitHub Actions が main からビルドし直すため、
#   main に無い変更を出すと、あとで黙って消えてしまう）
# =============================================================================
set -euo pipefail

SSH_HOST="mothership"
DEPLOY_PATH="/home/xs082238/mothershipremote.com/public_html/"
BRANCH="main"

cd "$(dirname "$0")"
FRONTEND_DIR="$(pwd)"
EXCLUDE_FILE="$FRONTEND_DIR/deploy-exclude.txt"

DRY_RUN=false
case "${1:-}" in
  "") ;;
  --dry-run|-n) DRY_RUN=true ;;
  -h|--help) sed -n '2,14p' "$0"; exit 0 ;;
  *) echo "使い方：./deploy.sh [--dry-run]" >&2; exit 2 ;;
esac

say()  { printf '\033[1m▶ %s\033[0m\n' "$*"; }
warn() { printf '\033[33m! %s\033[0m\n' "$*" >&2; }
die()  { printf '\033[31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

# ---- 1. Git の状態を確認 ----------------------------------------------------
say "Git の状態を確認"
problems=()
current_branch="$(git rev-parse --abbrev-ref HEAD)"
[ "$current_branch" = "$BRANCH" ] || problems+=("いまのブランチは $current_branch です（$BRANCH に切り替えてください）")

if [ -n "$(git status --porcelain)" ]; then
  problems+=("コミットしていない変更があります（git status で確認）")
fi

git fetch --quiet origin "$BRANCH" || die "GitHub から最新の状態を取れませんでした（ネットワークを確認）"
local_head="$(git rev-parse HEAD)"
remote_head="$(git rev-parse "origin/$BRANCH")"
if [ "$local_head" != "$remote_head" ]; then
  if git merge-base --is-ancestor "$remote_head" "$local_head"; then
    problems+=("push していないコミットがあります（git push してください）")
  elif git merge-base --is-ancestor "$local_head" "$remote_head"; then
    problems+=("GitHub の方が新しい状態です（git pull してください）")
  else
    problems+=("GitHub と手元の履歴が分かれています（git pull で統合してください）")
  fi
fi

if [ ${#problems[@]} -gt 0 ]; then
  for p in "${problems[@]}"; do warn "$p"; done
  if $DRY_RUN; then
    warn "（--dry-run なので続けます。本番のデプロイでは、ここで止まります）"
  else
    die "本番に出すのは GitHub の $BRANCH と同じコードだけです。上の点を直してから、もう一度実行してください"
  fi
else
  echo "  $BRANCH = origin/$BRANCH（$(git rev-parse --short HEAD)）"
fi

# ---- 2. ビルド ---------------------------------------------------------------
[ -f "$EXCLUDE_FILE" ] || die "$EXCLUDE_FILE がありません（WordPress を消さないための除外の一覧）"
grep -q '^/api\.mothershipremote\.com/$' "$EXCLUDE_FILE" \
  || die "deploy-exclude.txt に /api.mothershipremote.com/ がありません。WordPress が消えるので中止します"

say "ビルド（npm run build）"
if [ ! -d node_modules ]; then
  npm ci
fi
rm -rf out
npm run build

# 中身の無い out/ を --delete で上げると、サイトが消える。最低限の中身を確かめる
[ -f out/index.html ] && [ -d out/_next ] || die "out/ にサイトが書き出されていません。中止します"

# ---- 3. アップロード ---------------------------------------------------------
rsync_opts=(-rlz --delete --checksum --itemize-changes --exclude-from="$EXCLUDE_FILE" -e ssh)
if $DRY_RUN; then
  say "変わるもの（--dry-run：サーバーは変えません）"
  rsync -n "${rsync_opts[@]}" out/ "$SSH_HOST:$DEPLOY_PATH"
  say "ここまでが予定です。本番に出すときは ./deploy.sh を実行してください"
else
  say "アップロード（$SSH_HOST:$DEPLOY_PATH）"
  rsync "${rsync_opts[@]}" out/ "$SSH_HOST:$DEPLOY_PATH"
  say "完了：https://mothershipremote.com/"
fi
