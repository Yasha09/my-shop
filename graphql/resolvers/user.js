const Users = require("../../models/User");
const {UserInputError} = require("apollo-server");
const bcrypt = require("bcryptjs");


module.exports = {
  Query: {
    users: async () => {
      const res = await Users.find()
      return res
    }
  },
  Mutation: {
    register: async (_, args) => {
      let {firstname, lastname, password, email} = args;
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
        const user = new Users({
          firstname,
          lastname,
          email,
          password,
        });

        // Return user
        return await user.save();
      } catch (err) {
        console.log(err);
        throw new UserInputError("Bad input", {errors});
      }
    }
  }
}