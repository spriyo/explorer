const { default: mongoose } = require("mongoose");

const router = require("express").Router();

router.get("/nft", async (req, res) => {
	try {
		let query = req.query.query || "";
		let chainId = req.query.chainId;
		let queryOptions = {
			name: { $regex: query, $options: "i" },
		};
		if (chainId) {
			queryOptions.chainId = chainId;
		}
		const nfts = await mongoose.connection.db
			.collection("nfts")
			.aggregate([
				{
					$match: queryOptions,
				},
				{
					$unwind: { path: "$created_by", preserveNullAndEmptyArrays: true },
				},
				{
					$sort: { createdAt: req.query.createdAt === "asc" ? 1 : -1, _id: 1 },
				},
				{
					$facet: {
						paginatedResults: [
							{ $skip: parseInt(!req.query.skip ? 0 : req.query.skip) },
							{ $limit: parseInt(!req.query.limit ? 10 : req.query.limit) },
						],
						totalCount: [
							{
								$count: "count",
							},
						],
					},
				},
			])
			.unwind("$totalCount")
			.toArray();

		res.send(nfts[0]);
	} catch (error) {
		res.status(500).send({ message: error.message });
	}
});

module.exports = router;
