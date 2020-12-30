import React from 'react'

const Login = ({ handleLogin, setUsername, username, setPassword, password }) => {
  return(
    <form onSubmit={handleLogin}>
      <div>
          username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
          password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

const Logout = ({ user, handleLogout }) => {
  return (
    <p>{user.name} is logged in <button onClick={handleLogout}>log out</button></p>
  )
}

export { Login, Logout }