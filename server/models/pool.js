import pg from 'pg'
const { Pool } = pg

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'loyalty_db',
  password: 'password',
  port: 5432
})

export default pool
