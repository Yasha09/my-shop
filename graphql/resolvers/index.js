const customerResolvers = require("./customer");
const adminResolvers = require("./admin");

module.exports = {
  Query: {
    ...customerResolvers.Query,
  },
  Mutation: {
    ...customerResolvers.Mutation,
    ...adminResolvers.Mutation,
  },
};
