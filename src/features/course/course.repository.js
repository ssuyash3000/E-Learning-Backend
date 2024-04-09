import sql from "../../config/postgres.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class CourseRepository {
  async fetchCourse(limit, offset) {
    let query = "";
    if (limit) {
      query = `SELECT * FROM courses
            ORDER BY course_id LIMIT ${limit} 
            OFFSET ${offset ? offset : 0}`;
    } else {
      query = `SELECT * FROM courses
        ORDER BY course_id
        OFFSET ${offset ? offset : 0}`;
    }
    try {
      let result = await sql.unsafe(query);
      return result;
    } catch (error) {
      console.log("From fetchCourse CourseRepository: ", error);

      throw new ApplicationError("Something went wrong", 503);
    }
  }

  async insertCourse(newCourse) {
    let {
      course_name,
      instructor,
      description,
      price,
      level,
      category,
      popularity,
    } = newCourse;
    let query = `INSERT INTO courses (course_name ,
        instructor,
        description ,
        price ,
        level,
        category,
        popularity)
VALUES ($1, $2,$3,$4,$5,$6,$7) RETURNING *`;
    price = Number(price);
    popularity = Number(popularity);
    try {
      console.log("inserting course");
      let result = await sql.unsafe(query, [
        course_name,
        instructor,
        description,
        price,
        level,
        category,
        popularity,
      ]);
      console.log(result);
      return result;
    } catch (error) {
      console.log("From insertCourse CourseRepository: ", error);

      throw new ApplicationError("Something went wrong", 503);
    }
  }
}
