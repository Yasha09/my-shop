const path = require("path");
const express = require("express");
const multer = require("multer");
const app = express();

//cb-callback, null 1 param -err, file name->image path
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});
  
const upload = multer({ storage: fileStorage});

  //single image
app.post("/single", upload.single("image"), (req, res) => {
  console.log(req.file);
  res.send("File upload success")
});
  //a few images
app.post("/multiple", upload.array("images", 3), (req, res) => {
  console.log(req.files);
  res.send("Multiple Files Upload Success");
});
app.listen(4000);