import PropTypes from 'prop-types'

const LoginForm = ({
  handleLogin,
  username,
  password,
  handleUsername,
  handlePassword
}) => {
  return (
    <>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin} id='loginForm'>
        <div>
          username
          <input
            id='username'
            type='text'
            value={username}
            name='Username'
            onChange={handleUsername}
          />
        </div>
        <div>
          password
          <input
            id='password'
            type='password'
            value={password}
            name='Password'
            onChange={handlePassword}
          />
        </div>
        <button id='loginButton' type='submit'>login</button>
      </form>
    </>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  handleUsername: PropTypes.func.isRequired,
  handlePassword: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
}

export default LoginForm