const { gql } = require("apollo-server");

module.exports = gql`
  type Customer {
    id: ID!
    firstname: String!
    lastname: String!
    email: String!
    token: String
  }

  type Admin {
    id:ID!
    firstname: String!
    lastname: String!
    email: String!
    token: String
  }

  input CustomerDataInput {
    email: String,
    password: String,
    firstname: String,
    lastname: String
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
    customer: Customer!
    admin:Admin!
    adminCustomer(id: ID!): Customer!
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
    adminAddCustomer(customerData: CustomerDataInput): Boolean
    adminDeleteCustomer(id: ID!): Boolean
    adminUpdateCustomer(id: ID!, customerData: CustomerDataInput): Boolean
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

