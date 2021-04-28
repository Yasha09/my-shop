const {gql} = require("apollo-server");

module.exports = gql`
    type User {
        firstname: String!
        lastname: String!
        email: String!
        createdAt: String!
    }
    
    type Query {
        users:[User]
        login(email:String!,passwoed:String):User!
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
