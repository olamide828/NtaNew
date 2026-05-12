import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'sonner'
import { HiEye, HiEyeOff } from 'react-icons/hi'

export default function AdminLogin() {
  const { admin, login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email:'', password:'' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  if (admin) return <Navigate to="/admin" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back!')
      navigate('/admin')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-5 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #c9a84c 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-gold/10 blur-[120px]" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <p className="font-sans text-[9px] text-gold font-semibold tracking-[0.25em] uppercase mb-2">NTA Worldwide</p>
          <h1 className="font-serif text-4xl text-white">Testimony Parish</h1>
          <div className="w-10 h-px bg-gold mx-auto my-4" />
          <p className="font-sans text-sm text-white/30">Admin Portal</p>
        </div>
        <div className="bg-navy-800 border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label text-white/60">Email Address</label>
              <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
                className="input bg-navy-700 border-white/10 text-white placeholder-white/20 focus:border-gold/50 focus:ring-gold/20" placeholder="admin@testimonyparish.org" required />
            </div>
            <div>
              <label className="label text-white/60">Password</label>
              <div className="relative">
                <input type={showPass?'text':'password'} value={form.password} onChange={e=>setForm({...form,password:e.target.value})}
                  className="input bg-navy-700 border-white/10 text-white placeholder-white/20 focus:border-gold/50 focus:ring-gold/20 pr-11" placeholder="••••••••" required />
                <button type="button" onClick={()=>setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPass ? <HiEyeOff size={18}/> : <HiEye size={18}/>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full justify-center">
              {loading ? <><div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin"/>Signing in…</> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}