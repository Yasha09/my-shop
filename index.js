const path = require("path");
const express = require("express");
const multer = require("multer");
let bodyParser = require("body-parser");
let urlencodedParser = bodyParser.json({ extended: false });

const app = express();
const { promisify } = require('util')
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now()  + path.extname(file.originalname));
  },
});
app.use(express.static(__dirname + '/images'));
app.use('/images', express.static(__dirname + '/images'));

app.get("/images", (req, res) => { });

app.get('/', function(request,response){
  response.sendFile(__dirname + '/index.html')
});
const upload = multer({ storage: fileStorage}).single('file');

app.post('/graphql', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.sendStatus(500);
    }
    res.send(JSON.stringify({ image: req.file.filename}));
  });
});
app.listen(3000);