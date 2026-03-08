import { Button } from '@/components/ui/button'
import { ArrowLeft, Camera, Loader2, Save, User as UserIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import userLogo from "../../assets/userLogo.jpg"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from 'sonner'
import { setUser } from '@/redux/userSlice'
import { motion } from 'framer-motion'

const UserInfo = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const params = useParams()
  const userId = params.id
  
  const [updateUser, setUpdateUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    zipcode: "",
    role: "",
    profilePic: ""
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    try {
      const formData = new FormData();

      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("phoneNo", updateUser.phoneNo);
      formData.append("address", updateUser.address);
      formData.append("city", updateUser.city);
      formData.append("zipCode", updateUser.zipcode);
      formData.append("role", updateUser.role);

      if (file) {
        formData.append("file", file);
      }

      const res = await axios.put(`${import.meta.env.VITE_URL}/api/v1/user/adminUpdate/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        withCredentials: true
      });

      if (res.data.success) {
        toast.success(res.data.message);
        // Do not update Redux standard state when editing someone else's profile as Admin
        // dispatch(setUser(res.data.user));
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUpdateUser({ ...updateUser, profilePic: URL.createObjectURL(selectedFile) });
    }
  }

  const getUserDetails = async()=> {
    try {
      const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/user/getUser/${userId}`)
      if (res.data.success) {
        setUpdateUser({
          firstName: res.data.user.firstName || "",
          lastName: res.data.user.lastName || "",
          email: res.data.user.email || "",
          phoneNo: res.data.user.phoneNo || "",
          address: res.data.user.address || "",
          city: res.data.user.city || "",
          zipcode: res.data.user.zipcode || "",
          role: res.data.user.role || "",
          profilePic: res.data.user.profilePic || ""
        })
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load user details");
    } finally {
      setFetching(false)
    }
  }

  useEffect(()=> {
    getUserDetails()
  }, [])

  if (fetching) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh]'>
        <Loader2 className='w-10 h-10 animate-spin text-primary mb-4' />
        <p className='text-muted-foreground font-medium'>Loading User Details...</p>
      </div>
    )
  }

  return (
    <div className='w-full max-w-4xl mx-auto'>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='flex items-center gap-4 mb-8'
      >
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="bg-background/50 hover:bg-secondary border-border/50 rounded-xl"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Button>
        <div>
          <h1 className='text-3xl font-extrabold tracking-tight'>Edit User Profile</h1>
          <p className="text-muted-foreground mt-1">Update user account information and role permissions.</p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='glass-card rounded-3xl border border-border/50 shadow-xl overflow-hidden'
      >
        <div className="flex flex-col md:flex-row gap-8 p-8">
          
          {/* Enhanced Profile Image Preview & Input */}
          <div className='flex flex-col items-center md:w-1/3 shrink-0'>
            <div className="relative group mb-6">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
              <div className="relative w-48 h-48 rounded-full border-4 border-background overflow-hidden bg-secondary/50 flex items-center justify-center shadow-2xl">
                {updateUser?.profilePic || userLogo ? (
                   <img
                     src={updateUser?.profilePic || userLogo}
                     alt="Profile"
                     className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                   />
                ) : (
                  <UserIcon className="w-20 h-20 text-muted-foreground opacity-50" />
                )}
                
                {/* Hover Overlay for Upload */}
                <Label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center cursor-pointer">
                  <Camera className="w-8 h-8 text-white mb-2" />
                  <span className="text-white text-sm font-medium">Change Photo</span>
                  <input type="file" accept='image/*' className='hidden' onChange={handleFileChange} />
                </Label>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground truncate max-w-[200px]">
                {updateUser.firstName} {updateUser.lastName}
              </h3>
              <p className="text-sm text-muted-foreground truncate max-w-[200px] mt-1">{updateUser.email}</p>
              <div className="mt-3 inline-flex items-center justify-center px-3 py-1 rounded-full bg-secondary/80 text-secondary-foreground text-xs font-semibold uppercase tracking-wider">
                {updateUser.role || "User"}
              </div>
            </div>
          </div>

          <div className="w-px bg-border/50 hidden md:block"></div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className='flex-1 space-y-6'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">First Name</Label>
                <Input 
                  type="text" 
                  name="firstName" 
                  value={updateUser?.firstName} 
                  onChange={handleChange} 
                  className="bg-background/50 border-border/50 h-12 rounded-xl focus-visible:ring-primary/20" 
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Last Name</Label>
                <Input 
                  type="text" 
                  name="lastName" 
                  value={updateUser?.lastName} 
                  onChange={handleChange} 
                  className="bg-background/50 border-border/50 h-12 rounded-xl focus-visible:ring-primary/20"
                  placeholder="Doe" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
              <Input 
                type="email" 
                disabled 
                value={updateUser?.email} 
                className="bg-secondary/30 border-border/50 h-12 rounded-xl text-muted-foreground cursor-not-allowed opacity-70" 
              />
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed directly.</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Phone Number</Label>
              <Input
               placeholder="+1 (555) 000-0000" 
               type="text" 
               name="phoneNo" 
               value={updateUser?.phoneNo} 
               onChange={handleChange} 
               className="bg-background/50 border-border/50 h-12 rounded-xl focus-visible:ring-primary/20" 
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Street Address</Label>
              <Input
               placeholder="123 Main St"
               type="text" 
               name="address" 
               value={updateUser?.address} 
               onChange={handleChange} 
               className="bg-background/50 border-border/50 h-12 rounded-xl focus-visible:ring-primary/20" 
              />
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">City</Label>
                <Input
                placeholder="New York" 
                type="text" 
                name="city" 
                value={updateUser?.city} 
                onChange={handleChange} 
                className="bg-background/50 border-border/50 h-12 rounded-xl focus-visible:ring-primary/20" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Zip Code</Label>
                <Input 
                placeholder="10001"
                type="text" 
                name="zipcode" 
                value={updateUser?.zipcode} 
                onChange={handleChange} 
                className="bg-background/50 border-border/50 h-12 rounded-xl focus-visible:ring-primary/20" 
                />
              </div>
            </div>

            <div className='space-y-3 bg-secondary/20 p-5 rounded-2xl border border-border/50'>
              <Label className="text-sm font-semibold text-foreground">Account Role</Label>
              <RadioGroup 
                value={updateUser?.role} 
                onValueChange={(value) => setUpdateUser({ ...updateUser, role: value })}
                className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-2"
              >
                  <label htmlFor="user" className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-colors ${updateUser?.role === 'user' ? 'bg-primary/10 border-primary text-primary' : 'bg-background/50 border-border/50 hover:bg-secondary/50'}`}>
                    <RadioGroupItem value="user" id="user" />
                    <span className="font-medium">Standard User</span>
                  </label>
                  <label htmlFor="admin" className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-colors ${updateUser?.role === 'admin' ? 'bg-primary/10 border-primary text-primary' : 'bg-background/50 border-border/50 hover:bg-secondary/50'}`}>
                    <RadioGroupItem value="admin" id="admin" />
                    <span className="font-medium">Administrator</span>
                  </label>
              </RadioGroup>
            </div>

            <Button 
              type="submit"
              className="w-full h-14 mt-6 text-base font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all rounded-xl"
              disabled={loading}
            >
              {loading ? (
                <div className='flex items-center justify-center gap-2'>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving Changes...
                </div>
              ) : (
                <div className='flex items-center justify-center gap-2'>
                  <Save className="w-5 h-5" />
                  Update Profile Details
                </div>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default UserInfo
