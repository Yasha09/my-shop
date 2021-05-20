const Product = require("../../models/Product");
const {UserInputError } = require("apollo-server");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  Query: {
    // get products
    products: async () => {
      const res = await Product.find();
      return res;
    }, 
    productById: async (_,args) => {
      return await Product.findOne({_id:args.id }, 
        function(err, product){
          product.image = "/images/" + product.image;
          return JSON.stringify(product); 
        })
    },
  },
  Mutation: {
    adminCreateProduct: async (_, args) => { 
      try {
        const { productInput } = args;
        const products = await Product({ 
          ...productInput
        });
        if (!products) throw new UserInputError("product not found");
          return await products.save();
      } 
      catch (err) {
        console.log(err);
        throw err;
      }
    },
    adminUpdateProduct: async (_, args) => {
      const { productId = "", productInput } = args;
      try{
        const newProduct = await Product.findOneAndUpdate(
          { _id: productId },
           productInput,
          { useFindAndModify: false }
        )
        if(!newProduct) throw new UserInputError("product not found");
          return newProduct;
        }
        catch (err) {
          console.log(err);
        }
    },
    adminDeleteProduct: async (_, args) => {
      return await Product.findByIdAndRemove({ _id: args.id });
    },
  },
}