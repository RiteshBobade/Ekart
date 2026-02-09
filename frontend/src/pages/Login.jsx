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
import { Eye, EyeOff } from "lucide-react"
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/userSlice'

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
    e.preventDefault()
    try {
      setLoading(true)
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      )

      if (res.data.success) {
        dispatch(setUser(res.data.user))
        toast.success(res.data.message)
        localStorage.setItem("accesstoken", res.data.accesstoken) // Store token in localStorage
        // THE FIX: Redirect to home page after success
        navigate("/") 
      }
    } catch (error) {
      console.log(error)
      const errorMessage = error.response?.data?.message || "Something went wrong"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-pink-300'>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your details below to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler} className="flex flex-col gap-3">
            <div className='grid gap-2'>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className='relative'>
                <Input
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  required
                />
                {showPassword ? (
                  <EyeOff 
                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500" 
                    size={20} 
                    onClick={() => setShowPassword(false)} 
                  />
                ) : (
                  <Eye 
                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500" 
                    size={20} 
                    onClick={() => setShowPassword(true)} 
                  />
                )}
              </div>
            </div>

            {/* Hidden submit button to allow Enter key to work */}
            <button type="submit" className="hidden" />
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            onClick={submitHandler}
            type="submit"
            className="w-full cursor-pointer bg-pink-600 hover:bg-pink-700"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
          <p className='text-gray-800 text-sm'>
            Don't have an account? 
            <Link to={'/signup'} className='hover:underline cursor-pointer text-pink-800 font-medium ml-1'>
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login