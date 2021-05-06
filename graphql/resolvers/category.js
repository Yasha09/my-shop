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
      let { title, categories} = args;
      console.log(args)
      const category = new Category({title,categories});
      // console.log(category);
      return await category.save();
    },
    adminUpdateCategory: async (_, args) => {
      return await Category.findOneAndUpdate(
        {_id: args.id},
        {title: args.title},
        {new: true }
      );
    },
    adminDeleteCategory: async (_, args) => {
      return await Product.findByIdAndRemove({_id: args.id});
    },
  },
}