import * as users from '../models/users.js'
import * as orders from '../models/orders.js'

export const userTierInfo = async (request) => {
  const id = parseInt(request.params.id)
  const user = await users.getUserInfo(id)
  const tiers = await users.getAllTiers()
  console.log('tiers: ', tiers)
  const reduced = tiers.reduce( (acc, tier) => {
    console.log('tier ids: ', tier.tier_id, user.current_tier_id)
    if (tier.tier_id === user.current_tier_id + 1) acc[0].push(tier) //get next tier if exists
    if (+tier.tier_req < +user.year_spend) acc[1].push(tier) //get tiers below current amount spent in order, last added will be next tier to drop to
    return acc
  }, [[],[]])
  console.log('reduced: ', reduced)
  console.log('tier amount calc: ', reduced[0][0], user.amount_spent)
  // console.log(parseInt(reduced[0][0].tier_req) - parseInt(user.amount_spent))
  const current = tiers.find( tier => tier.tier_type === user.current_tier )

  const until_next_amount = typeof reduced[0][0] !== 'undefined' ? parseFloat(reduced[0][0].tier_req - user.amount_spent).toFixed(2) : 0 //if index 0 of the array exists, subtract the amount spent from the tier requirment, else return 0
  const next_tier_req = typeof reduced[0][0] !== 'undefined' ? parseFloat(reduced[0][0].tier_req).toFixed(2) : parseFloat(current.tier_req).toFixed(2)
  console.log('next tier: ', until_next_amount)

  const downgrade_tier = typeof reduced[1][reduced[1].length - 1] !== 'undefined' &&  reduced[1][reduced[1].length - 1].tier_type !== user.current_tier ? reduced[1][reduced[1].length - 1].tier_type : null //take the last entry into index 1 of the array, that will be the the tier below the amount they've spent
  const prev_tier_req = current.tier_req
  console.log('downgrade_tier', downgrade_tier)
  const downgrade_date = typeof downgrade_tier !== null ? `${new Date().getFullYear() + 1 }-01-01` : `${new Date().getFullYear() +2}-01-01`
  const downgrade_amount = parseFloat(+user.current_tier_req - +user.year_spend).toFixed(2)
  return {
    user_name: user.user_name,
    current_tier_id: user.current_tier_id,
    current_tier: user.current_tier,
    amount_spent: parseFloat(user.amount_spent).toFixed(2),
    next_tier_req,
    prev_tier_req,
    until_next_amount,
    downgrade_date,
    downgrade_amount,
    downgrade_tier
  }
}

export const userOrdersList = async (request) => {
  const id = parseInt(request.params.userId)
  const order_res = await orders.getUserOrders(id)
  const orders_list = order_res.reduce( (acc, order) => {
    const { customer_name, order_id, order_date, total_in_cents } = order
    const total = parseFloat(+total_in_cents / 100).toFixed(2)
    acc.customer_name = !acc.customer_name ? customer_name : acc.customer_name
    acc.orders.push({ order_id, order_date, total })
    return acc
  }, {customer_name: '', orders: []})
  return orders_list
}

export const calculateTier = (tiers, amount) => {
  const aplTiers = tiers.filter( tier => parseInt(tier.tier_req) <= amount)
  return aplTiers[aplTiers.length - 1]
}

export const receiveOrder = async (request) => {
  let { customerId, customerName, orderId, totalInCents, date } = request.body
  customerId = parseInt(customerId)
  const totalInDollars = totalInCents / 100
  let userTier = await users.checkEntryExists(customerId, 'user_tier', 'amount_spent, year_spend, tier_id, id')
  let userCheck = await users.checkEntryExists(customerId, 'users', 'user_id')
  const tiers = await users.getAllTiers()

  if (!userCheck.length) await users.createUser(customerName, customerId)

  const newOrder = await orders.createOrder(orderId, totalInCents, customerId, date)

  if (!userTier.length) {
    const tier = calculateTier(tiers, totalInDollars)
    const userTier = await users.createUserTier('2021-01-01T00:00:00Z', '2023-01-01T00:00:00Z', totalInDollars, totalInDollars, customerId, tier.tier_id, date)
    return { userTier: {...userTier, customerName, tier: tier.tier_type }, newOrder }
  } else {
    const { amount_spent, year_spend, tier_id, id } = userTier[0]
    console.log('year_spend: ', year_spend)
    const newAmount = parseFloat(totalInDollars + +amount_spent).toFixed(2)
    const newYearSpend = parseFloat(totalInDollars + +year_spend).toFixed(2)
    console.log('new year spend: ', newYearSpend)
    const newTier = await calculateTier(tiers, newAmount)
    console.log('new tier: ', newTier)
    const updatedUserTier = await users.updateUserTier(id, newAmount, newYearSpend, newTier.tier_id, date)
    return { updatedUserTier: {...updatedUserTier, customerName, tier: newTier.tier_type, last_purchase: date }, newOrder}
  }
}
