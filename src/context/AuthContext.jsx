import { createContext, useContext, useState, useEffect } from 'react'
import { adminLogin as loginApi, getAdminMe } from '../utils/api'
const Ctx = createContext(null)
export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => { try { return JSON.parse(localStorage.getItem('tp_admin')) } catch { return null } })
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const token = localStorage.getItem('tp_token')
    if (!token) { setLoading(false); return }
    getAdminMe().then(r => setAdmin(r.data.admin)).catch(() => { localStorage.removeItem('tp_token'); localStorage.removeItem('tp_admin') }).finally(() => setLoading(false))
  }, [])
  const login = async (email, password) => {
    const res = await loginApi({ email, password })
    localStorage.setItem('tp_token', res.data.token)
    localStorage.setItem('tp_admin', JSON.stringify(res.data.admin))
    setAdmin(res.data.admin)
    return res.data.admin
  }
  const logout = () => { localStorage.removeItem('tp_token'); localStorage.removeItem('tp_admin'); setAdmin(null) }
  return <Ctx.Provider value={{ admin, login, logout, loading }}>{children}</Ctx.Provider>
}
export const useAuth = () => useContext(Ctx)
