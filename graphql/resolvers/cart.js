const { Cart } = require("../../models/Cart");
const Product = require("../../models/Product");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  Mutation: {
    addToCart: async (_, { productId, quantity }, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");
      try {
        let cart = await Cart.findOne({ customerId: user.id, active: true });
        let productDetails = await Product.findById(productId);
        console.log("cart ", cart);
        if (cart) {
          // cart exists for customer
          let productIndex = cart.items.findIndex(
            (p) => p.productId == productId
          );
          if (productIndex > -1) {
            // product exists in the cart, update the quantity
            cart.items[productIndex].quantity += quantity;
            cart.items[productIndex].total =
              cart.items[productIndex].quantity * productDetails.price;
            cart.items[productIndex].price = productDetails.price;
            cart.subTotal = cart.items
              .map((item) => item.total)
              .reduce((acc, next) => acc + next);
          } else {
            cart.items.push({
              productId,
              quantity,
              price: productDetails.price,
              total: productDetails.price * quantity,
            });
            cart.subTotal = cart.items
              .map((item) => item.total)
              .reduce((acc, next) => acc + next);
          }
        } else {
          // if there is no user with a cart
          cart = await Cart({
            customerId: user.id,
            items: [
              {
                productId,
                quantity,
                total: productDetails.price * quantity,
                price: productDetails.price,
              },
            ],
            subTotal: parseInt(productDetails.price * quantity),
          });
        }
        await cart.save();
        cart = await Cart.findOne({
          customerId: user.id,
          active: true,
        }).populate({
          path: "items",
          populate: {
            path: "productId",
            model: "Product",
          },
        });
        console.log("cart ", cart);
        return cart;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    decreaseCartItem: async (_, { productId, quantity }, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");
      try {
        let cart = await Cart.findOne({ customerId: user.id, active: true });
        let productDetails = await Product.findById(productId);
        if (cart) {
          // cart exists for customer
          let productIndex = cart.items.findIndex(
            (p) => p.productId == productId
          );
          if (productIndex > -1) {
            let qty = cart.items[productIndex].quantity - quantity;
            qty = qty > 0 ? qty : 1;
            console.log(qty);
            cart.items[productIndex].quantity = qty;
            cart.items[productIndex].total =
              cart.items[productIndex].quantity * productDetails.price;
            cart.items[productIndex].price = productDetails.price;
            cart.subTotal = cart.items
              .map((item) => item.total)
              .reduce((acc, next) => acc + next);
          }
          await cart.save();
          let res = await Cart.findOne({
            customerId: user.id,
            active: true,
          }).populate({
            path: "items",
            populate: {
              path: "productId",
              model: "Product",
            },
          });
          return res;
        }
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    removeItemFromCart: async (_, { productId }, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");
      let cart = await Cart.findOne({ customerId: user.id, active: true });
      let productIndex = cart.items.findIndex((p) => p.productId == productId);
      if (cart && productIndex > -1) {
        cart.items.splice(productIndex, 1);
        if (cart.items.length > 0) {
          cart.subTotal = cart.items
            .map((item) => item.total)
            .reduce((acc, next) => acc + next);
        } else if (cart.items.length === 0) {
          cart.subTotal = 0;
        }
      }
      await cart.save();
      let res = await Cart.findOne({
        customerId: user.id,
        active: true,
      }).populate({
        path: "items",
        populate: {
          path: "productId",
          model: "Product",
        },
      });
      return res;
    },

    clearCart: async (_, __, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");
      let result = await Cart.findOneAndUpdate(
        { customerId: user.id, active: true },
        {
          $set: {
            subTotal: 0,
            items: [],
          },
        },
        { useFindAndModify: false, new: true }
      );
      console.log(result);
      return result.items.length === 0 ? true : false;
    },
  },
};
