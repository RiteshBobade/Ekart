import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

const verifyEmail = () => {
  const {token} = useParams()
  const [status, setStatus] = useState("verifying") // verifying, success, error
  const navigate = useNavigate()

  const verifyEmail = async () => {
    try {
      setStatus("verifying")
      const res = await axios.post(`${import.meta.env.VITE_URL}/api/v1/user/verify`, {},{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if(res.data.success)
      {
        setStatus("success")
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      }
    } catch (error) {
      setStatus("error")
    }
  }
  useEffect(() => {
    verifyEmail()
  },[token])

  return (
    <div className='relative w-full min-h-screen bg-background flex items-center justify-center overflow-hidden p-4'>
      {/* Background gradients */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className='glass-card p-10 rounded-3xl shadow-2xl text-center w-[90%] max-w-md border border-border/50 backdrop-blur-xl bg-background/60 z-10'
      >
        <div className="flex justify-center mb-6">
          {status === "verifying" && (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Loader2 className="w-20 h-20 text-primary" />
            </motion.div>
          )}
          {status === "success" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <CheckCircle2 className="w-20 h-20 text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            </motion.div>
          )}
          {status === "error" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <XCircle className="w-20 h-20 text-destructive drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
            </motion.div>
          )}
        </div>

        <h2 className='text-3xl font-extrabold text-foreground tracking-tight mb-3'>
          {status === "verifying" && "Verifying Email..."}
          {status === "success" && "Verification Successful!"}
          {status === "error" && "Verification Failed"}
        </h2>
        
        <p className="text-muted-foreground">
          {status === "verifying" && "Please wait while we confirm your email address."}
          {status === "success" && "Your email has been successfully verified. Redirecting to login..."}
          {status === "error" && "The verification link may be invalid or expired. Please request a new one."}
        </p>

        {status === "error" && (
          <button 
            onClick={() => navigate('/login')}
            className="mt-8 w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            Back to Login
          </button>
        )}
      </motion.div>
    </div>
  )
}

export default verifyEmail