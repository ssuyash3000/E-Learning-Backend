
import sql from "./postgres.js";

let generationQueries = [
  //Table for storing information about users
  `CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
  //Table for storing information about courses
  `CREATE TABLE courses (
        course_id SERIAL PRIMARY KEY,
        course_name VARCHAR(100) NOT NULL,
        instructor VARCHAR(100) NOT NULL,
        description TEXT,
        price NUMERIC(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
  //Table for mapping users to courses (many-to-many relationship)
  `CREATE TABLE user_courses (
        user_id INT NOT NULL,
        course_id INT NOT NULL,
        PRIMARY KEY (user_id, course_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
    );`,
];

export default function createReqTables() {
  generationQueries.forEach(async (query) => {
    //const result = await sql`${query}`;
    try {
      const result = await sql.unsafe(query);
      console.log(result);
    } catch (error) {
      if (error.code === "42P07") {
        console.log("This table already exist");
      }
    }
  });
}
