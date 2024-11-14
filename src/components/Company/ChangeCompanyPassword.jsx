import React, { useState } from 'react';
import axios from 'axios';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '../ui/Drawer';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
// import { useToast } from '../ui/use-toast';
import { BarLoader } from 'react-spinners';
import config from '../../functions/config';
import { useNavigate } from 'react-router-dom';
import { Bounce, ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

function ChangeCompanyPassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // const { toast } = useToast();
  const email = sessionStorage.getItem('email');
  const token = sessionStorage.getItem('user_token');
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 5 || password.length > 10) return 'Password must be 5-10 characters long';
    if (!/\d/.test(password)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain at least one special character';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validatePassword(newPassword);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${config.base_url}/api/v1/app/changepassword/`,
        { old_password: oldPassword, new_password: newPassword, username: email },
        { headers: { Authorization: `Token ${token}` } }
      );

      if (response.status === 200) {
        toast.success("Password changed successfully!");
        setIsOpen(false);
        navigate('/company-profile');
      }
    } catch (error) {
      toast.error("Failed to change password. Check your old password.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerClose = (isDrawerOpen) => {
    setIsOpen(isDrawerOpen);
    if (!isDrawerOpen) navigate("/company-profile");
  };


  if (loading) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <>
    <ToastContainer
    theme="dark"
    transition={Bounce}
    />
    <Drawer open={isOpen} onOpenChange={handleDrawerClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Change Password</DrawerTitle>
        </DrawerHeader>
        <form className="flex flex-col p-4 space-y-4" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <Input type="email" id="email" placeholder="Enter your email" value={email} disabled />
          
          <label htmlFor="oldPassword">Old Password</label>
          <Input
            type="password"
            id="oldPassword"
            placeholder="Enter old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />

          <label htmlFor="newPassword">New Password</label>
          <Input
            type="password"
            id="newPassword"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <Button type="submit" className="mt-4">
            Change Password
          </Button>
        </form>
        <DrawerFooter>
          <Button variant="outline" onClick={() => {setIsOpen(false);handleDrawerClose()}}>Cancel</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
    </>
  );
}

export default ChangeCompanyPassword;
