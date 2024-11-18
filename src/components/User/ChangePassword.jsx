import React, { useState } from 'react';
import axios from 'axios';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '../ui/Drawer';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
// import { useToast } from '../ui/use-toast';
import { BarLoader } from 'react-spinners';
import config from '../../functions/config';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Bounce, ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  // const { toast } = useToast();
  const email = sessionStorage.getItem('email');
  const token = sessionStorage.getItem('user_token');
  const [isOpen, setIsOpen] = useState(true);
  const navigate=useNavigate()

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
      // toast({
      //   title: "Error",
      //   description: validationError,
      //   variant: "destructive",
      // });
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
        // toast({
        //   title: "Success",
        //   description: "Password changed successfully!",
        //   variant: "positive",
        // });
        setAlertMessage("Password changed successfully!");
      setAlertOpen(true);
        // toast.success("Password changed successfully!");
        setIsOpen(false);
        navigate('/profile')
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          setAlertMessage("The old password is incorrect.");
      setAlertOpen(true);
            // toast.error(data.error || "The old password is incorrect.");
        } else if (status === 500) {
          setAlertMessage("The new password cannot be the same as the old password.");
      setAlertOpen(true);
            // toast.error("The new password cannot be the same as the old password.");
        } else {
          setAlertMessage("Old password and new password are required.");
      setAlertOpen(true);
            // toast.error("Old password and new password are required.");
        }
    } else {
      setAlertMessage("Failed to change password. Check your old password.");
      setAlertOpen(true);
      // toast.error("Failed to change password. Check your old password.");
    }
      
    } finally {
      setLoading(false);
    }
  };
  const handleDrawerClose = (isDrawerOpen) => {
    setIsOpen(isDrawerOpen);
    if (!isDrawerOpen) navigate("/profile");
  };
  if(loading){
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
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
          <Input type="password" id="oldPassword" placeholder="Enter old password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />

          <label htmlFor="newPassword">New Password</label>
          <Input type="password" id="newPassword" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />

          <Button type="submit" className="mt-4"
        //    disabled={loading}
           >
          Change Password
            {/* {loading ? <BarLoader className="mb-4" width={"100%"} color="#36d7b7" /> : 'Change Password'} */}
          </Button>
        </form>
        <DrawerFooter>
          <Button variant="outline" onClick={() => {setIsOpen(false);handleDrawerClose()}}>Cancel</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>

    <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Notification</AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline">Close</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={() => setAlertOpen(false)}>Got it</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ChangePassword;
