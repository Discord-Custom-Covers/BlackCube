# BlackCube - USRBG handler bot v2
## Server Setup (case sensitive)
### Roles
* Full auth over approval and denial - `BlackCube Auth`
* Blocked from making requests - `BlackCube Blacklist`
### Channels
* The bot will only accept requests in this channel - `background-requests`
## Commands
* Base command - `/bg`
* First argument (required) - `link`
  * This argument is the link to the image that will be shown on your profile
  * Link must be a valid image from one of the following providers:
    1. Imgur - `i.imgur.com`
    2. Unsplash - `images.unsplash.com`
    3. Discord - `cdn.discordapp.com` or `media.discordapp.net`
* Second argument (optional) - `position`
  * This argument will change the alignment of the image
  * If left blank it will default to center alignment
  * argument must be one of two types:
    1. `left`
    2. `right`
## Developer Utils
### `src/utils`
* Register bot commands with Discord - `build-commands.js` (Sys)
* Compile the database into css - `build-css.js` (Sys)
* Seed the database with users from the old bot - `seed.js` (Sys)
* Load test the file hosting - `web-test.js` (User)
  * The arguments for this util are as follows:
    1. The number of requests to make - `int`
    2. Toggle verbose mode (output failed request details) - `--verbose` or `-v`
### `src/handlers`
* Manual database interaction - `Database.js` (Sys, User)
  * Arguments are input based on the format of `valid interaction (input position)`
  * The arguments for calling this manually are as follows:
    * The type of interaction - e.g. `--create` or `-c` (all types follow CRUD) - all (1)
    * The selector value for the interaction - `string` - read & delete (2), update (3)
    * The selector "key" (if not set defaults to uid) - `string` - read & delete (3), update (4)
    * The params for a user - `{uid: 'string', img: 'string', orientation: 'string'}` - create & update (2)
## Deployment
1. Update Caddyfile to preference
2. Create a `config.json` file in the `src` dir
3. Put your `clientId` and `token` in the config
4. Dockerize and run by running `./deploy.sh`