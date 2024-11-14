import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ScrollArea } from '../ui/scroll-area';
import axios from 'axios';
import config from "../../functions/config";
import { useNavigate } from "react-router-dom";
import { Bounce, ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { FaBuilding, FaLock } from "react-icons/fa";
import BuildingImage from '../../assets/building.png'
import LockImage from '../../assets/lock.png'
import Editimage from '../../assets/skills.png'

const CompanyProfile = () => {
  const [openSheet, setOpenSheet] = useState(null);
  const [profile, setProfile] = useState({
    company_name: '',
    company_photo: null,
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    place: '',
    id: null,
  });
  const [photo, setPhoto] = useState();
  const [changes, setChanges] = useState({});
  const token = sessionStorage.getItem("user_token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleOpenSheet = (sheetName) => setOpenSheet(sheetName);
  const handleCloseSheet = () => setOpenSheet(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
    setChanges({ ...changes, [name]: value });
  };

    const handleFileChange = (e) => {
    const { name, files } = e.target;
    setProfile({ ...profile, [name]: files[0] });
    setChanges({ ...changes, [name]: files[0] });
  };

  const fetchProfile = async () => {
    try {
      if (token) {
        const response = await axios.get(`${config.base_url}/api/v1/app/manage-company-profile/`, {
          headers: {
            'Authorization': `Token ${token}`,
          }
        });
        const fetchedProfile = response.data;
        setProfile({ ...fetchedProfile, id: fetchedProfile.id });
        setPhoto(`${config.base_url}${fetchedProfile.company_photo}`);
      }
    } catch (error) {
      console.error('Error fetching company profile:', error);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    for (const key in changes) {
      formData.append(key, changes[key]);
    }
    setLoading(true);
    try {
      await axios.put(`${config.base_url}/api/v1/app/manage-company-profile/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${token}`,
        },
      });
      alert("Company profile updated successfully!");
      setChanges({});
      handleCloseSheet();
      fetchProfile();
      sessionStorage.setItem("Companyphoto", photo);
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
  
        if (status === 400) {
          // Check if the backend is returning a specific error for email issues
          if (data.error) {
            toast.error(data.error);  // Show specific error message if provided
          } else if (data.email) {
            toast.error(data.email[0]);  // Show email-related validation error
          } else {
            toast.error("An unexpected error occurred.");
          }
        } else if (status === 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error("An unexpected error occurred.");
        }
      } else {
        // Handle network error
        toast.error("Network error. Please check your connection.");
      }

      // console.error("Error updating company profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile.company_photo) {
      sessionStorage.setItem("Companyphoto", profile.company_photo);
    }
  }, [profile]);

  useEffect(() => {
    fetchProfile();  // Only call fetchProfile once on component mount
  }, [token]);

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <ToastContainer
    theme="dark"
    transition={Bounce}
    />
      {/* Buttons to open each profile section */}
      <Button
        variant="outline"
        onClick={() => handleOpenSheet("companyInfo")}
        className="flex flex-col items-center justify-center w-96 h-80 font-bold text-lg md:w-72 md:h-64 sm:w-60 sm:h-52"
      >
        <img src={BuildingImage} className="w-24 h-24 rounded-full" />
        Company Info 
      </Button>

      <Button
        variant="outline"
        onClick={() => handleOpenSheet("editProfile")}
        className="flex flex-col items-center justify-center w-96 h-80 font-bold text-lg md:w-72 md:h-64 sm:w-60 sm:h-52"
      >
        <img src={Editimage} className="w-24 h-24 rounded-full" />
        Edit Profile 
      </Button>

      {/* Change Password Button */}
      <Button
        variant="outline"
        onClick={() => navigate('/company-password-change')}
        className="flex flex-col items-center justify-center w-96 h-80 font-bold text-lg md:w-72 md:h-64 sm:w-60 sm:h-52"
      >
        <img src={LockImage} className="w-24 h-24 rounded-full" />
        Change Password
      </Button>


      {/* Edit Profile Sheet */}
<Sheet open={openSheet === "editProfile"} onOpenChange={setOpenSheet}>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Edit Profile</SheetTitle>
      <SheetDescription>Update your personal contact details.</SheetDescription>
    </SheetHeader>
    <ScrollArea orientation="horizontal" className="h-[calc(100vh-150px)] overflow-y-auto">
      <div className="grid gap-4 py-4">
        <Label htmlFor="first_name">First Name</Label>
        <Input
          id="first_name"
          type="text"
          name="first_name"
          value={profile.first_name}
          onChange={handleChange}
          placeholder="Enter your first name"
        />

        <Label htmlFor="last_name">Last Name</Label>
        <Input
          id="last_name"
          type="text"
          name="last_name"
          value={profile.last_name}
          onChange={handleChange}
          placeholder="Enter your last name"
        />

        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />

        <Label htmlFor="phone_number">Phone Number</Label>
        <Input
          id="phone_number"
          type="text"
          name="phone_number"
          value={profile.phone_number}
          onChange={handleChange}
          placeholder="Enter your phone number"
        />

        <Label htmlFor="place">Place</Label>
        <Input
          id="place"
          type="text"
          name="place"
          value={profile.place}
          onChange={handleChange}
          placeholder="Enter your place"
        />
      </div>
      <Button onClick={handleSubmit} className="mt-4">
        Save Changes
      </Button>
    </ScrollArea>
  </SheetContent>
</Sheet>

{/* Company Info Sheet */}
<Sheet open={openSheet === "companyInfo"} onOpenChange={setOpenSheet}>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Company Info</SheetTitle>
      <SheetDescription>Update your company information and upload a company photo.</SheetDescription>
    </SheetHeader>
    <ScrollArea orientation="horizontal" className="h-[calc(100vh-150px)] overflow-y-auto">
      <div className="grid gap-4 py-4">
        <Label htmlFor="first_name">First Name</Label>
        <Input
          id="first_name"
          type="text"
          name="first_name"
          value={profile.first_name}
          readOnly
          placeholder="First Name"
          disabled
        />

        <Label htmlFor="last_name">Last Name</Label>
        <Input
          id="last_name"
          type="text"
          name="last_name"
          value={profile.last_name}
          readOnly
          placeholder="Last Name"
          disabled
        />

        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          value={profile.email}
          readOnly
          placeholder="Email"
          disabled
        />

        <Label htmlFor="phone_number">Phone Number</Label>
        <Input
          id="phone_number"
          type="text"
          name="phone_number"
          value={profile.phone_number}
          readOnly
          placeholder="Phone Number"
          disabled
        />

        <Label htmlFor="place">Place</Label>
        <Input
          id="place"
          type="text"
          name="place"
          value={profile.place}
          readOnly
          placeholder="Place"
          disabled
        />

        <Label htmlFor="company_name">Company Name</Label>
        <Input
          id="company_name"
          type="text"
          name="company_name"
          value={profile.company_name}
          onChange={handleChange}
          placeholder="Enter your company name"
        />

        <Label htmlFor="company_photo">Company Photo</Label>
        <Input
          id="company_photo"
          type="file"
          accept="image/*"
          name="company_photo"
          onChange={handleFileChange}
        />
        {profile.company_photo && (
          <img
            src={profile.company_photo}
            alt="Company"
            style={{ width: '100px', height: '100px', borderRadius: '5px' }}
          />
        )}
      </div>
      <Button onClick={handleSubmit} className="mt-4">
        Save Company Info
      </Button>
    </ScrollArea>
  </SheetContent>
</Sheet>

    </div>
  );
};

export default CompanyProfile;











