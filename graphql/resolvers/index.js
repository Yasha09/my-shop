const customerResolvers = require("./customer");
const adminResolvers = require("./admin");
const productResolvers = require('./product');
const categoryResolvers = require('./category');

module.exports = {
  Query: {
    ...customerResolvers.Query,
    ...adminResolvers.Query,
    ...productResolvers.Query,
    ...categoryResolvers.Query
  },
  Mutation: {
    ...customerResolvers.Mutation,
    ...adminResolvers.Mutation,
    ...productResolvers.Mutation,
    ...categoryResolvers.Mutation
  },
};

