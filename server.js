const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const auth = require("./util/auth");

const path = require("path");
const express = require("express");

const multer = require("multer");
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

// app.post("/single", upload.single("image"), (req, res) => {
//   res.send({image: req.file.filename});
// });

app.post('/single', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.sendStatus(500);
    }
    res.send(JSON.stringify({ image: req.file.filename}));
  });
});


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: auth,
  introspection: true,
  playground: true
});

mongoose.set("useFindAndModify", false);

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Mongodb connected successfully");
    return server.listen(process.env.PORT);
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  });
