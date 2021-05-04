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

  type Query {
    customers: [Customer]!
    customer: Customer!
    admin:Admin!
    adminCustomer(id: ID!): Customer!
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
  }
`;
