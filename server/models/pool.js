import pg from 'pg'
import dotenv from 'dotenv'

const { Pool } = pg

dotenv.config()
const { NODE_ENV } = process.env

let pool = null

if (NODE_ENV == 'development') {
  const {DB_USER, DB_HOST, DB_DATABASE, DB_PASSWORD, DB_PORT} = process.env

  pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    port: DB_PORT
  })
}

if (NODE_ENV == 'production') {
  const {DATABASE_URL} = process.env

  pool = new Pool({
    connectionString: DATABASE_URL
  })

}

export default pool
