#!/usr/bin/env bash
# Print who visited the portfolio (newest first). Usage: ./visitors.sh [N]   (default 30 rows)
LOG="${VISITOR_LOG:-$HOME/.local/state/pramoth-portfolio-visitors.jsonl}"
[ -f "$LOG" ] || { echo "No visits logged yet ($LOG)"; exit 0; }
N="${1:-30}"
python3 -I - "$LOG" "$N" <<'PY'
import json, sys, datetime, zoneinfo
log, n = sys.argv[1], int(sys.argv[2])
rows = [json.loads(l) for l in open(log) if l.strip()]
ist = zoneinfo.ZoneInfo("Asia/Kolkata")
def when(ts): return datetime.datetime.fromisoformat(ts.replace("Z","+00:00")).astimezone(ist).strftime("%d %b %Y %H:%M")
def dev(ua=""):
    os_ = "iOS" if "iPhone" in ua or "iPad" in ua else "Android" if "Android" in ua else "Windows" if "Windows" in ua else "macOS" if "Mac OS" in ua else "Linux" if "Linux" in ua else "-"
    br = "Edge" if "Edg/" in ua else "Chrome" if "Chrome/" in ua else "Firefox" if "Firefox/" in ua else "Safari" if "Safari/" in ua else "-"
    return f"{os_}/{br}"
intros = [r for r in rows if r.get("type") == "intro"]
views  = [r for r in rows if r.get("type") == "view"]
print(f"{len(views)} page views · {len({v.get('visitorId') or v.get('ua') for v in views})} unique devices · {len(intros)} people introduced themselves\n")
print("── People who said hi ──")
for r in reversed(intros[-n:]):
    print(f"{when(r['ts'])}  {r.get('name','?'):<22} {r.get('role','') :<16} {r.get('company','') :<28} {r.get('email','')}")
    if r.get("note"): print(f"{'':18}  “{r['note']}”")
print("\n── Recent views ──")
for r in reversed(views[-n:]):
    print(f"{when(r['ts'])}  {dev(r.get('ua','')):<16} {r.get('tz','-'):<20} {(r.get('referrer') or 'direct')[:40]:<40} {r.get('ip') or ''}")
PY
