const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const auth = require("./util/auth");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: auth,
  introspection: true,
  playground: true,
});

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Mongodb connected successfully");
    return server.listen(process.env.PORT);
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  });
