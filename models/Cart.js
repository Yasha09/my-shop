// const {Schema} = require("mongoose");
// const mongoose = require("mongoose");

// const CartThingSchema = new Schema(
//   {
//     product_id: {
//       type: Schema.Types.ObjectId,
//       ref: "Product",
//       require: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//     },
//     quantity: {
//       type: Number,
//       required: true,
//     },
//   }
// );

// const CartSchema = new Schema(
//   {
//     customer_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Customer",
//     },
//     things: [CartThingSchema],
//       status: {
//       default: 0,
//       type: Number,
//     },
//     total: {
//       type: Number,
//     },
//   },
// );

// const Thing = mongoose.model("Thing", CartThingSchema);
// const Cart = mongoose.model("Cart", CartSchema);
// module.exports = { Thing, Cart };

// {user} admin,customer who is login.
