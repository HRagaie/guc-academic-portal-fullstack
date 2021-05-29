import { JsonWebTokenError } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'

const tokenCheck = () => {
  const token = localStorage.getItem('Token')
  console.log(token)
  const decodedToken = jwt.decode(token)
  if (!token || !decodedToken) return false
  if (new Date(jwt.decode(token).exp) * 1000 < new Date()) return false
  return true
}

export default tokenCheck
