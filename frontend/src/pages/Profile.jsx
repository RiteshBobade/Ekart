import React from 'react'
import { useSelector } from 'react-redux'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const Profile = () => {
  const { user } = useSelector((store) => store.user);

  return (
    <div className='pt-28 min-h-screen bg-gray-100 flex justify-center px-4'>
      <Tabs defaultValue="profile" className="max-w-7xl mx-auto items-center">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="profile">
          <div>
            <div className='flex flex-col justify-center items-center bg-gray-100'>
              <h1 className='font-bold mb-7 text-2xl text-gray-800'>Update profile</h1>
              <div className='w-full flex gap-10 justify-between items-start px-7 max-w-2xl '>
                {/* Profile Picture */}
                <div className='flex flex-col items-center'>
                  <img src="Profile1.jpeg" alt="Profile" className='w-32 h-32 rounded-full object-cover border-4 border-pink-800 ' />
                  <Label className="mt-4 cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">Change Picture
                    <input type="file" accept='image/*' className='hidden' />
                  </Label>
                </div>
                {/* Profile Form */}
                <form className='space-y-4 shadow-lg p-5 rounded-lg bg-white '>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Label className="block text-sm font-medium">First Name</Label>
                      <Input type="text" placeholder="John" name="firstName" className="w-full border rounded-lg px-3 py2
                                mt-1 "/>
                    </div>
                    <div>
                      <Label className="block text-sm font-medium">Last Name</Label>
                      <Input type="text" placeholder="Doe" name="lastName" className="w-full border rounded-lg px-3 py2
                                mt-1 "/>
                    </div>
                  </div>
                  <div>
                    <Label className="block text-sm font-medium">Email</Label>
                      <Input type="email" disabled name="email" className="w-full border rounded-lg px-3 py2
                                mt-1 bg-gray-100 cursor-not-allowed "/>
                  </div>
                  <div>
                    <Label className="block text-sm font-medium">Phone Number</Label>
                      <Input type="text" placeholder="Enter your Contact No" name="phoneNo" className="w-full border rounded-lg px-3 py2
                                mt-1 "/>
                  </div>
                  <div>
                    <Label className="block text-sm font-medium">Address</Label>
                      <Input type="text" placeholder="Enter your Address" name="address" className="w-full border rounded-lg px-3 py2
                                mt-1 "/>
                  </div>
                  <div>
                    <Label className="block text-sm font-medium">City</Label>
                      <Input type="text" placeholder="Enter your City" name="city" className="w-full border rounded-lg px-3 py2 *:mt-1 "/>
                  </div>
                  <div>
                    <Label className="block text-sm font-medium">Zip Code</Label>
                      <Input type="text" placeholder="Enter your Zip Code" name="zipcode" className="w-full border rounded-lg px-3 py2
                                mt-1 "/>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Password Tab */}
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
                <Input
                  id="current"
                  type="password"
                  autoComplete="current-password"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="new">New password</Label>
                <Input
                  id="new"
                  type="password"
                  autoComplete="new-password"
                />
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

export default Profile