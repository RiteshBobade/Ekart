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
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react"
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { motion } from 'framer-motion'

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const submitHandler = async (e) => {
    e.preventDefault() // Prevents page reload
    
    try {
      setLoading(true)
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/user/register`, 
        formData,
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true 
        }
      )

      if (res.data.success) {
        toast.success(res.data.message)
        navigate('/verify')
      }
    } catch (error) {
      console.error("Signup Error:", error)
      // Extracts error message from backend catch block
      const errorMessage = error.response?.data?.message || "Internal server error";
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-background p-4 relative overflow-hidden pt-20'>
      {/* Background gradients */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="glass-card border-border/50 shadow-2xl backdrop-blur-xl bg-background/60">
          <CardHeader className="space-y-3 pb-6 text-center">
            <CardTitle className="text-3xl font-extrabold tracking-tight">Create an account</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Enter your details below to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Form wrapper for accessibility and browser password saving */}
            <form onSubmit={submitHandler} className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div className='grid gap-2'>
                  <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="pl-9 bg-background/50 border-border focus:ring-primary h-11"
                    />
                  </div>
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="pl-9 bg-background/50 border-border focus:ring-primary h-11"
                    />
                  </div>
                </div>
              </div>

              <div className='grid gap-2'>
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-9 bg-background/50 border-border focus:ring-primary h-11"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className='relative'>
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    required
                    className="pl-9 pr-10 bg-background/50 border-border focus:ring-primary h-11"
                  />
                  <div 
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-2 h-12 text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border/50 pt-6">
            <p className='text-muted-foreground text-sm'>
              Already have an account? 
              <Link to={'/login'} className='hover:text-primary text-foreground font-semibold ml-1 transition-colors'>
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

export default Signup