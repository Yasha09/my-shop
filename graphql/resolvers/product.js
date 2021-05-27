const Product = require("../../models/Product");
const {UserInputError } = require("apollo-server");
const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  Query: {
    // get products
    products: async (_, { limit, page, ...sortInput }) => {
      const res = await Product.find()
        .sort(sortInput)
        .limit(limit)
        .skip((page - 1) * limit);
      let totalQty = await Product.countDocuments();
      return {
        totalQty,
        pages: Math.ceil(totalQty / limit),
        products: res,
      };
    },

    productByName: async (_, args) => {
      const errors = {};
      const { productName } = args;
      if (productName.trim() === "") {
        errors.productName = "Produc name must not by empty";
      }
      let res = await Product.findOne({ title: productName });
      try {
        if (!res) throw new UserInputError("product not found");
      } catch (err) {
        throw new UserInputError("Bad input", { errors });
      }
      return res;
    },
    productById: async (_, args) => {
      return await Product.findOne({ _id: args.id }, function (err, product) {
        product.image = "/images/" + product.image;
        return JSON.stringify(product);
      });
    },
  },
  Mutation: {
    adminCreateProduct: async (_, args) => {
      try {
        const { productInput } = args;
        const products = await Product({
          ...productInput,
        });
        if (!products) throw new UserInputError("product not found");
        return await products.save();
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    adminUpdateProduct: async (_, args) => {
      const { productId = "", productInput } = args;
      try {
        const newProduct = await Product.findOneAndUpdate(
          { _id: productId },
          productInput,
          { useFindAndModify: false }
        );
        if (!newProduct) throw new UserInputError("product not found");
        return newProduct;
      } catch (err) {
        console.log(err);
      }
    },
    adminDeleteProduct: async (_, args) => {
      return await Product.findByIdAndRemove({ _id: args.id });
    },
  },
};
