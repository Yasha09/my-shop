const customerResolvers = require("./customer");
const adminResolvers = require("./admin");
const productResolvers = require('./product');
const categoryResolvers = require('./category');

module.exports = {
  Query: {
    ...customerResolvers.Query,
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


//image mongoose schema + image string
//image graphql schema + image string

//kardal Uploadi meji nkarnery! -1 ?
//insert anel depi MongoDb -2  + 
//insert linuma, vorpes String,+ bayc petqa Upload papkayum avelanaet nkary.
//heto nkarin tal heshavorum. 