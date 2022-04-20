import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import usersApi from '../utils/utils'

function UserOrders() {
  const {id} = useParams()

  const [userOrders, setOrders] = useState({})

  useEffect(() => {
    const getUserOrders = async () => {
      const orders = await usersApi.getUserOrders(id)
      setOrders(orders)
    }
    getUserOrders()
  }, [])

  return (
    <div className="User-Info">
      <div className="Main-Title Title" >{userOrders.customer_name}</div>
        <div className="Scrollable">
          {
            userOrders?.orders?.length > 0 ?
              userOrders.orders.map( order => {
                console.log(order.order_date)
                const date = new Date(order.order_date)
                return (
                  <div className="Info-Item Order-Item" key={`${order.order_id}-key`}>
                    <div className="Order-Info">
                      <span className="label">Order ID: </span>
                      <span>{order.order_id}</span>
                    </div>
                    <div className="Order-Info">
                      <span className="label">Order Date: </span>
                      <span>{date.toDateString()}</span>
                    </div>
                    <div className="Order-Info">
                      <span className="label">Total: </span>
                      <span>{`$${order.total}`}</span>
                    </div>
                  </div>
                )
                })
            :
              null
          }
        </div>
      <div className="Nav-Container">
        <Link className="Nav-Button" to={`/customer/${id}`}>User Info</Link>
        <Link className="Nav-Button" to="/" >Users</Link>
      </div>
    </div>
  )
}

export default UserOrders
