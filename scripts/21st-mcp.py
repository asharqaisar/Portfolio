"""
Minimal MCP client for the 21st.dev HTTP endpoint (https://21st.dev/api/mcp).

Usage:
    python3 scripts/21st-mcp.py tools
    python3 scripts/21st-mcp.py call <tool> '{"json": "args"}'

Reads API_KEY_21ST from .env. Search/metadata calls are free on the 21st free tier;
get_component is metered (2/day), so prefer search output over fetching full source.
"""

import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

URL = "https://21st.dev/api/mcp"
ROOT = Path(__file__).resolve().parent.parent


def api_key() -> str:
    for line in (ROOT / ".env").read_text().splitlines():
        if line.startswith("API_KEY_21ST="):
            return line.split("=", 1)[1].strip().strip('"').strip("'")
    return os.environ.get("API_KEY_21ST", "")


class Session:
    def __init__(self):
        self.session_id = None
        self._id = 0

    def _post(self, payload):
        body = json.dumps(payload).encode()
        req = urllib.request.Request(URL, data=body, method="POST")
        req.add_header("Content-Type", "application/json")
        req.add_header("Accept", "application/json, text/event-stream")
        req.add_header("x-api-key", api_key())
        if self.session_id:
            req.add_header("Mcp-Session-Id", self.session_id)
        try:
            with urllib.request.urlopen(req, timeout=90) as r:
                sid = r.headers.get("Mcp-Session-Id")
                if sid:
                    self.session_id = sid
                return r.read().decode(), r.headers.get("Content-Type", "")
        except urllib.error.HTTPError as e:
            return e.read().decode(), f"HTTPError {e.code}"

    def request(self, method, params=None):
        self._id += 1
        raw, ctype = self._post(
            {"jsonrpc": "2.0", "id": self._id, "method": method, "params": params or {}}
        )
        # streamable HTTP may answer with SSE
        for line in raw.splitlines():
            if line.startswith("data:"):
                raw = line[5:].strip()
                break
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return {"_raw": raw, "_ctype": ctype}

    def notify(self, method, params=None):
        self._post({"jsonrpc": "2.0", "method": method, "params": params or {}})

    def handshake(self):
        res = self.request(
            "initialize",
            {
                "protocolVersion": "2025-06-18",
                "capabilities": {},
                "clientInfo": {"name": "arena-agent", "version": "1.0"},
            },
        )
        self.notify("notifications/initialized")
        return res


def content_of(result):
    parts = result.get("content") or []
    out = []
    for p in parts:
        if p.get("type") == "text":
            out.append(p["text"])
        else:
            out.append(json.dumps(p)[:800])
    return "\n".join(out)


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else "tools"
    s = Session()
    init = s.handshake()
    if "error" in init:
        print("init error:", json.dumps(init["error"])[:400])
        return 1

    if cmd == "tools":
        res = s.request("tools/list")
        for t in res.get("result", {}).get("tools", []):
            print("-", t["name"])
            desc = (t.get("description") or "").replace("\n", " ")
            print("   ", desc[:300])
            schema = t.get("inputSchema", {}).get("properties", {})
            for k, v in schema.items():
                req = k in (t.get("inputSchema", {}).get("required") or [])
                print(f"     · {k}{'*' if req else ''}: {v.get('type')} {(v.get('description') or '')[:160]}")
        return 0

    if cmd == "call":
        name = sys.argv[2]
        args = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
        res = s.request("tools/call", {"name": name, "arguments": args})
        if "error" in res:
            print("error:", json.dumps(res["error"])[:600])
            return 1
        print(content_of(res.get("result", {})))
        return 0

    print("unknown command", cmd)
    return 1


if __name__ == "__main__":
    sys.exit(main())
