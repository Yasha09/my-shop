const { Cart } = require("../../models/Cart");
const Product = require("../../models/Product");
const { UserInputError, AuthenticationError } = require("apollo-server");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  Query: {
    cart: async (_, __, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");
        let cart = await Cart.findOne({
          customerId: user.id,
          active: true,
        }).populate({
          path: "items",
          populate: {
            path: "productId",
            model: "Product",
          },
        });
        if (cart) {
          return cart;
        } else {
          throw new UserInputError("Cart of customer not found");
        }
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    addToCart: async (_, { productId, quantity }, { user }) => {
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
            // product exists in the cart, update the quantity
            cart.items[productIndex].quantity += quantity;
            cart.items[productIndex].total =
              cart.items[productIndex].quantity * productDetails.price;
            cart.items[productIndex].price = productDetails.price;
            cart.subTotal = cart.items
              .map((item) => item.total)
              ?.reduce((acc, next) => acc + next);
            cart.grandTotal = cart.subTotal + cart.shippingTotal;
            cart.totalQty = cart.items
              .map((item) => item.quantity)
              ?.reduce((acc, next) => acc + next);
          } else {
            cart.items.push({
              name: user.firstname,
              productId,
              quantity,
              price: productDetails.price,
              total: productDetails.price * quantity,
            });
            cart.subTotal = cart.items
              .map((item) => item.total)
              .reduce((acc, next) => acc + next);
            cart.grandTotal = cart.subTotal + cart.shippingTotal;
            cart.totalQty = cart.items
              .map((item) => item.quantity)
              ?.reduce((acc, next) => acc + next);
          }
        } else {
          // if there is no user with a cart
          cart = await new Cart({
            customerId: user.id,
            items: [
              {
                name: user.firstname,
                productId,
                quantity,
                total: productDetails.price * quantity,
                price: productDetails.price,
              },
            ],
            subTotal: parseInt(productDetails.price * quantity),
          });
        }
        cart.grandTotal = cart.subTotal + cart.shippingTotal;
        cart.totalQty = cart.items
          ?.map((item) => item.quantity)
          ?.reduce((acc, next) => acc + next);
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
            cart.items[productIndex].quantity = qty;
            cart.items[productIndex].total =
              cart.items[productIndex].quantity * productDetails.price;
            cart.items[productIndex].price = productDetails.price;
            cart.subTotal = cart.items
              .map((item) => item.total)
              .reduce((acc, next) => acc + next);
            cart.grandTotal = cart.subTotal + cart.shippingTotal;
            cart.totalQty = cart.items
              .map((item) => item.quantity)
              ?.reduce((acc, next) => acc + next);
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
          cart.grandTotal = cart.subTotal + cart.shippingTotal;
          cart.totalQty = cart.items
            .map((item) => item.quantity)
            ?.reduce((acc, next) => acc + next);
        } else if (cart.items.length === 0) {
          cart.subTotal = 0;
          cart.grandTotal = 0;
          cart.totalQty = 0;
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
            grandTotal: 0,
            totalQty: 0,
            items: [],
          },
        },
        { useFindAndModify: false, new: true }
      );
      return result.items.length === 0 ? true : false;
    },

    submitShippingAddress: async (_, { customerAddressInput }, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");
      let errors = {};
      let updateData = {};
      try {
        for (let key in customerAddressInput) {
          let elem = customerAddressInput[key];
          if (elem.trim().length > 0) {
            updateData[key] = elem;
          } else {
            errors[key] = `${elem} must not be empty`;
          }
        }
        if (Object.keys(errors).length > 0) {
          console.log("errors keys", errors);
          throw errors;
        }
        let cart = await Cart.findOneAndUpdate(
          { customerId: user.id, active: true },
          { shippingAddress: { ...updateData } },
          { useFindAndModify: false, new: true }
        ).populate({
          path: "items",
          populate: {
            path: "productId",
            model: "Product",
          },
        });
        return cart;
      } catch (err) {
        console.log(err);
        throw new UserInputError("Bad input", { errors });
      }
    },

    submitBillingAddress: async (_, { customerAddressInput }, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");
      let errors = {};
      let updateData = {};
      try {
        for (let key in customerAddressInput) {
          let elem = customerAddressInput[key];
          if (elem.trim().length > 0) {
            updateData[key] = elem;
          } else {
            errors[key] = `${elem} must not be empty`;
          }
        }
        if (Object.keys(errors).length > 0) {
          console.log("errors keys", errors);
          throw errors;
        }
        let cart = await Cart.findOneAndUpdate(
          { customerId: user.id, active: true },
          { billingAddress: { ...updateData } },
          { useFindAndModify: false, new: true }
        ).populate({
          path: "items",
          populate: {
            path: "productId",
            model: "Product",
          },
        });
        return cart;
      } catch (err) {
        console.log(err);
        throw new UserInputError("Bad input", { errors });
      }
    },

    submitShippingMethod: async (_, args, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");
      let errors = {};
      let updateData = {};
      try {
        for (let key in args) {
          let elem = args[key];
          if (elem.trim().length > 0) {
            updateData[key] = elem;
          } else {
            errors[key] = `${elem} must not be empty`;
          }
        }
        if (Object.keys(errors).length > 0) {
          console.log("errors keys", errors);
          throw errors;
        }
        let cart = await Cart.findOneAndUpdate(
          { customerId: user.id, active: true },
          { shippingMethod: { ...updateData } },
          { useFindAndModify: false, new: true }
        ).populate({
          path: "items",
          populate: {
            path: "productId",
            model: "Product",
          },
        });
        return cart;
      } catch (err) {
        console.log(err);
        throw new UserInputError("Bad input", { errors });
      }
    },
    submitPaymentMethod: async (_, args, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");
      let errors = {};
      let updateData = {};
      try {
        for (let key in args) {
          let elem = args[key];
          if (elem.trim().length > 0) {
            updateData[key] = elem;
          } else {
            errors[key] = `${elem} must not be empty`;
          }
        }
        if (Object.keys(errors).length > 0) {
          console.log("errors keys", errors);
          throw errors;
        }
        let cart = await Cart.findOneAndUpdate(
          { customerId: user.id, active: true },
          { paymentMethod: { ...updateData } },
          { useFindAndModify: false, new: true }
        ).populate({
          path: "items",
          populate: {
            path: "productId",
            model: "Product",
          },
        });
        return cart;
      } catch (err) {
        console.log(err);
        throw new UserInputError("Bad input", { errors });
      }
    },
  },
};
