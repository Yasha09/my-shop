const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    orderNumber: {
      type: Number,
    },
    userId: {
      type: String,
      required: [true, "user id must be defined"],
    },
    shippingTotal: {
      type: Number,
      // shipping price
    },
    subTotal: {
      type: Number,
      // products total price
    },
    grandTotal: {
      type: Number,
      // subTotal + shippingTotal
    },
    items: {
      type: Array,
      default: [],
    },
    totalQty: {
      type: Number,
      default: 0,
    },
    shippingAddress: {
      type: Object,
      required: [true, "shipping address must be specified!"],
    },
    billingAddress: {
      type: Object,
    },
    shippingMethod: {
      type: Object,
      required: [true, "shipping method must be specified!"],
    },
    paymentMethod: {
      type: Object,
    },
    orderStatus: {
      type: String,
      default: "pending",
    },
    customer: {
      type: Object,
      default: () => { },
    },
  },
  { timestamps: true }
);

module.exports = model("Order", orderSchema);
