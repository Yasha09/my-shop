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
    productById: async (_,args) => {
      return await Product.findOne({_id: args.id});
    },
  },
  Mutation: {
    //cud product
    adminCreateProduct: async (_, args) => { 
      // console.log(args);
      const product = await Product({
        title: args.title,
        brand:args.brand,
        description: args.description,
        image: args.image,
        price:args.price,
        categories: args.categories
      })
      return await product.save();
    },
    adminAddProductImage: async (_,args) => {
      console.log(args);
      return await Product.updateOne(
        {_id: args.id},
         { image: args.image }
      );
    },
    adminDeleteProductImage: async (_,args) => {
      return await Product.updateOne(
        {_id: args.id},
        { 
          $set: { image: "" }
        },
      );
    },
    // adminUpdateProduct: async (_, { categories, ...args }) => {
    //   return await Product.findOneAndUpdate(
    //     { _id: args.id },
    //     {
    //       ...args,
    //       $push: { categories: { $each: [...categories] } },
    //     },
    //     { useFindAndModify: false, new: true }
    //   );
    // },

    adminUpdateProduct: async (_, args) => {
      return await Product.findOneAndUpdate(
        { _id: args.id },
        { title: args.title },
        { new: true }
      );
    },

    // adminDeleteCategoryFromProduct: async (_, { productId, categories }) => {
    //   return await Product.findOneAndUpdate(
    //     { _id: productId },
    //     {
    //       $pullAll: {
    //         categories: [...categories],
    //       },
    //     },
    //     { useFindAndModify: false, new: true }
    //   );
    // },

    adminDeleteProduct: async (_, args) => {
      return await Product.findByIdAndRemove({ _id: args.id });
    },
  },
};
