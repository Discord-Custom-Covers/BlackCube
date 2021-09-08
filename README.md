# BlackCube
## Building
1. Update Caddyfile to preference
2. Create a `config.json` file in the `src` dir
3. Put your `clientId` and `token` in the config
4. Create a folder `src/styles`
5. Dockerize with `docker build . -t <name>/blackcube`
6. Run the resulting image