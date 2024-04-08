import sql from "../../config/postgres.js";
import { UserError } from "../../error-handler/userError.js";

export default class UserRepository {
  async updateUser(userId, newUsername, newEmail) {
    // Initialize the update query
    let updateQuery = `UPDATE users SET`;

    // Initialize the returning part of the query
    let returningPart = ` RETURNING user_id, email, username`;

    // Check if newUsername is defined, if yes, add it to the update query
    if (newUsername !== undefined) {
      updateQuery += ` username = '${newUsername}',`;
    }

    // Check if newEmail is defined, if yes, add it to the update query
    if (newEmail !== undefined) {
      updateQuery += ` email = '${newEmail}',`;
    }

    // Remove the trailing comma from the update query
    updateQuery = updateQuery.slice(0, -1);

    // Add the WHERE clause to specify the user to be updated
    updateQuery += ` WHERE user_id = '${userId}'`;

    // Append returningPart to include the updated user record
    updateQuery += returningPart;
    // Execute the update query
    console.log(updateQuery);
    try {
      const result = await sql.unsafe(updateQuery);
      //console.log(result);
      let updatedUser = {};
      updatedUser = result[0];
      // res.status(200).json(updatedUser);
      return updatedUser;
    } catch (error) {
      console.log(error);
      if (error.code && error.code == 23505) {
        throw new UserError(`${error.detail}`, 503);
      }
      throw new UserError("Something went wrong", 503);
    }
  }
  async findUser(email) {
    const result = await sql.unsafe(
      `SELECT user_id, username, password FROM users WHERE email = '${email}';`
    );
    // console.log(result);
    return result[0];
  }
  async findByEmail(email) {
    const result = await sql.unsafe(
      `SELECT EXISTS (SELECT 1 FROM users WHERE email = '${email}');`
    );
    console.log(result[0].exists);
    return result[0].exists;
  }
  async signUp(newUser) {
    try {
      const { username, email, hashedPassword } = newUser;
      //console.log("newUser from repo: ", newUser);
      //   const query =
      //     "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)";
      //   const values = [username, email, hashedPassword];
      const result =
        await sql`INSERT INTO users (username, email, password) VALUES(${username}, ${email}, ${hashedPassword}) RETURNING  user_id,
        username, email;`;
      // console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      if (error.code && error.code == 23505) {
        throw new UserError(`${error.detail}`, 503);
      }
      throw new UserError("Something went wrong", 503);
    }
  }
  //async SignIn()
}
