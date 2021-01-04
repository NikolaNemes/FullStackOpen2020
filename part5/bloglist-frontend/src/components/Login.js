import React from 'react'

const Login = ({ handleLogin, setUsername, username, setPassword, password }) => {
  return(
    <form onSubmit={handleLogin}>
      <div>
          username
        <input
          id="inputUsername"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
          password
        <input
          id="inputPassword"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="loginSubmit" type="submit">login</button>
    </form>
  )
}

export default Login