import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useParams } from 'react-router-dom'
import userLogo from "../assets/Profile1.png"
import { toast } from 'sonner'
import axios from 'axios'
import { setUser } from '../redux/userSlice'
import MyOrder from './MyOrder'
import { motion } from 'framer-motion'
import { Loader2, Camera, User, Phone, MapPin, Building, Hash } from 'lucide-react'

const Profile = () => {
  const [loading, setLoading] = useState(false);

  const { user } = useSelector(store => store.user)
  const params = useParams();
  const userId = params.userId || user?._id;
  const dispatch = useDispatch()

  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNo: user?.phoneNo || "",
    address: user?.address || "",
    city: user?.city || "",
    zipcode: user?.zipCode || "",
    profilePic: user?.profilePic || "",
    role: user?.role || "user"
  });

  const [file, setFile] = useState(null);

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

      const res = await axios.put(`${import.meta.env.VITE_URL}/api/v1/user/update`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true
      });

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(res.data.user));
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='pt-8 md:pt-10 pb-20 min-h-screen bg-background relative overflow-hidden flex justify-center px-4'>
      {/* Background gradients */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <Tabs defaultValue="profile" className="w-full max-w-7xl mx-auto z-10">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6 h-14 bg-secondary/30 backdrop-blur-md rounded-2xl border border-border/50 p-1">
          <TabsTrigger value="profile" className="rounded-xl text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all">Profile</TabsTrigger>
          <TabsTrigger value="orders" className="rounded-xl text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='flex flex-col items-center'
          >
            <div className='w-full flex flex-col md:flex-row gap-10 justify-between items-start max-w-4xl'>

              {/* Profile Image Column */}
              <div className='flex flex-col items-center md:sticky md:top-32 shrink-0 glass-card p-8 rounded-3xl border border-border/50 shadow-xl w-full md:w-auto'>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-50 group-hover:opacity-75 transition duration-500"></div>
                  <img
                    src={updateUser?.profilePic || userLogo}
                    alt="Profile"
                    className='relative w-40 h-40 rounded-full object-cover border-4 border-background z-10'
                  />
                  <Label className="absolute bottom-2 right-2 bg-primary text-primary-foreground p-3 rounded-full cursor-pointer hover:scale-110 hover:shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-all z-20 shadow-lg">
                    <Camera className="w-5 h-5" />
                    <input type="file" accept='image/*' className='hidden' onChange={handleFileChange} />
                  </Label>
                </div>
                <h2 className="mt-6 text-xl font-bold text-foreground text-center">
                  {updateUser.firstName} {updateUser.lastName}
                </h2>
                <p className="text-muted-foreground text-center mb-2">{updateUser.email}</p>
                <div className="px-3 py-1 rounded-full bg-secondary/50 text-secondary-foreground text-xs font-semibold uppercase tracking-wider">
                  {updateUser.role}
                </div>
              </div>

              {/* Form Section */}
              <form onSubmit={handleSubmit} className='flex-1 space-y-6 glass-card p-8 sm:p-10 rounded-3xl border border-border/50 shadow-xl w-full'>
                <h3 className="text-2xl font-bold mb-6 text-foreground tracking-tight border-b border-border/50 pb-4">Personal Information</h3>
                
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground ml-1">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input type="text" name="firstName" value={updateUser.firstName} onChange={handleChange} className="pl-10 h-12 bg-background/50 border-input" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground ml-1">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input type="text" name="lastName" value={updateUser.lastName} onChange={handleChange} className="pl-10 h-12 bg-background/50 border-input" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground ml-1">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="text" name="phoneNo" value={updateUser.phoneNo} onChange={handleChange} className="pl-10 h-12 bg-background/50 border-input" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground ml-1">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="text" name="address" value={updateUser.address} onChange={handleChange} className="pl-10 h-12 bg-background/50 border-input" />
                  </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground ml-1">City</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input type="text" name="city" value={updateUser.city} onChange={handleChange} className="pl-10 h-12 bg-background/50 border-input" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground ml-1">Zip Code</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input type="text" name="zipcode" value={updateUser.zipcode} onChange={handleChange} className="pl-10 h-12 bg-background/50 border-input" />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit"
                    className="w-full h-14 text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all"
                    disabled={loading}>
                    {loading ? (
                      <div className='flex items-center justify-center gap-2'>
                        <Loader2 className='w-5 h-5 animate-spin' />
                        Updating Details...
                      </div>
                    ) : ("Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="orders">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <MyOrder/>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Profile;
