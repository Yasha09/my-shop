const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    firstname: String!
    lastname: String!
    email: String!
    token: String
  }

  type Query {
    users: [User]!
    login(email: String!, password: String!): User!
    adminLogin(email: String!, password: String!): User!
  }

  type Mutation {
    register(
      firstname: String!
      lastname: String!
      password: String!
      email: String!
    ): User!
  }
`;
