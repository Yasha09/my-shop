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
const fs = require('fs')
const unlinkAsync = promisify(fs.unlink);
const productsModel  = require('./graphql/resolvers/product');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + path.extname(file.originalname));
  },
});
app.use(express.static(__dirname + '/images'));
app.use('/images', express.static(__dirname + '/images'));

app.get("/images", (req, res) => { });

const upload = multer({ storage: fileStorage});

app.post("/single", upload.single("image"), (req, res) => {
  let product = req.body;
  product.image = req.file;
  let images =  product.image;
  productsModel.Mutation.adminCreateProduct("",{product,images});
   res.send("File upload success");
});
app.post('/deleteImage', upload.single("image"), async (req, res) =>{
  let productId = req.body.product_id;
  let product = product.Query.productById("", productId);
  let image = product.image;

  await unlinkAsync("/images/" + image);

  product.Mutation.adminDeleteProductImage("", product.id);
});


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: auth,
  introspection: true,
  playground: true,
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
