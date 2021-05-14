module.exports = {
  Review: {
    customer_id: async (review) => {
      return (await review.populate("customer_id").execPopulate()).customer_id;
    },
    product_id: async (review) => {
      return (await review.populate("product_id").execPopulate()).product_id;
    },
  },
  Product: {
    categories: async (product) => {
      // console.log((await product.populate("categories").execPopulate()).categories);
      return (await product.populate("categories").execPopulate()).categories;
    },
  },
};
