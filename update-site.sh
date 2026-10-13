#!/usr/bin/env bash
# Rebuild the portfolio and restart the always-on service.
# Run this after editing anything in src/ or public/.
set -euo pipefail
cd "$(dirname "$0")"

echo "▸ Building production bundle..."
NEXT_DIST_DIR=.next-prod npx next build

# Next caches optimized images; clear it so replaced pictures show immediately.
rm -rf .next-prod/cache/images

echo "▸ Restarting service..."
systemctl --user restart pramoth-portfolio.service
sleep 4

if curl -sfo /dev/null -m 10 http://localhost:3005; then
  ip=$(hostname -I | awk '{print $1}')
  echo "✓ Live at http://localhost:3005  (phone: http://${ip}:3005)"
else
  echo "✗ Server did not respond. Check: journalctl --user -u pramoth-portfolio -n 30"
  exit 1
fi
