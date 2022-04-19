import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import usersApi from '../utils/utils'

function Users() {
  const [users, setUsers] = useState([''])

  useEffect(() => {
    const loadUsers = async () => {
      const res = await usersApi.getUsers();
      setUsers(res);
    }
    loadUsers()
  }, [])

  return(
    <div className="User-Info User-List">
      <div className="Main-Title">Customers</div>
      <div className="Customers-Container">
      {
        users?.length > 0 ?
          users.map(user => <Link className="Info-Item Customers" to={`/user/${user.user_id}`} key={`${user.user_id}`} >{user.name}</Link>)
        :
          null
      }
      </div>
    </div>
  )
}

export default Users
