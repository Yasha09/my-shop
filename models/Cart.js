const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { CustomerAddressSchema } = require("./Address");

let CartItemSchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
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
const Item = mongoose.model("Item", CartItemSchema);

const CartSchema = new Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    items: [CartItemSchema],
    active: {
      default: true,
      type: Boolean,
    },
    subTotal: {
      default: 0,
      type: Number,
    },
    shippingTotal: {
      default: 10,
      type: Number,
    },
    grandTotal: {
      default: 0,
      type: Number,
    },
    totalQty: {
      default: 0,
      type: Number,
    },

    shippingAddress: CustomerAddressSchema,
    billingAddress: CustomerAddressSchema,

    paymentMethod: {
      methodCode: String,
    },
    shippingMethod: {
      carrierCode: String,
      rateId: String,
    },
  },
  {
    timestamps: true,
  }
);
const Cart = mongoose.model("Cart", CartSchema);

module.exports = {
  Item,
  Cart,
};
