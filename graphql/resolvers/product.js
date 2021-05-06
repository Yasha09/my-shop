const Product = require("../../models/Product");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  Query: {
    // get products
    products: async () => {
      const res = await Product.find();
      return res;
    },
  },
  Mutation:{
    //cud product
    adminCreateProduct: async (_, {productInput:{
      title,brand,description,image,price,categories
      }
    }) => {
      const product = new Product({ 
        title,
        brand,
        description,
        image,
        price,
        categories});
      return await product.save();
    },
    adminUpdateProduct: async (_, args) => {
      return await Product.findOneAndUpdate(
        {_id: args.id},
        {title: args.title},
        {new: true }
      );
    },
    adminDeleteProduct: async (_, args) => {
      return await Product.findByIdAndRemove({_id: args.id});
    },
  }
}