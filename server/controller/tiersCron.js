import cron from 'node-cron'

import * as users from '../models/users.js'
import { calculateTier } from './functions.js'

const recalculateTiers = async () => {
  const year = new Date().getFullYear()
  //Get all user_tiers
  const allUserTiers = await users.getAllUserTiers()
  const tiers = await users.getAllTiers()
  console.log(allUserTiers)
	//for each user_tier
  if (allUserTiers.length > 0) {
    allUserTiers.forEach( async (userTier) => {
      //reset amount_spent to year_spend
      const newAmount = parseFloat(userTier.year_spend).toFixed(2)
      //reset year_spend to 0
      const newYearSpend = 0.00
      //recalculate tier from amount spend
      const newTier = await calculateTier(tiers, parseInt(userTier.year_spend).toFixed(2))
      const updatedUserTier = await users.updateUserTier(userTier.id, newAmount, newYearSpend, newTier.tier_id)
      console.log('Cron Updated User Tier: ', updatedUserTier)
    });
  }
}

export default cron.schedule('0 0 0 1 1 *', async () => {
  console.log('running cron')
  await recalculateTiers()
}, {
  scheduled: true,
  timezone: 'Etc/UTC'
})
