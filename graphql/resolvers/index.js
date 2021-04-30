const userResolvers = require("./user");
const adminResolvers = require("./admin");

module.exports = {
  Query: {
    ...userResolvers.Query,
    ...adminResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
  },
};
