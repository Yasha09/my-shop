const { UserInputError, AuthenticationError } = require("apollo-server");
const Order = require("../../models/Order");

module.exports = {
  Query: {
    customerOrders: async (_, __, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");

      let res = await Order.find();

      return { items: res, total: res.length };
    },
    customerOrder: async (_, args, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");

      const { orderId = "" } = args;

      try {
        const order = await Order.findOne({ _id: orderId });

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

      let res = await Order.find();

      return { items: res, total: res.length };
    },
    adminOrder: async (_, args, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");

      const { orderId = "" } = args;

      try {
        const order = await Order.findOne({ _id: orderId });

        if (!order) {
          throw new UserInputError("order not found");
        }

        return order;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    submitOrder: async (_, args, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");

      const { cartId = "" } = args;

      if (!cartId.trim()) throw new UserInputError("bad input");

      const orders = await Order.find();

      // const order = new Order({ orderNumber: 10000 + orders.length });

      return { orderId: "1212", orderNumber: 12123123, totalPrice: 123 };
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
        );
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
        order = await Order.findOne({ id: orderId });
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
