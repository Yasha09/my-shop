const { UserInputError, AuthenticationError } = require("apollo-server");
const Order = require("../../models/Order");
const { Cart } = require("../../models/Cart");

module.exports = {
  Query: {
    customerOrders: async (_, __, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");

      let res = await Order.find({ customerId: user.id }).populate({
        path: "items",
        populate: {
          path: "productId",
          model: "Product",
        },
      });


      return { items: res, total: res.length };
    },
    customerOrder: async (_, args, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");

      const { orderId = "" } = args;

      try {
        const order = await Order.findOne({ _id: orderId }).populate({
          path: "items",
          populate: {
            path: "productId",
            model: "Product",
          },
        });

        if (!order) {
          throw new UserInputError("order not found");
        }

        return order;
      } catch (error) {
        throw error;
      }
    },
    adminOrders: async (_, __, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");

      let res = await Order.find().sort({ createdAt: -1 });

      return { items: res, total: res.length };
    },
    adminOrder: async (_, args, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");

      const { orderId = "" } = args;

      try {
        const order = await Order.findOne({ _id: orderId }).populate({
          path: "items",
          populate: {
            path: "productId",
            model: "Product",
          },
        });

        if (!order) {
          throw new UserInputError("order not found");
        }

        return order
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    submitOrder: async (_, args, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");
      const errors = {};
      const { cartId = "" } = args;

      if (!cartId.trim()) throw new UserInputError("bad input");

      try {
        const orders = await Order.find();
        const cart = await Cart.findOne({ _id: cartId });
        if (!cart) {
          errors.cart = "cart not found with this id";
          throw new UserInputError("Cart not found", { errors });
        }
        // console.log("cart ",cart)
        const {
          paymentMethod,
          shippingMethod,
          subTotal,
          grandTotal,
          shippingTotal,
          totalQty,
          customerId,
          items,
          shippingAddress,
          billingAddress
        } = cart;
        const order = new Order({
          orderNumber: 10000 + orders.length,
          paymentMethod,
          shippingMethod,
          subTotal,
          grandTotal,
          shippingTotal,
          totalQty,
          customerId,
          billingAddress,
          shippingAddress,
          items,
          shippingAddress,
          customer: {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
          },
        });
        await Cart.findOneAndUpdate({ _id: cartId }, { active: false });
        let res = await order.save();
        
        return {
          orderId: res._id,
          orderNumber: res.orderNumber,
          totalPrice: res.grandTotal,
        };
      } catch (err) {
        throw new UserInputError("Bad input", { errors });
      }
    },
    adminChangeOrderStatus: async (_, args, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");

      const { orderId = "", status = "" } = args;

      if (!orderId.trim() || !status.trim()) {
        throw new UserInputError("bad input");
      }

      let order;

      try {
        order = await Order.findOneAndUpdate(
          { _id: orderId },
          { orderStatus: status },
          { new: true }
        ).populate({
          path: "items",
          populate: {
            path: "productId",
            model: "Product",
          },
        });
      } catch (error) {
        throw new UserInputError("wrong id");
      } finally {
        if (!order) throw new UserInputError("order not found");
      }

      return order;
    },
    adminDeleteOrder: async (_, args, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");

      const { orderId = "" } = args;

      if (!orderId.trim()) {
        throw new UserInputError("bad input");
      }

      let order;

      try {
        order = await Order.findOne({ _id: orderId });
        console.log("order id ", order);
      } catch (error) {
        throw new UserInputError("wrong id");
      }

      if (!order) throw new UserInputError("wrong id");

      await order.deleteOne();

      return true;
    },
    adminMassDeleteOrders: async (_, args, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");

      const { orderIds } = args;

      if (orderIds.length === 0) {
        throw new UserInputError("bad input");
      }

      let result = true;

      try {
        await Order.deleteMany({
          _id: { $in: orderIds },
        });
      } catch (error) {
        result = false;
      }

      return result;
    },
  },
};
