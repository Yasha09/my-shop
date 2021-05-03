const { UserInputError } = require("apollo-server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../../models/Admin");
const Customer = require("../../models/Customer");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  Query: {
    // Get Users
    customers: async (_, __, { user }) => {
      if (!user) throw new AuthenticationError("Unauthenticated");
      let res = await Customer.find();
      console.log(res)
      return res;
    },
  },
  Mutation: {
    // let pass=await bcrypt.hash("admin01", 6);
    // Login
    adminLogin: async (_, args) => {
      const { email, password } = args;
      const errors = {};

      try {
        // Empty Check
        if (email.trim() === "") errors.email = "email must not be empty";
        if (password === "") errors.password = "password must not be empty";
        if (Object.keys(errors).length > 0) {
          throw new UserInputError("bad input", { errors });
        }

        // DB Check if admin has
        const admin = await Admin.findOne({ email });
        if (!admin) {
          errors.email = "admin not found";
          throw new UserInputError("admin not found", { errors });
        }

        // Check password
        const correctPassword = await bcrypt.compare(password, admin.password);

        if (!correctPassword) {
          errors.password = "password is incorrect";
          throw new UserInputError("password is incorrect", { errors });
        }
        const token = jwt.sign(
          { email, name: admin.firstname },
          process.env.JWT_SECRET,
          {
            expiresIn: 60 * 60,
          }
        );
        admin.token = token;

        return {
          ...admin.toJSON(),
          token,
        };
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
};
