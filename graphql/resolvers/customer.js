const Customer = require("../../models/Customer");
const { UserInputError, AuthenticationError } = require("apollo-server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  Query: {
    // Get Single Customer
    customer: async (_, __, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");
        let customer = await Customer.findOne({ email: user.email });
        if (!customer) throw new UserInputError("User not found");

        return customer;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    register: async (_, args) => {
      let { firstname, lastname, password, email } = args;
      const errors = {};

      try {
        if (firstname.trim() === "")
          errors.firstname = "firstname must not ne empty";
        if (email.trim() === "") errors.email = "email must not ne empty";
        if (password.trim() === "")
          errors.password = "password must not ne empty";
        if (lastname.trim() === "")
          errors.confirmPassword = "confirmPassword must not ne empty";

        if (Object.keys(errors).length > 0) {
          throw errors;
        }

        // Hash password
        password = await bcrypt.hash(password, 6);

        // Create user
        const customer = new Customer({
          firstname,
          lastname,
          email,
          password,
        });

        // Return user
        return await customer.save();
      } catch (err) {
        console.log(err);
        throw new UserInputError("Bad input", { errors });
      }
    },
    // Login
    login: async (_, args) => {
      const { email, password } = args;

      const errors = {};

      try {
        // Empty Check
        if (email.trim() === "") errors.email = "email must not be empty";
        if (password === "") errors.password = "password must not be empty";
        if (Object.keys(errors).length > 0) {
          throw new UserInputError("bad input", { errors });
        }

        // DB Check if customer has
        const customer = await Customer.findOne({ email });
        if (!customer) {
          errors.email = "user not found";
          throw new UserInputError("Customer not found", { errors });
        }
        // Check password
        const correctPassword = await bcrypt.compare(
          password,
          customer.password
        );
        if (!correctPassword) {
          errors.password = "password is incorrect";
          throw new UserInputError("password is incorrect", { errors });
        }

        const token = jwt.sign(
          // { email, name: customer.firstname },
          {
            email: customer.email,
            firstname: customer.firstname,
            lastname: customer.lastname,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: 60 * 60,
          }
        );
        customer.token = token;
        return {
          ...customer.toJSON(),
          token,
        };
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
};
