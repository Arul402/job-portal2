import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import axios from 'axios';
import { Bounce, ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
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
} from "../components/ui/alert-dialog";
// import config from '@/config';
import { useToast } from "../components/ui/use-toast"; // Import the useToast hook
import { Input } from "../components/ui/input"; // Import the custom Input component
import config from '../functions/config';
import LandingPage from './pages/landingpage';
import { ScrollArea } from './ui/scroll-area';
import { ToastProvider } from './ui/toast';
// import config from '@/functions/config';

function Login() {
    const [isOpen, setIsOpen] = useState(true);
    const [isClose, setIsClose] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isJobSeekerSignupOpen, setIsJobSeekerSignupOpen] = useState(false);
    const [isJobProviderSignupOpen, setIsJobProviderSignupOpen] = useState(false);
  
    const [first_name, setFirstname] = useState('');
    const [last_name, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [place, setPlace] = useState('');
  //   const [loading, setLoading] = useState(false);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // const phoneRegex = /^\d{10,15}$/;
    const phoneRegex = /^\d{10}$/;

    const navigate = useNavigate();
    // const { toast } = useToast(); // Destructure the toast function
  
    const [username, setUsername] = useState("");
      const [password, setPassword] = useState("");
      // const { toast } = useToast()
  
  
      async function handleSubmit() {
          const data = {
              username: username,
              password: password
          };
  
          // Validate if the fields are filled
          if (username === "" || password === "") {
            
              toast.error("Please fill in both email and password fields.");
              return;
          }
          // setLoading(true);
  
          try {
              const response = await axios.post(`${config.base_url}/api/v1/auth/login/`, data, {
                  headers: {
                      'Content-Type': 'application/json'
                  }
              });
  
              if (response.status === 200) {
                  const { token, is_company_employee } = response.data;
  
                  sessionStorage.setItem('user_token', token);
                  sessionStorage.setItem('email', username);
                  console.log(is_company_employee)
  
                  // Check if the user is a company employee
                  if (is_company_employee) {
                      sessionStorage.setItem('user_type', 'company_employee');
                      // alert("Logged in as Company Employee!")
                      navigate('/onboarding');  // Navigate to company dashboard
                      
                      // toast.success("Logged in as Company Employee!");
                  } else {
                      sessionStorage.setItem('user_type', 'normal_user');
                      // alert("Logged in successfully!")
                      navigate('/onboarding');  // Navigate to normal user homepage
                      // toast.success("Logged in successfully!");
                  }
                  setIsOpen(false)
              } else {

              }
  
          } catch (error) {
            toast.info("Invalid credentials. Please try again.");
              // alert("Invalid credentials. Please try again.")
              // toast.error("Invalid credentials. Please try again.");
          }finally {
              // Ensure loading state is set back to false after API call
              // setLoading(false);
            }
      }
  
  
  
  
    const handleLoginClick = () => {
      setIsOpen(true);
    };
  
    const handleSignUpClick = () => {
      setIsDialogOpen(true); // Open the alert dialog when Sign Up is clicked
    };
  
    const handleUserTypeSelect = (userType) => {
      setIsDialogOpen(false); // Close the dialog after selection
      if (userType === 'Jobseeker') {
        setIsJobSeekerSignupOpen(true); // Open signup form for Jobseeker
      } else if (userType === 'Jobprovider') {
        setIsJobProviderSignupOpen(true); // Open signup form for Jobprovider
      }
    };
  
    // Common validation functions
    const validateEmail = (email) => emailRegex.test(email);
    const validatePhoneNumber = (phone) => phoneRegex.test(phone);
  
    const clearForm = () => {
      setEmail("");
      setFirstname("");
      setLastname("");
      setPhoneNumber("");
      setPlace("");
    };
  
    // Jobseeker Signup
    async function handleJobSeekerSignup() {
      const data = { username: email, first_name:first_name, last_name:last_name, email:email, phone_number:phone_number, place:place };
  
      // Validation logic
      if (!first_name || !last_name || !email || !phone_number || !place) {
        toast.error("All fields must be filled.");
        return;
      }
      if (!validateEmail(email)) {
        toast.error("Invalid email format.");
        return;
      }
      if (!validatePhoneNumber(phone_number)) {
        toast.error("Phone number must be 10 digits.");
        return;
      }
  
      // setLoading(true);
  
      try {
        const response = await axios.post(`${config.base_url}/api/v1/auth/create/`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 200) {
          clearForm();
          sessionStorage.setItem('username', data.first_name);
          toast("Password sent to your email.");
          setIsJobSeekerSignupOpen(false);
        } else {
          toast.error("User creation failed. Try again.");
        }
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 400) {
              toast.error(data.error || "User with this email already exists.");
          } else if (status === 500) {
              toast.error("Server error. Please try again later.");
          } else {
              toast.error("An unexpected error occurred.");
          }
      } else {
          toast.error("Network error. Please check your connection.");
      }
        // toast({
        //   title: 'Error',
        //   description: 'An unexpected error occurred.',
        //   variant: 'destructive',
        // });
        // toast.error("An unexpected error occurred.");
      }
    }
  
    // Jobprovider Signup
    async function handleJobProviderSignup() {
      if (!first_name || !last_name || !email || !phone_number || !place) {
        // toast({
        //   title: 'Error',
        //   description: 'All fields must be filled.',
        //   variant: 'destructive',
        // });
        toast.error("All fields must be filled.");
        return;
      }
  
      if (!validateEmail(email)) {
        // toast({
        //   title: 'Error',
        //   description: 'Please enter a valid email address.',
        //   variant: 'destructive',
        // });
        toast.error("Invalid email format.");
        return;
      }
  
      if (!validatePhoneNumber(phone_number)) {
        // toast({
        //   title: 'Error',
        //   description: 'Phone number should be between 10-15 digits long.',
        //   variant: 'destructive',
        // });
        toast.error("Phone number must be 10 digits.");
        return;
      }
  
      const formData = {
        email: email,
        first_name: first_name,
        last_name: last_name,
        phone_number: phone_number,
        place: place,
      };
      // setLoading(true);
  
      try {
        const response = await axios.post(`${config.base_url}/api/v1/auth/create-company/`, formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          
          clearForm();
          // navigate('/login');
          // toast({
          //   title: 'Success',
          //   description: 'Company created successfully. Password sent to your email.',
          //   variant: 'success',
          // });
          toast("Password sent to your email.");
          setIsJobProviderSignupOpen(false);

        } else {
          // toast({
          //   title: 'Error',
          //   description: 'Registration failed. Try again!',
          //   variant: 'destructive',
          // });
          toast.error("Registration failed. Try again!");
        }
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 400) {
              toast.error(data.error || "User with this email already exists.");
          } else if (status === 500) {
              toast.error("Server error. Please try again later.");
          } else {
              toast.error("An unexpected error occurred.");
          }
      } else {
          toast.error("Network error. Please check your connection.");
      }
        console.error("Error during registration:", error);
      }
    }

    // const handleForgotPassword = async () => {
    //   if (!username) {
    //     alert("Please enter your email to proceed");
    //     // setShowToast(true); // Show notification if email is empty
    //   } else {
    //     sessionStorage.setItem('email', username); // Store email in session storage
    
    //     try {
    //       // Make the API request to reset the password
    //       const response = await axios.post(`${config.base_url}/api/v1/app/password-reset/`, {
    //         email: username, // Send the email to the backend
    //       });
    
    //       if (response.status === 200) {
    //         const { uid, token } = response.data; // Extract UID and token from the response
    //         navigate(`/reset-password/${uid}/${token}`); // Navigate to the password reset page with UID and token
    //       } else {
    //         alert("Failed to generate password reset link. Please try again.");
    //       }
    //     } catch (error) {
    //       alert("An error occurred while sending the reset link. Please try again.");
    //       console.error(error);
    //     }
    //   }
    // };
    
    function close(){
        navigate('/');
    }
    const handleDrawerClose = (isDrawerOpen) => {
      setIsOpen(isDrawerOpen);
      if (!isDrawerOpen) navigate("/"); // Navigate to /candidate if the drawer is closed
    };
  return (
    // <div>Login</div>
    <>
    {/* <ToastProvider> */}
    <ToastContainer
    theme="dark"
    transition={Bounce}
    />
    <LandingPage/>

<Drawer open={isOpen} 
// onOpenChange={handleDrawerClose}
>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Login</DrawerTitle>
            <DrawerDescription>Enter your credentials to log in.</DrawerDescription>
          </DrawerHeader>

          <form className="flex flex-col p-4" >
            <label htmlFor="email">Email</label>
            <Input type="email" id="email" placeholder="Enter your email"
             value={username} onChange={(e)=>setUsername(e.target.value)} 
             className="mb-3 mt-2"
             required />
  
            <label htmlFor="password">Password</label>
            <Input type="password" id="password" placeholder="Enter your password"
             value={password} onChange={(e)=>setPassword(e.target.value)}
             className="mb-3 mt-2"
              required  />

            {/* <p className="mt-2">
              Don't have an Account? 

<AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <AlertDialogTrigger className="text-blue-500" onClick={handleSignUpClick}>Sign Up</AlertDialogTrigger>
  <AlertDialogContent 
    className="p-6 rounded-lg shadow-md w-full max-w-xs sm:max-w-md mx-auto"
    style={{
      // maxWidth: "50vw",
      margin: "0 auto", // Centers the dialog
    }}
  >
    <AlertDialogHeader>
      <AlertDialogTitle 
      // className="sm:text-center text-base sm:text-xl"
      >Select Your Role</AlertDialogTitle>
      <AlertDialogDescription 
      // className="text-center text-xs sm:text-base"
      >
        Please select whether you are a Jobseeker or Jobprovider.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter className="flex flex-col gap-2 sm:flex-row">
     
      <AlertDialogAction onClick={() => handleUserTypeSelect("Jobseeker")} className="w-full sm:w-auto">
        Jobseeker
      </AlertDialogAction>
      <AlertDialogAction onClick={() => handleUserTypeSelect("Jobprovider")} className="w-full sm:w-auto">
        Jobprovider
      </AlertDialogAction>
      <AlertDialogCancel onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">Cancel</AlertDialogCancel>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

            <h3 className="text-blue-500 relative left-80 bottom-5">Forgot Password</h3>

            </p> */}


<p className="mt-2 mb-5 flex items-center justify-between">
  <span>
    Don't have an Account? 
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger className="text-blue-500 ml-1" onClick={handleSignUpClick}>Sign Up</AlertDialogTrigger>
      <AlertDialogContent 
        className="p-6 rounded-lg shadow-md w-full max-w-xs sm:max-w-md mx-auto"
        style={{
          margin: "0 auto", // Centers the dialog
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Select Your Role</AlertDialogTitle>
          <AlertDialogDescription>
            Please select whether you are a Jobseeker or Jobprovider.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col gap-2 sm:flex-row">
          <AlertDialogAction onClick={() => handleUserTypeSelect("Jobseeker")} className="w-full sm:w-auto">
            Jobseeker
          </AlertDialogAction>
          <AlertDialogAction onClick={() => handleUserTypeSelect("Jobprovider")} className="w-full sm:w-auto">
            Jobprovider
          </AlertDialogAction>
          <AlertDialogCancel onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </span>
  <Link 
    to="/forgotpassword"
    className="text-blue-500"
    style={{
      textDecoration: "none", // Removes underline for a cleaner look
    }}
  >
    Forgot Password
  </Link>
</p><br/><br/>

            
            <Button type="submit" 
            onClick= {(e)=>{e.preventDefault();handleSubmit();}  }
            >Login</Button>
            
          </form>

          <DrawerFooter>
            {/* <Button type="submit" 
            onClick= {(e)=>{e.preventDefault();handleSubmit();}  }
            >Login</Button> */}
            <DrawerClose  close={isClose}  >
            {/* <Button type="submit" 
            // onClick= {(e)=>{e.preventDefault();}  }
            onClick={handleForgotPassword}
            >Forgot Password</Button><br/><br/> */}
                
              <Button variant="outline" className="w-full" onClick={close}>Cancel</Button>
              {/* {Button.clicked===true ? close():navigate('/')} */}
              {/* <Navigate to={'/'} /> */}
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Signup Form Drawer for Jobseeker */}
      <Drawer open={isJobSeekerSignupOpen} onOpenChange={setIsJobSeekerSignupOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Jobseeker Sign Up</DrawerTitle>
            <DrawerDescription>Fill in your details to create an account.</DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="h-[calc(100vh-150px)] overflow-y-auto">
          <form className="flex flex-col p-4" >
            <label htmlFor="first_name">First Name</label>
            <Input type="text" id="first_name" className="mb-2" value={first_name} onChange={(e) => setFirstname(e.target.value)} required />
            
            <label htmlFor="last_name">Last Name</label>
            <Input type="text" id="last_name" className="mb-2" value={last_name} onChange={(e) => setLastname(e.target.value)} required />
            
            <label htmlFor="email">Email</label>
            <Input type="email" id="email" className="mb-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
            
            <label htmlFor="phone_number">Phone Number</label>
            <Input type="text" id="phone_number" className="mb-2" value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)} required />
            
            <label htmlFor="place">Place</label>
            <Input type="text" id="place" className="mb-2" value={place} onChange={(e) => setPlace(e.target.value)} required />

            <Button type="submit" className="mt-4" onClick={(e)=>{e.preventDefault();handleJobSeekerSignup()}}  >
            Sign Up
              {/* {loading ? 'Loading...' : 'Sign Up'} */}
            </Button>
          </form>
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      {/* Signup Form Drawer for Jobprovider */}
      <Drawer open={isJobProviderSignupOpen} onOpenChange={setIsJobProviderSignupOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Jobprovider Sign Up</DrawerTitle>
            <DrawerDescription>Fill in your details to create an account.</DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="h-[calc(100vh-150px)] overflow-y-auto">
          <form className="flex flex-col p-4" >
            <label htmlFor="first_name">First Name</label>
            <Input type="text" id="first_name" className="mb-2" value={first_name} onChange={(e) => setFirstname(e.target.value)} required />
            
            <label htmlFor="last_name">Last Name</label>
            <Input type="text" id="last_name" className="mb-2" value={last_name} onChange={(e) => setLastname(e.target.value)} required />
            
            <label htmlFor="email">Email</label>
            <Input type="email" id="email" className="mb-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
            
            <label htmlFor="phone_number">Phone Number</label>
            <Input type="text" id="phone_number" className="mb-2" value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)} required />
            
            <label htmlFor="place">Place</label>
            <Input type="text" id="place" className="mb-2" value={place} onChange={(e) => setPlace(e.target.value)} required />

            <Button type="submit" className="mt-4"  onClick={(e)=>{e.preventDefault();handleJobProviderSignup();}}>
            Sign Up
              {/* {loading ? 'Loading...' : 'Sign Up'} */}
            </Button>
          </form>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
      {/* </ToastProvider> */}
    </>
  )
}

export default Login