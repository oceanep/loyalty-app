import pg from 'pg'
const { Pool } = pg

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'loyalty_db',
  password: 'password',
  port: 5432
})

const getUsers = async () => {
  try {
    const res = await pool.query('SELECT * FROM users ORDER BY id ASC')
    return res.rows
  } catch (err){
    console.log(err)
    return err
  }
}

const getUserById = async (request) => {
  const id = parseInt(request.params.id)
  try {
    const res = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    return res.rows[0]
  } catch (err){
    console.log(err)
    return err
  }
}

const createUser = async (request) => {
  const {name, email, password} = request.body
  try {
    const res = await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, password])
    console.log('res: ', res.rows[0])
    return `User ${res.rows[0].name} added with ID: ${res.rows[0].id}`
  } catch (err){
    console.log(err)
    return err
  }
}

const updateUser = async (request) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body
  try {
    const res = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, id])
    return `User modified with ID: ${id}`
  } catch (err){
    console.log(err)
    return err
  }
}


export {
  getUsers,
  getUserById,
  createUser,
  updateUser
}
