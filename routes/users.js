const express = require("express");
const router = express.Router();
const { User, sequelize } = require("../model/User");
const fs = require("fs");
const axios = require("axios");

router.get("/:user_id", async (req, res, next) => {
  fs.readFile(
    "./public/image/" + req.params.user_id,
    async function (err, data) {
      const user = await User.findByPk(req.params.user_id);
      if (user) {
        res.send({ user: user.toJSON(), image: data.toString() });
      } else {
        res.send("No user found");
      }
    }
  );
});

router.post("/register", async (req, res, next) => {
  const data = JSON.stringify({
    requests: [
      {
        features: [
          {
            type: "TEXT_DETECTION",
          },
        ],
        image: {
          content: req.body.image,
        },
      },
    ],
  });
  const config = {
    method: "post",
    url: "https://content-vision.googleapis.com/v1/images:annotate?alt=json&key=AIzaSyAa8yy0GdcGPHdtD083HiGGx_S0vMPScDM",
    headers: {
      Authorization:
        "Bearer 
        ",
      Referer: "https://explorer.apis.google.com",
      "Content-Type": "application/json",
    },
    data: data,
  };
  axios(config)
    .then(function (response) {
      const { image, ...rest } = req.body;
      const user = await User.create(rest);
      fs.writeFile(
        "./public/image/" + req.body.id,
        Buffer.from(response.data, "base64").toString("ascii"),
        function (err) {
          if (err) throw err;
          console.log("Successfully saved the user image!");
        }
      );
      if (user) return res.send(user.toJSON());
      return res.send("A problem occurred while registering the user");
    })
    .catch(function (error) {
      console.log(error);
    });
});

router.post("/login", async (req, res, next) => {
  const { image, ...rest } = req.body;
});

module.exports = router;
