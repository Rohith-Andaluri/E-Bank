import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class LoginForm extends Component {
  state = {userId: '', pin: '', showErrorMsg: false, errorMsg: ''}

  onChangeUsername = event => {
    this.setState({userId: event.target.value})
  }

  onChangePin = event => {
    this.setState({pin: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showErrorMsg: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {userId, pin} = this.state
    const userDetails = {user_id: userId, pin}
    const apiUrl = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderUsernameField = () => {
    const {username} = this.state
    return (
      <div className="user-input-container">
        <label className="label" htmlFor="username">
          User ID
        </label>
        <input
          type="text"
          id="username"
          className="user-input"
          value={username}
          onChange={this.onChangeUsername}
          placeholder="Enter User ID"
        />
      </div>
    )
  }

  renderPinField = () => {
    const {userPin} = this.state
    return (
      <div className="user-input-container">
        <label className="label" htmlFor="pin">
          PIN
        </label>
        <input
          type="password"
          id="pin"
          className="user-input"
          value={userPin}
          onChange={this.onChangePin}
          placeholder="Enter PIN"
        />
      </div>
    )
  }

  render() {
    const {showErrorMsg, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="main-container">
        <div className="logo-form-container" onSubmit={this.submitForm}>
          <div className="login-image-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
              className="login-image"
            />
          </div>
          <form className="form-container" onSubmit={this.submitForm}>
            <h1 className="form-heading">Welcome Back!</h1>
            {this.renderUsernameField()}
            {this.renderPinField()}
            <button type="submit" className="login-button">
              Login
            </button>
            {showErrorMsg && <p className="error-msg">{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default LoginForm
