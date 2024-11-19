import React, { useState } from 'react';
import axios from 'axios';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '../components/ui/Drawer';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useNavigate, useParams } from 'react-router-dom';
import { Bounce, ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import { BarLoader } from 'react-spinners';
import config from '../functions/config';

function ForgotPass2() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const { uidb64, token } = useParams();

  const handleForgotPassword = async (e) => {
    e.preventDefault(); // Prevent form submission

    if (!username) {
        toast.error("Please enter your email to proceed")
    //   alert("Please enter your email to proceed");
      return;
    }else {
              sessionStorage.setItem('email', username); // Store email in session storage
    }

    if (!/\S+@\S+\.\S+/.test(username)) {
        toast.error("Please enter a valid email address.")
    //   alert("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true); // Start loader
      const response = await axios.post(`${config.base_url}/api/v1/app/password-reset/`, {
        email: username,
      });

      if (response.status === 200 && response.data.uid && response.data.token) {
        const { uid, token } = response.data;
        navigate(`/reset-password/${uid}/${token}`);
      } else {
        toast.error("Failed to generate password reset link. Please try again.")
        // alert("Failed to generate password reset link. Please try again.");
      }
    } catch (error) {
        toast.error("An error occurred while sending the reset link. Please try again.")
    //   alert("An error occurred while sending the reset link. Please try again.");
      console.error(error);
    } finally {
      setLoading(false); // Stop loader
    }
  };

  const Close = () => {
    setIsOpen(false);
    setTimeout(() => navigate('/login'), 300);
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
      {/* <ToastContainer theme="dark" transition={Bounce} /> */}
      <Drawer open={isOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Forgot Password</DrawerTitle>
          </DrawerHeader>
          <form className="flex flex-col p-4 space-y-4">
            <label htmlFor="email">Email</label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Button type="button" onClick={handleForgotPassword} className="mt-4">
              Verify Email
            </Button>
          </form>
          <DrawerFooter>
            <Button variant="outline" onClick={Close}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default ForgotPass2;
