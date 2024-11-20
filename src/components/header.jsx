import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useToast } from "../components/ui/use-toast"; // Import the useToast hook
import PopOver from './User/PopOver';
import JobsiteLogo from '../assets/logo2.png'
import config from '../functions/config';
import axios from 'axios';
import PersonDefaultImg from '../assets/personimg.png'

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPopOver, setShowPopOver] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [photo, setPhoto] = useState(null);
  const [defphoto, setDefPhoto] = useState(null);
  const [companyphoto, setCompanyPhoto] = useState(null);
  const userToken = sessionStorage.getItem('user_token');
  const userType = sessionStorage.getItem('user_type');
  const [profile, setProfile] = useState(userType === "company" 
    ? { company_name: '', company_photo: null, id: null } 
    : { resume: null, skills: [], experience: "", education: "" }
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!userToken) return;
  
      try {
        const profileUrl = userType === "company" 
          ? `${config.base_url}/api/v1/app/manage-company-profile/`
          : `${config.base_url}/api/v1/app/profile/`;
  
        const profileResponse = await axios.get(profileUrl, {
          headers: { Authorization: `Token ${userToken}` },
        });
  
        setProfile(profileResponse.data);
  
        if (userType === "company") {
          const companyPhotoURL = profileResponse.data.company_photo || PersonDefaultImg;
          setCompanyPhoto(companyPhotoURL);
          sessionStorage.setItem("Companyphoto", companyPhotoURL);
        } else {
          const userPhotoURL = profileResponse.data.photo 
            ? `${config.base_url}${profileResponse.data.photo}` 
            : PersonDefaultImg;
          setPhoto(userPhotoURL);
          sessionStorage.setItem("Userphoto", userPhotoURL);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [userToken, userType]);
  




  useEffect(() => {
    
    const storedProfilePhoto = sessionStorage.getItem('profile_photo'); // Store and retrieve the profile photo URL
    const storedCompanyPhoto = sessionStorage.getItem('company_profile_photo');
    if (userToken) {
      setIsLoggedIn(true);
      if (storedProfilePhoto) {
        setProfilePhoto(storedProfilePhoto);
      }else if (storedProfilePhoto) {
        setProfilePhoto(storedProfilePhoto);
      }
    }
  }, [userToken]);
  let redirectPath = '/';
  if (userType === 'candidate') {
    redirectPath = '/candidate';
  } else if (userType === 'company') {
    redirectPath = '/recruiter';
  }else{
    redirectPath = '/';
  }


  // Toggle PopOver on avatar click
  const handleAvatarClick = () => {
    setShowPopOver(prevState => !prevState);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <nav className="py-4 flex justify-between items-center">
      <Link  to={redirectPath}>
        <img src={JobsiteLogo} className="h-14 md:h-12 sm:h-10 xs:h-8" alt="Hirrd Logo" />
      </Link>

      {isLoggedIn ? (
        <div onClick={handleAvatarClick} className="cursor-pointer">
          
          
           <PopOver />
        </div>
      ) : (
        <Button variant="outline" onClick={handleLoginClick}>
          Login
        </Button>
      )}
    </nav>
  );
}

export default Header;

