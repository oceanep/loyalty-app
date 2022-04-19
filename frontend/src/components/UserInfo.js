import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import ProgressBar from './ProgressBar'

import usersApi from '../utils/utils'

function UserInfo() {
  const {id} = useParams()

  const [userInfo, setInfo] = useState({})

  useEffect(() => {
    const getUserInfo = async () => {
      const info = await usersApi.getUserInfo(id)
      setInfo(info)
    }
    getUserInfo()
  }, [])

  return (
    <div className="User-Info">
      <div className="Info-Item">
        <span className="label">Customer: </span>
        <span>{userInfo.user_name}</span>
      </div>
      <div className="Info-Item">
        <span className="label">Total Spent: </span>
        {`$${parseFloat(userInfo.amount_spent).toFixed(2)}`}
      </div>
      <div className="Info-Item">
        <span className="label">Current Tier: </span>
        {userInfo.current_tier}
      </div>
      <div className="Info-Item">
        <span className="label">Until: </span>
        {userInfo.downgrade_date}
      </div>
      {
        typeof userInfo.downgrade_tier == null ?
          null
        :
          <>
            <div className="Info-Item">
              <span className="label">Downgrading To: </span>
              {userInfo.downgrade_tier}
            </div>
            <div className="Info-Item">
              <span className="label">To Maintain Tier: </span>
              {`$${parseFloat(userInfo.downgrade_amount).toFixed(2) > 0 ? parseFloat(userInfo.downgrade_amount).toFixed(2) : 0}`}
            </div>
          </>
      }
      <ProgressBar next_req={userInfo.next_tier_req} until_next={userInfo.until_next_amount} prev_req={userInfo.prev_tier_req} />
      <div className="Nav-Container">
        <Link className="Nav-Button" to="/" >Users</Link>
        <Link className="Nav-Button" to={`/customer_orders/${id}`}>Orders</Link>
      </div>
    </div>
  )
}

export default UserInfo
