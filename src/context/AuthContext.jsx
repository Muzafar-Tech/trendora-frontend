import { createContext, useContext, useState, useEffect } from 'react'
import axios from '../utils/axios'
import socket from '../utils/socket'
import { requestPermission } from '../utils/pushNotifications'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const res = await axios.get('/auth/me')
        setUser(res.data)
        socket.connect()
        socket.on('connect', () => {
          socket.emit('join', res.data._id.toString())
        })
        if (socket.connected) {
          socket.emit('join', res.data._id.toString())
        }
      } catch (err) {
        if (err.response?.data?.isBanned) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setUser(null)
          localStorage.setItem('bannedMessage', 'Your account has been banned. Contact support.')
        } else {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setUser(null)
        }
      } finally {
        setLoading(false)
      }
    }
    initAuth()
  }, [])

  const login = async (email, password) => {
    const res = await axios.post('/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data))
    setUser(res.data)
    socket.connect()
    socket.emit('join', res.data._id.toString())  // ← .toString() add karo
    await requestPermission()                      // ← await sahi jagah
    return res.data
  }

  // ✅ Register mein token nahi aata — sirf userId aata hai
  // Register ke baad verify-email pe redirect hota hai
  const register = async (formData) => {
    const res = await axios.post('/auth/register', formData)
    return res.data  // ← sirf data return karo, login mat karo
  }

  // ✅ updateUser function add karo — profile update ke liye
  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData }
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    socket.disconnect()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)