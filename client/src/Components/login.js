import React, { useState, useEffect } from 'react'
import axios from 'axios'
// import {redirect} from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import '../Styles/login.css'

function Login(props) {
  let [emailIn, setEmail] = useState('')
  let [passwordIn, setPassword] = useState('')
  let [buttonPressed, setButtonPressed] = useState(false)
  let [errors, setErrors] = useState({ emailError: '', passwordError: '' })
  let emailError = errors.emailError
  let passwordError = errors.passwordError
  const history = useHistory()
  const emailInput = (e) => {
    setEmail(e.target.value)
  }
  const passwordInput = (e) => {
    setPassword(e.target.value)
  }
  const loginToServer = (e) => {
    setButtonPressed(!buttonPressed)
  }

  useEffect(() => {
    if (buttonPressed) {
      setButtonPressed(!buttonPressed)
      if (emailIn !== '' && passwordIn !== '') {
        axios
          .post('/member/login', {
            email: emailIn,
            password: passwordIn,
          })
          .then((res) => {
            localStorage.setItem('memberId', res.data.memberId)

            if (res.data.code === '002') {
              setErrors((prevState) => {
                return { emailError: 'Please enter a correct email' }
              })
            } else if (res.data.code === '003') {
              props.history.push('/activateAccount')
            } else {
              localStorage.setItem('Token', res.headers['auth-token'])
              localStorage.setItem('type', res.data.type)
              history.push('/MyProfile')
            }
          })
          .catch((err) => {
            if (err.response && err.response.status === 401) {
              setErrors((prevState) => {
                return { passwordError: 'Please enter a correct password' }
              })
            }
          })
      } else {
        setErrors((prevState) => {
          return {
            emailError: 'Please enter a correct email',
            passwordError: 'Please enter your password',
          }
        })
      }
    }
  }, [buttonPressed])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#e8e9e8',
      }}
    >
      <div className='loginActivateCard'>
        <div className='card-body'>
          <div className='card-title m-5'> LOGIN TO YOUR ACCOUNT </div>

          <div className='form-group'>
            <input
              type='email'
              className='form-control'
              placeholder='Email'
              value={emailIn}
              onChange={emailInput}
            />
          </div>

          <div className='text-danger'>{emailError}</div>

          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              placeholder='Password'
              value={passwordIn}
              onChange={passwordInput}
            />
          </div>

          <div className='text-danger'>{passwordError}</div>

          <div className='form-group'>
            <div className='custom-control custom-checkbox'>
              <input
                type='checkbox'
                className='custom-control-input'
                id='customCheck1'
              />
            </div>
          </div>

          <button
            onClick={loginToServer}
            type='button'
            className='btn btn-info btn-block'
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  )
}
export default Login
