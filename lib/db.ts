import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "terosier_user",
  password: "", // isi password kamu
  port: 5432,
});

export default pool;
