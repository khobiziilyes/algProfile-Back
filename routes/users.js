const express = require("express");
const router = express.Router();
const { User, sequelize } = require("../model/User");
const fs = require("fs");
const axios = require("axios");

const Bearer = 'ya29.a0ARrdaM-L9cIiLlo3NFt3mfhQJJpI_S83d-q7qvPi8Z_s2h4C0hTyqfEXj3uUmRZSm2JYKmepuX8y0OGCWWtu8WwnSW49FrSLeV5MVnhZenYJbpGkEWp3oBHcuqACkPud2Fhy403Onfrv26Xd3nzSzVFI0cL42cAh-M5J';

router.get("/:user_id", async (req, res, next) => {
	fs.readFile(
		"./public/image/" + req.params.user_id,
		async (err, data) => {
			const user = await User.findByPk(req.params.user_id);
			res.send({ user: user.toJSON(), image: data.toString() });
		}
	);
});

router.post("/ocr", async (req, res, next) => {
	const data = JSON.stringify({
		requests: req.body.map(_ => ({
				features: [
					{
						type: "TEXT_DETECTION",
					}
				],
				image: {
					content: _,
				}
			})
		)
	});

	const config = {
		method: "post",
		url: "https://content-vision.googleapis.com/v1/images:annotate?alt=json&key=AIzaSyAa8yy0GdcGPHdtD083HiGGx_S0vMPScDM",
		headers: {
			Authorization: "Bearer " + Bearer,
	  		Referer: "https://explorer.apis.google.com",
			"Content-Type": "application/json"
		},
		data: data
	};

	axios(config).then(async response => {
		const textAnnotations = response?.data.responses.map(_ => { const s = _?.textAnnotations; if (s && s[0]) return s[0].description; });
		res.send(textAnnotations);
	}).catch(function (error) {
		console.log(error);
	});
});

router.post("/login", async (req, res, next) => {
	const { image, ...rest } = req.body;
});

module.exports = router;
