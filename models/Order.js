const { Schema, model } = require("mongoose");

let OrderItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity can not be less then 1."],
    },
    name: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const orderSchema = new Schema(
  {
    orderNumber: {
      type: Number,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
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
    items: [OrderItemSchema],

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
      default: () => {},
    },
  },
  { timestamps: true }
);

module.exports = model("Order", orderSchema);
