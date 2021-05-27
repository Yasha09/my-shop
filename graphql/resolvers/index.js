const customerResolvers = require("./customer");
const adminResolvers = require("./admin");
const productResolvers = require("./product");
const categoryResolvers = require("./category");
const reviewResolvers = require("./review");
const populateResolvers = require("./populate");
const cartResolvers = require("./cart");
const orderResolvers=require('./order')
const sliderResolvers = require("./slide")
module.exports = {
  ...populateResolvers,
  Query: {
    ...customerResolvers.Query,
    ...adminResolvers.Query,
    ...productResolvers.Query,
    ...categoryResolvers.Query,
    ...cartResolvers.Query,
    ...reviewResolvers.Query,
    ...orderResolvers.Query,
    ...sliderResolvers.Query,
  },
  Mutation: {
    ...customerResolvers.Mutation,
    ...adminResolvers.Mutation,
    ...productResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...reviewResolvers.Mutation,
    ...cartResolvers.Mutation,
    ...orderResolvers.Mutation,
    ...sliderResolvers.Mutation,
  },
};
