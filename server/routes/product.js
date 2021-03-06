const express = require("express");
const router = express.Router();
const multer = require("multer");
const { User } = require("../models/User");
const { Product } = require("../models/Product");

const { auth } = require("../middleware/auth");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg" || ext !== ".png") {
      return cb(res.status(400).end("only jpg, png are allowed"), false);
    }
    cb(null, true);
  },
});

var upload = multer({ storage: storage }).single("file");

//=================================
//             User
//=================================

router.post("/uploadImage", auth, (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.json({ success: false, err });
    return res.json({
      success: true,
      image: res.req.file.path,
      filename: res.req.file.filename,
    });
  });
});

router.post("/uploadProduct", auth, (req, res) => {
  const product = new Product(req.body);
  console.log("variable = " + Product);

  product.save((err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

router.post("/getProducts", auth, (req, res) => {
  // console.log(req.body.skip + "  " + req.body.limit);
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);

  let findArgs = {};
  console.log(req.body.filters);
  for (let key in req.body.filters) {
    // console.log(key);

    if (req.body.filters[key].length > 0) {
      if (key === "price") {
      } else {
        findArgs[key] = req.body.filters[key];
        // console.log(req.body.filters[key]);
      }
    }
  }
  console.log(findArgs);
  Product.find(findArgs)
    //.populate("writer")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, products) => {
      if (err) return res.status(400).json({ success: false, err });
      res
        .status(200)
        .json({ success: true, products, postSize: products.length });
    });
});

module.exports = router;
