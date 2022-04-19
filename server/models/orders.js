import pool from './pool.js'

const getUserOrders = async (id) => {
  const date = `${new Date().getFullYear() - 1}-01-01T00:00:000Z`
  try {
    const res = await pool.query("SELECT u.name customer_name, o.order_id order_id, o.created_at order_date, o.total_in_cents total_in_cents FROM users u INNER JOIN orders o ON u.user_id = o.user_id WHERE u.user_id = $1 AND o.created_at > $2::date", [id, date])
    return res.rows
  } catch (err){
    console.log(err)
    throw err
  }
}

const createOrder = async (orderId, totalInCents, customerId, date = '') => {
  const values = !date ? [orderId, totalInCents, customerId] : [orderId, totalInCents, customerId, date]
  try {
    const res = await pool.query(`INSERT INTO orders(order_id, total_in_cents, user_id${ !date ? ')': ', created_at)'} VALUES ($1, $2, $3${ !date ? '}' : ', $4)'} RETURNING *`, values)
    console.log("order: ", res.rows[0])
    return res.rows[0]
  } catch (err){
    console.log(err)
    throw err
  }
}

export {
  getUserOrders,
  createOrder
}
