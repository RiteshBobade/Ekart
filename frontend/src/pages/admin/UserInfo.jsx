import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import userLogo from "../../assets/userLogo.jpg"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from 'sonner'
import { setUser } from '@/redux/userSlice'


const UserInfo = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  // const {user} = useSelector(store=>store.user)
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

  const getUserDetails = async()=> {
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/user/getUser/${userId}`)
      // if(res.data.success) {
      //   setUpdateUser(res.data.user)
      // }
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
      
    }
  }

  useEffect(()=> {
    getUserDetails()
  }, [])

  return (
    <div className='mt-6 pt-5 min-h-screen bg-gray-100'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col justify-center items-center min-h-screen bg-gray-100'>
          <div className='flex justify-between gap-10'>
            <Button onClick={() => navigate(-1)}><ArrowLeft /></Button>
            <h1 className='font-bold mb-7 text-2xl text-gray-800'>Update Profile</h1>
          </div>
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
                  <Input type="text" name="firstName" value={updateUser?.firstName} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mt-1" />
                </div>
                <div>
                  <Label className="block text-sm font-medium">Last Name</Label>
                  <Input type="text" name="lastName" value={updateUser?.lastName} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mt-1" />
                </div>
              </div>
              <div>
                <Label className="block text-sm font-medium">Email</Label>
                <Input type="email" disabled value={updateUser?.email} className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed " />
              </div>
              <div>
                <Label className="block text-sm font-medium">Phone Number</Label>
                <Input
                 placeholder="Enter your contact no." type="text" name="phoneNo" value={updateUser?.phoneNo} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mt-1 " />
              </div>
              <div>
                <Label className="block text-sm font-medium">Address</Label>
                <Input
                 placeholder="Enter your address"
                 type="text" name="address" value={updateUser?.address} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mt-1 " />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className="block text-sm font-medium">City</Label>
                  <Input
                  placeholder="Enter your city" type="text" name="city" value={updateUser?.city} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mt-1 " />
                </div>
                <div>
                  <Label className="block text-sm font-medium">Zip Code</Label>
                  <Input 
                  placeholder="Enter zip code"
                  type="text" name="zipcode" value={updateUser?.zipcode} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 mt-1 " />
                </div>
              </div>

              <div className='flex gap-3 items-center'>
                <Label className="block text-sm font-medium">Role :</Label>
                <RadioGroup value={updateUser?.role} 
                onValueChange={(value)=>setUpdateUser({...updateUser, role:value})}
                className="flex items-center">
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value="user" id="user"/>
                      <Label htmlFor="user">User</Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value="admin" id="admin"/>
                      <Label htmlFor="admin">Admin</Label>
                    </div>
                </RadioGroup>
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
      </div>
    </div>
  )
}

export default UserInfo
