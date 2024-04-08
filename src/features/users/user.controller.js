import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserRepository from "./user.repository.js";
import { UserError } from "../../error-handler/userError.js";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async signUp(req, res, next) {
    console.log(req.body);
    let { username, email, password } = req.body;
    try {
      // // Password validation regex: at least 1 special character and minimum length of 8 characters
      // const passwordRegex = /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

      // // Check if password meets the criteria
      // if (!passwordRegex.test(password)) {
      //   throw new UserError(
      //     "Password must be at least 8 characters long and contain at least one special character",
      //     400
      //   );
      // }

      let user = await this.userRepository.findByEmail(email);
      if (user == true) {
        throw new UserError("User already exists", 409);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel(username, email, hashedPassword);
      let result = await this.userRepository.signUp(newUser);
      console.log(result);

      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  async signIn(req, res) {
    //console.log(req.body);
    const { email, password } = req.body;
    try {
      const user = await this.userRepository.findUser(email);
      //console.log(user);
      if (!user) {
        return res.status(400).send("Incorrect Credential");
      } else {
        const result = await bcrypt.compare(password, user.password);
        if (result) {
          //console.log("from user controller ", user._id.toString());
          // 1. Create our token on successful login
          const token = jwt.sign(
            {
              userId: user.user_id,
              email,
              username: user.username,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "1h",
            }
          );

          // 2. Send the token
          res.status(200).send(token);
        } else {
          res.status(400).send("Incorrect Credential");
        }
      }
      //result = await this.userRepsitory.SignIn(email, password);
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something wrong with database", 503);
    }
  }
  async getUserDetails(req, res) {
    let obj = { username: req.username, email: req.email };
    console.log(obj);
    return res.status(200).send(obj);
  }
  async updateUserDetails(req, res) {
    let { newUsername, newEmail } = req.body;

    //userId is being attached to req body at jwt authenticator level from token payload
    let userId = req.body.userId;
    // console.log(userId);
    // console.log(req.body);
    try {
      let updatedRecord = await this.userRepository.updateUser(
        userId,
        newUsername,
        newEmail
      );
      return res.status(201).send(updatedRecord);
    } catch (err) {
      console.log("Error form update user details: ", err);
      throw new ApplicationError("Something wrong with database", 503);
    }
  }
}
