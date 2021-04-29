const User = require("../../models/User");
const { UserInputError } = require("apollo-server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config()

module.exports = {
  Query: {
    // Get Users
    users: async () => {
      const res = await User.find();
      return res;
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

        // DB Check if user has
        const user = await User.findOne({ email });
        if (!user) {
          errors.email = "user not found";
          throw new UserInputError("user not found", { errors });
        }

        // Check password
        const correctPassword = await bcrypt.compare(password, user.password);
        if (!correctPassword) {
          errors.password = "password is incorrect";
          throw new UserInputError("password is incorrect", { errors });
        }
        const token = jwt.sign({ email }, process.env.JWT_SECRET, {
          expiresIn: 60 * 60,
        });
        user.token = token;

        return {
          ...user.toJSON(),
          token,
        };
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
        const user = new User({
          firstname,
          lastname,
          email,
          password,
        });

        // Return user
        return await user.save();
      } catch (err) {
        console.log(err);
        throw new UserInputError("Bad input", { errors });
      }
    },
  },
};
