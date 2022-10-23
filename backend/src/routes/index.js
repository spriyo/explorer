const router = require("express").Router();
const nft = require("./nft");

router.use(nft);

module.exports = { router };
