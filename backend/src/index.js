const express = require("express");
const app = express();
const http = require("http").createServer(app);
const { router } = require("./routes");

// Database
require("./database/mongoose");

// CORS
app.use(function (req, res, next) {
	var allowedDomains = ["http://localhost:3000"];
	var origin = req.headers.origin;
	if (allowedDomains.indexOf(origin) > -1) {
		res.setHeader("Access-Control-Allow-Origin", origin);
	}
	res.header(
		"Access-Control-Allow-Methods",
		" GET, POST, PATCH, PUT, DELETE, OPTIONS"
	);
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	next();
});

app.use(express.json());

// Bootstrap routes
app.use("/", router);

const port = process.env.PORT || 3001;
http.listen(port, () => {
	console.log("Server running on port " + port);
});
