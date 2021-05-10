const Category = require("../../models/Category");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  Query: {
    // get categories
    categories: async () => {
      const res = await Category.find();
      return res;
    },
  },
  Mutation: {
    //cud category
    adminCreateCategory: async (_, args) => {
      let { title, products } = args;
      const category = new Category({ title, products });
      // console.log(category);
      return await category.save();
    },

    // adminUpdateCategory: async (_, args) => {
    //   return await Category.findOneAndUpdate(
    //     { _id: args.id },
    //     { title: args.title },
    //     { new: true }
    //   );
    // },

    adminUpdateCategory: async (_, { products, ...args }) => {
      return await Category.findOneAndUpdate(
        { _id: args.id },
        {
          ...args,
          $push: { products: { $each: [...products] } },
        },
        { useFindAndModify: false, new: true }
      );
    },

    adminDeleteProductFromCategory: async (_, { categoryId, products }) => {
      return await Category.findOneAndUpdate(
        { _id: categoryId },
        {
          $pullAll: {
            products: [...products],
          },
        },
        { useFindAndModify: false, new: true }
      );
    },

    adminDeleteCategory: async (_, args) => {
      return await Product.findByIdAndRemove({ _id: args.id });
    },
  },
};
