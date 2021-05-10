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
  Mutation: {
    //cud product
    adminCreateProduct: async (
      _,
      { productInput: { title, brand, description, image, price, categories } }
    ) => {
      const product = new Product({
        title,
        brand,
        description,
        image,
        price,
        categories,
      });
      return await product.save();
    },
    // adminUpdateProduct: async (_, args) => {
    //   return await Product.findOneAndUpdate(
    //     { _id: args.id },
    //     { title: args.title },
    //     { new: true }
    //   );
    // },

    adminDeleteCategoryFromProduct: async (_, { productId, categories }) => {
      return await Product.findOneAndUpdate(
        { _id: productId },
        {
          $pullAll: {
            categories: [...categories],
          },
        },
        { useFindAndModify: false, new: true }
      );
    },

    adminUpdateProduct: async (_, { categories, ...args }) => {
      return await Product.findOneAndUpdate(
        { _id: args.id },
        {
          ...args,
          $push: { categories: { $each: [...categories] } },
        },
        { useFindAndModify: false, new: true }
      );
    },

    adminDeleteProduct: async (_, args) => {
      return await Product.findByIdAndRemove({ _id: args.id });
    },
  },
};
