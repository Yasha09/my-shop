const { gql } = require("apollo-server");

module.exports = gql`

  type Customer {
    id:ID!
    firstname: String!
    lastname: String!
    email: String!
    token: String
  }

  type Admin {
    firstname: String!
    lastname: String!
    email: String!
    token: String
  }

  type Product {
    _id:ID!
    title: String!,
    image: String!,
    brand: String!,
    description: String!,
    price: Float!,
    categories: [Category]!
  }
  input ProductInput{
    title: String!,
    image: String!,
    brand: String!,
    description: String!,
    price: Float!
    categories: [ID]!
  }
  type Category {
    _id: ID!
    title: String!
    products: [Product]!
  }

  type Query {
    customers: [Customer]!
    products: [Product]!
    categories: [Category]!
  }

  type Mutation {
    register(
      firstname: String!
      lastname: String!
      password: String!
      email: String!
    ): Customer!
    adminLogin(email: String!, password: String!): Admin!
    login(email: String!, password: String!): Customer!

    # product
    adminCreateProduct(productInput: ProductInput!): Product!
    adminUpdateProduct(id: ID!, title: String!): Product! 
    adminDeleteProduct(id:ID!): Product!

    # category
    adminCreateCategory(title: String!,categories: [ID!]): Category!
    adminUpdateCategory(id: ID!, title: String!): Category!
    adminDeleteCategory(id:ID!): Category!
  }
`;  

