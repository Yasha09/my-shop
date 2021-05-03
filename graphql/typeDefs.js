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
    firstname: String!
    lastname: String!
    email: String!
    token: String
  }

  type Query {
    customers: [Customer]!
    customer: Customer!
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
