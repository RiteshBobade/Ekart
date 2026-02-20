import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useParams } from 'react-router-dom'
import userLogo from "../assets/Profile1.png"
import { toast } from 'sonner'
import axios from 'axios'
import { setUser } from '../redux/userSlice'

const Profile = () => {
  const [loading, setLoading] = useState(false);

  const { user } = useSelector(store => store.user)
  const params = useParams();
  // Fixed: Ensure we always have an ID for the URL, prioritizing URL params then Redux user
  const userId = params.userId || user?._id;
  const dispatch = useDispatch()

  // 1. Local state for text fields
  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNo: user?.phoneNo || "",
    address: user?.address || "",
    city: user?.city || "",
    zipcode: user?.zipCode || "", // Internal state
    profilePic: user?.profilePic || "",
    role: user?.role || "user"
  });

  // 2. Local state for image file
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create a local preview for the UI
      setUpdateUser({ ...updateUser, profilePic: URL.createObjectURL(selectedFile) });
    }
  }



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    try {
      // Must use 'formData' instance to handle file uploads
      const formData = new FormData();

      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("phoneNo", updateUser.phoneNo);
      formData.append("address", updateUser.address);
      formData.append("city", updateUser.city);
      // Synced: Sending 'zipCode' to match backend destructuring (capital 'C')
      formData.append("zipCode", updateUser.zipcode);
      formData.append("role", updateUser.role);

      if (file) {
        // Synced: Sending 'file' to match your multer.js .single("file")
        formData.append("file", file);
      }

      const res = await axios.put("http://localhost:8000/api/v1/user/update", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        withCredentials: true
      });

      if (res.data.success) {
        toast.success(res.data.message);
        // Sync Redux store with the newly updated user from backend
        dispatch(setUser(res.data.user));
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className='pt-28 min-h-screen bg-gray-100 flex justify-center px-4'>
      <Tabs defaultValue="profile" className="max-w-7xl mx-auto items-center">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className='flex flex-col justify-center items-center bg-gray-100'>
            <h1 className='font-bold mb-7 text-2xl text-gray-800'>Update profile</h1>
            <div className='w-full flex gap-10 justify-between items-start px-7 max-w-2xl '>

              {/* Profile Image Preview & Input */}
              <div className='flex flex-col items-center'>
                <img
                  src={updateUser?.profilePic || userLogo}
                  alt="Profile"
                  className='w-32 h-32 rounded-full object-cover border-4 border-pink-800 '
                />
                <Label className="mt-4 cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">
                  Change Picture
                  <input type="file" accept='image/*' className='hidden' onChange={handleFileChange} />
                </Label>
              </div>

              {/* Form Section */}
              <form onSubmit={handleSubmit} className='space-y-4 shadow-lg p-5 rounded-lg bg-white '>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label className="block text-sm font-medium">First Name</Label>
                    <Input type="text" name="firstName" value={updateUser.firstName} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mt-1" />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium">Last Name</Label>
                    <Input type="text" name="lastName" value={updateUser.lastName} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mt-1" />
                  </div>
                </div>
                <div>
                  <Label className="block text-sm font-medium">Email</Label>
                  <Input type="email" disabled value={updateUser.email} className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed " />
                </div>
                <div>
                  <Label className="block text-sm font-medium">Phone Number</Label>
                  <Input type="text" name="phoneNo" value={updateUser.phoneNo} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mt-1 " />
                </div>
                <div>
                  <Label className="block text-sm font-medium">Address</Label>
                  <Input type="text" name="address" value={updateUser.address} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mt-1 " />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label className="block text-sm font-medium">City</Label>
                    <Input type="text" name="city" value={updateUser.city} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mt-1 " />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium">Zip Code</Label>
                    <Input type="text" name="zipcode" value={updateUser.zipcode} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mt-1 " />
                  </div>
                </div>


                <Button type="submit"
                  className="w-full mt-4 bg-pink-600 text-white hover:bg-pink-700 font-semibold py-2 rounded-lg"
                  disabled={loading}>
                  {loading ? (
                    <div className='flex items-center justify-center gap-2'>
                      <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      Updating...
                    </div>
                  ) : ("Update Profile"
                  )}
                </Button>



              </form>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-black text-white hover:bg-gray-800">
                Save password
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Profile;







