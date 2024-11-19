import React, { useState } from 'react';
import axios from 'axios';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '../components/ui/Drawer';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { BarLoader } from 'react-spinners';
import config from '../functions/config';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const username = sessionStorage.getItem('email');
  const { uidb64, token } = useParams();

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 5 || password.length > 10) return 'Password must be 5-10 characters long';
    if (!/\d/.test(password)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain at least one special character';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username) {
      toast.error('Email is required.');
      return;
    }

    const validationError = validatePassword(newPassword);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${config.base_url}/api/v1/app/password-reset/confirm/${uidb64}/${token}/`, // Replace with the actual API endpoint
        {
          username: username,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }
      );

      if (response.status === 200) {
        alert("Password reset successfully! Please log in with your new password.")
        setIsOpen(false);
        navigate('/login'); // Navigate to login page after success
      }
    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            if (status === 402) {
              setAlertMessage("The New password cannot be same as the current password.");
          setAlertOpen(true);
                // toast.error(data.error || "The old password is incorrect.");
            } else if (status === 500) {
              setAlertMessage("New password and confirmation password do not match.");
          setAlertOpen(true);
                // toast.error("The new password cannot be the same as the old password.");
            } else {
              setAlertMessage("New password and confirmation password are required.");
          setAlertOpen(true);
                // toast.error("Old password and new password are required.");
            }
        } else {
          setAlertMessage("Failed to reset password. Please try again.");
          setAlertOpen(true);
          // toast.error("Failed to change password. Check your old password.");
        }
    //   const errorMessage = error.response?.data?.error || 'Failed to reset password. Please try again.';
    //   toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const Close = () => {
    setIsOpen(false)
    navigate('/forgotpassword');
  };

  const handleDrawerClose = (isDrawerOpen) => {
    setIsOpen(isDrawerOpen);
    if (!isDrawerOpen) navigate("/login");
  };
  if (loading) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <>
      <ToastContainer theme="dark" transition={Bounce} />
      <Drawer open={isOpen} >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Forgot Password</DrawerTitle>
          </DrawerHeader>
          <form className="flex flex-col p-4 space-y-4" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={username}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled
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

            <label htmlFor="confirmPassword">Confirm Password</label>
            <Input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button type="submit" className="mt-4">
              {loading ? 'Processing...' : 'Reset Password'}
            </Button>
          </form>
          <DrawerFooter>
            <Button variant="outline" onClick={Close}>
              Cancel
            </Button>
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

export default ForgotPassword;
