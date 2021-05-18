const Customer = require("../../models/Customer");
const { UserInputError, AuthenticationError } = require("apollo-server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { UniqueArgumentNamesRule } = require("graphql");
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
          errors.firstname = "firstname must not be empty";
        if (email.trim() === "") errors.email = "email must not ne empty";
        if (password.trim() === "")
          errors.password = "password must not ne empty";
        if (lastname.trim() === "")
          errors.confirmPassword = "confirmPassword must not ne empty";

        if (Object.keys(errors).length > 0) {
          console.log("errors ", errors);
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

        // Return Custome
        let res = await customer.save();
        const token = jwt.sign(
          {
            id: res._id,
            email: res.email,
            firstname: res.firstname,
            lastname: res.lastname,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: 120 * 60,
          }
        );
        res.token = token;
        return res;
      } catch (err) {
        if (err.name === "MongoError") {
          errors[Object.keys(err.keyValue)] = `User with this ${Object.keys(
            err.keyValue
          )} is already exists`;
        }
        if (err.name === "ValidationError") {
          errors[Object.keys(err.errors)] = `${Object.values(err.errors).map(
            (val) => val.message
          )}`;
        }
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
          errors.email = "user not found with this email";
          throw new UserInputError("Customer not found", { errors });
        }
        // Check password
        const correctPassword = await bcrypt.compare(
          password,
          customer.password
        );
        console.log("correctPassword ", correctPassword);
        if (!correctPassword) {
          errors.password = "password is incorrect";
          throw new UserInputError("password is incorrect", { errors });
        }

        const token = jwt.sign(
          // { email, name: customer.firstname },
          {
            id: customer._id,
            email: customer.email,
            firstname: customer.firstname,
            lastname: customer.lastname,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: 365 * 24 * 60 * 60,
          }
        );
        // console.log("customer ", customer);
        customer.token = token;
        return customer;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    
    updateCustomer: async (_, { customerData }, { user }) => {
      const errors = {};
      let customer = await Customer.findOne({ _id: user.id });
      // console.log("customerData ", customer);
      if (!user) throw new AuthenticationError("Unauthenticated");
      // console.log(user)
      let updateData = {};

      try {
        for (let key in customerData) {
          let elem = customerData[key];
          // console.log("elem ",elem)
          if (elem.trim().length > 0) {
            if (key === "password") {
              const correctPassword = await bcrypt.compare(
                elem,
                customer.password
              );
              console.log("correctPassword ", correctPassword);
              if (correctPassword) {
                errors.password = "It is old password ";
                throw new UserInputError("password is incorrect", { errors });
              }
              const hashPassword = await bcrypt.hash(elem, 6);
              updateData[key] = hashPassword;
              continue;
            }
            updateData[key] = elem;
          } else {
            errors[key] = `${elem} must not be empty`;
          }
        }

        if (Object.keys(errors).length > 0) {
          console.log("errors keys", errors);
          throw errors;
        }
        // console.log(updateData);
        let res = await Customer.findOneAndUpdate(
          { _id: user.id },
          { ...updateData },
          { useFindAndModify: false, new: true }
        );
        return res;
      } catch (err) {
        console.log("err", err);
        if (err.name === "MongoError") {
          errors[Object.keys(err.keyValue)] = `User with this ${Object.keys(
            err.keyValue
          )} is already exists`;
        }
        if (err.name === "ValidationError") {
          errors[Object.keys(err.errors)] = `${Object.values(err.errors).map(
            (val) => val.message
          )}`;
        }
        console.log("errors ", errors);
        throw new UserInputError("Bad input", { errors });
      }
    },
  },
};
