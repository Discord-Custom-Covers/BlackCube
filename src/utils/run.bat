start cmd /k "caddy run --config /etc/caddy/Caddyfile --adapter caddyfile"
start cmd /k "npx pm2 start src/index.js"