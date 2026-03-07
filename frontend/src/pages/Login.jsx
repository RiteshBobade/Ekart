import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/userSlice'
import { motion } from 'framer-motion'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const submitHandler = async (e) => {
    if (e) e.preventDefault()
    
    try {
      setLoading(true)
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/user/login`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      )

      if (res.data.success) {
        dispatch(setUser(res.data.user))
        toast.success(res.data.message)
        
        // Correctly save the accessToken to localStorage
        localStorage.setItem("accessToken", res.data.accessToken) 
        
        navigate("/") 
      }
    } catch (error) {
      console.error("Login Error:", error)
      const errorMessage = error.response?.data?.message || "Invalid credentials"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-background p-4 relative overflow-hidden pt-20'>
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="glass-card border-border/50 shadow-2xl backdrop-blur-xl bg-background/60">
          <CardHeader className="space-y-3 pb-6 text-center">
            <CardTitle className="text-3xl font-extrabold tracking-tight">Welcome Back</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitHandler} className="flex flex-col gap-5">
              <div className='grid gap-2'>
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 bg-background/50 border-border focus:ring-primary h-12"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  {/* Optional Forgot Password link could go here */}
                </div>
                <div className='relative'>
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    required
                    className="pl-10 pr-10 bg-background/50 border-border focus:ring-primary h-12"
                  />
                  <div 
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-2 h-12 text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border/50 pt-6">
            <p className='text-muted-foreground text-sm'>
              Don't have an account? 
              <Link to={'/signup'} className='hover:text-primary text-foreground font-semibold ml-1 transition-colors'>
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

export default Login