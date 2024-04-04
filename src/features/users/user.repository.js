import sql from "../../config/postgres.js";

export default class UserRepository {
  async findByEmail(email) {
    const result = await sql.unsafe(
      `SELECT EXISTS (SELECT 1 FROM users WHERE email = '${email}');`
    );
    console.log(result[0].exists);
    return result[0].exists;
  }
  async signUp(newUser) {
    const result = await this.findByEmail(newUser.email);
  }
  //async SignIn()
}
