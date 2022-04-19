import pool from './pool.js'

const getUsers = async () => {
  try {
    const res = await pool.query('SELECT * FROM users ORDER BY user_id ASC')
    return res.rows
  } catch (err){
    console.log(err)
    throw err
  }
}

const getUserById = async (request) => {
  const id = parseInt(request.params.id)
  try {
    const res = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    return res.rows[0]
  } catch (err){
    console.log(err)
    throw err
  }
}

const createUser = async (name, userId = '', email = null) => {
  try {
    const res = !userId ? await pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email]) :  await pool.query('INSERT INTO users (name, email, user_id) VALUES ($1, $2, $3) RETURNING *', [name, email, userId])
    console.log('res: ', res.rows[0])
    return res.rows[0]
  } catch (err){
    console.log(err)
    throw err
  }
}

const updateUser = async (request) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body
  try {
    const res = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, id])
    return `User modified with ID: ${res.rows[0].id}`
  } catch (err){
    console.log(err)
    throw err
  }
}

const checkEntryExists = async (user_id, table, query) => {
  try {
    const res = await pool.query(`SELECT ${query} FROM ${table} WHERE user_id = $1 limit 1`,[user_id])
    return res.rows
  } catch (err){
    console.log(err)
    throw err
  }
}

const getUserInfo = async (id) => {
  try {
    const res = await pool.query("SELECT u.name user_name, ut.tier_id current_tier_id, ut.start_date start_date, ut.amount_spent amount_spent, ut.year_spend year_spend, t.tier_type current_tier, t.tier_req current_tier_req FROM users u INNER JOIN user_tier ut ON u.user_id = ut.user_id INNER JOIN tiers t ON ut.tier_id = t.tier_id WHERE u.user_id = $1", [id])
    return res.rows[0]
  } catch (err){
    console.log(err)
    throw err
  }
}

const getAllTiers = async () => {
  console.log('getting tiers')
  try {
    const tiers = await pool.query("SELECT * FROM tiers")
    return tiers.rows
  } catch (err){
    console.log(err)
    throw err
  }
}

const getAllUserTiers = async () => {
  try {
    const userTiers = await pool.query("SELECT * FROM user_tier")
    return userTiers.rows
  } catch (err){
    console.log(err)
    throw err
  }
}

const createUserTier = async (start_date, downgrade_date, amount_spent, year_spend, user_id, tier_id, date) => {
  try {
    const userTier = await pool.query("INSERT INTO user_tier(start_date, downgrade_date, amount_spent, year_spend, user_id, tier_id, last_purchase) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [start_date, downgrade_date, amount_spent, year_spend, user_id, tier_id, date])
    console.log('user_tier: ', userTier.rows[0])
    return userTier.rows[0]
  } catch (err){
    console.log(err)
    throw err
  }
}

const updateUserTier = async (id, amount_spent, year_spend, tier_id, last_purchase = '') => {
  const values = !last_purchase ? [id, amount_spent, year_spend, tier_id] : [id, amount_spent, year_spend, tier_id, last_purchase]
  console.log('update info: ', values)
  try {
    const userTier = await pool.query(`UPDATE user_tier SET amount_spent = $2, year_spend = $3, tier_id = $4${!last_purchase ? '' : ', last_purchase = $5'} WHERE id = $1 RETURNING tier_id, amount_spent, year_spend, last_purchase`, values)
    console.log("updated user tier: ", userTier.rows[0])
    return userTier.rows[0]
  } catch (err){
    console.log(err)
    throw err
  }
}

export {
  getUsers,
  getUserById,
  getUserInfo,
  createUser,
  updateUser,
  checkEntryExists,
  getAllTiers,
  getAllUserTiers,
  createUserTier,
  updateUserTier
}
