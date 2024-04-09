import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Resend } from "resend";
import OTP from "OTP";
import UserRepository from "./user.repository.js";
import { UserError } from "../../error-handler/userError.js";
import UserDetailsValidator from "../../middleware/userDetailsValidator.js";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async signUp(req, res, next) {
    //console.log(req.body);
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
      console.log("Error form signUp: ", err);
      next(err);
    }
  }
  async signIn(req, res) {
    //console.log(req.body);
    const { email, password } = req.body;
    try {
      const user = await this.userRepository.findUser(email);
      //console.log(user);
      if (Array.isArray(user)) {
        return res.status(404).send("This email do not exists");
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
      console.log("Error form signIn: ", err);
      throw new ApplicationError("Something wrong with this request", 503);
    }
  }
  async getUserDetails(req, res) {
    try {
      let obj = { username: req.body.username, email: req.body.email };
      console.log("getUserdetails: ", obj);
      return res.status(200).json(obj);
    } catch (error) {
      console.log("Error form getUserDetails: ", err);
      throw new ApplicationError("Something wrong with this request", 503);
    }
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
      throw new ApplicationError("Something wrong with this request", 503);
    }
  }
  async forgetPassword(req, res) {
    let { email, otp, newPassword } = req.body;

    if (!UserDetailsValidator.emailValidator(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    let userData = await this.userRepository.findUser(email);
    console.log(userData);
    let userId = -1;
    if (Array.isArray(userData)) {
      return res
        .status(400)
        .json({ error: "User does not exists with this email" });
    } else {
      userId = userData.user_id;
    }
    if (otp) {
      //verify otp and if correct change the password
      let otpRecord = await this.userRepository.fetchOTP(email);
      let timestamp = otpRecord[0].updated_at;
      const otpTime = new Date(timestamp);

      // Get the current time
      const currentTime = new Date();

      // Calculate the difference in milliseconds
      const timeDifferenceMs = currentTime - otpTime;

      // Convert milliseconds to minutes
      const timeDifferenceMinutes = Math.floor(timeDifferenceMs / (1000 * 60));
      // console.log("current time ", currentTime);
      // console.log("otp time", otpTime);
      // console.log("Time difference ", timeDifferenceMinutes);
      if (timeDifferenceMinutes >= 15) {
        return res.status(401).send("OTP has expired, request for new otp");
      }
      if (!UserDetailsValidator.passwordValidator(newPassword)) {
        return res.status(400).json({
          error:
            "Password must be at least 8 characters long and contain at least 1 special character",
        });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      let response = await this.userRepository.updateUserPassword(
        userId,
        hashedPassword
      );
      if (response) {
        return res.status(201).send("Password Updated Successfully");
      } else {
        return res.status(401).send("Password updation not successful");
      }
    } else {
      let newOTP = new OTP().totp();
      this.userRepository.storeOTP(email, newOTP, new Date());
      const resend = new Resend(process.env.RE_SEND_API_KEY);
      //send otp
      resend.emails.send({
        from: "e-learning@resend.dev",
        to: `${email}`,
        subject: "Otp for password change",
        html: `<p>OTP for password reset is <strong>${newOTP}</strong>! OTP will be valid for only 15 Minutes</p>`,
      });
      return res.status(200).send("OTP sent");
    }
  }
  async userPasswordReset(req, res) {
    let { userId, newPassword, oldPassword } = req.body;
    let user = await this.userRepository.findUserByUserId(userId);
    console.log(oldPassword);
    const result = await bcrypt.compare(oldPassword, user.password);
    try {
      if (result) {
        if (!UserDetailsValidator.passwordValidator(newPassword)) {
          return res
            .status(401)
            .send(
              "Password must be at least 8 characters long and contain at least 1 special character"
            );
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        let response = this.userRepository.updateUserPassword(
          userId,
          hashedPassword
        );
        if (response) {
          return res.status(201).send("Password Updated Successfully");
        } else {
          return res.status(401).send("Password updation not successful");
        }
      } else {
        return res.status(401).send("Old password entered was not correct");
      }
    } catch (error) {
      console.log("Error form userPasswordReset: ", err);
      throw new ApplicationError("Something wrong with this request", 503);
    }
  }
}
