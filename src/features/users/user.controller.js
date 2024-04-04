import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }
  signIn(req, res) {
    const { email, password } = req.body;
    const result = UserModel.signIn(email, password);
    if (!result) {
      res.status(400).send("Incorrect Credential");
    } else {
      const token = jwt.sign(
        { userId: result.id, email: result.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
    }
  }
  signUp(req, res) {
    console.log(req.body);
    this.userRepository.signUp(req.body);
    res.status(200).send("Good Good Good");
  }
}
