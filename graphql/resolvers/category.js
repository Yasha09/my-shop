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
    categoryById: async (_,args) => {
      return await Category.findOne({_id: args.id});
    },
  },
  Mutation: {
    //cud category,parent
    adminCreateCategory: async (_, args) => {
      let { title, products} = args;
      const category = new Category({title,products});
      return await category.save();
    },
    // Category: {
    //   products: parent => {
    //       return productsS.find(products => products.title === parent.products);
    //   }
  },
    adminUpdateCategory: async (_, args) => {
      return await Category.findOneAndUpdate(
        {_id: args.id},
        {title: args.title},
        {new: true }
      );
    },
    adminDeleteCategory: async (_, args) => {
      return await Category.findByIdAndRemove({_id: args.id});
    },
  }
