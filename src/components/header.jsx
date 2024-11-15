import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import axios from 'axios';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../components/ui/Drawer";
import { useToast } from "../components/ui/use-toast"; // Import the useToast hook
import PopOver from './User/PopOver';
import config from '../functions/config';
import JobsiteLogo from '../assets/logo2.png'

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPopOver, setShowPopOver] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const userToken = sessionStorage.getItem('user_token');
  // Check for user token and profile photo on component mount
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

  // Toggle PopOver on avatar click
  const handleAvatarClick = () => {
    setShowPopOver(prevState => !prevState);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <nav className="py-4 flex justify-between items-center">
      <Link to="">
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

