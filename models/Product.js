const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    title: {
      type: String,
      require: [true, "product_id required"],
    },
    image: {
      type: String,
    },
    brand: {
      type: String,
      required: true,
      require: [true, "brand required"],
    },
    description: {
      type: String,
      required: true,
      require: [true, "description required"],
    },
    price: {
      type: Number,
      required: true,
      require: [true, "price required"],
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Product", productSchema);
