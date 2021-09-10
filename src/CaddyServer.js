const fs = require("fs");
const http = require('http');

const host = "0.0.0.0";

const port = 4000;

const requestListener = function (req, res) {
	res.writeHead(200);
	res.end(fs.readFileSync("./src/styles/db.css"))
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
	console.log(`Server is running on http://${host}:${port}`);
});