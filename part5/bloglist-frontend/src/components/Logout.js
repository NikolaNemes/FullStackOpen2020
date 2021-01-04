import React from 'react'

const Logout = ({ user, handleLogout }) => {
  return (
    <p>{user.name} is logged in <button onClick={handleLogout}>log out</button></p>
  )
}

export default Logout