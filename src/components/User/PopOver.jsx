import React, { useEffect, useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import config from '../../functions/config';
import axios from 'axios';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "../ui/navigation-menu";
import { Badge } from '../ui/badge'; // Import the Badge component from ShadeCN UI
import { Button } from '../ui/button';
import PersonDefaultImg from '../../assets/personimg.png'

function PopOver() {
  const token = sessionStorage.getItem("user_token");
  const userType = sessionStorage.getItem("user_type");
  const [username, setUsername] = useState("");
  const [photo, setPhoto] = useState(null);
  const [companyphoto, setCompanyPhoto] = useState(null);
  const [profile, setProfile] = useState(userType === "company" 
    ? { company_name: '', company_photo: null, id: null } 
    : { resume: null, skills: [], experience: "", education: "" }
  );
  const [jobDetails, setJobDetails] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showBadge, setShowBadge] = useState(false);
  const [newJobCount, setNewJobCount] = useState(0);
  const lastNotified = localStorage.getItem("last_notified");
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate=useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // Track menu open state
  // const location = useLocation(); // Get current location
  const userphotos=sessionStorage.getItem("Userphoto")
  const Companyphoto=sessionStorage.getItem("Companyphoto")

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false); // Close menu on location change
  }, [location]);

  // Toggle menu open/close state
  const toggleMenu = () => setMenuOpen(prevState => !prevState);

  // Handle link click to close menu
  const handleLinkClick = () => setMenuOpen(false);


  useEffect(() => {
    const userToken = sessionStorage.getItem('user_token');
   
    if (userToken) {
      setIsLoggedIn(true);
     
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          if (userType === "company") {
            const response = await axios.get(`${config.base_url}/api/v1/app/manage-company-profile/`, {
              headers: { 'Authorization': `Token ${token}` }
            });
            setProfile(response.data);
            const companyPhotoURL = `${config.base_url}${response.data.company_photo}`;
            setCompanyPhoto(companyPhotoURL);
            setUsername(response.data.company_name);
          } else {
            const response = await axios.get(`${config.base_url}/api/v1/app/profile/`, {
              headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            setProfile(response.data);
            const userPhotoURL = `${config.base_url}${response.data.photo}`;
            setPhoto(userPhotoURL);
            setUsername(response.data.first_name);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };
    fetchProfile();
  }, [token, userType,photo,companyphoto]);

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`${config.base_url}/api/v1/app/jobs/`);
        setJobDetails(response.data);
      } catch (err) {
        console.error("Error fetching job details:", err);
      }
    };
    fetchJobDetails();
  }, []);



  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`${config.base_url}/api/v1/app/jobs/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`, // Include token if needed
          },
        });

        const jobs = response.data;
        setJobDetails(jobs);
        // setLoading(false);

        // Convert 'last_notified' from localStorage to Date object
        const lastNotifiedDate = lastNotified ? new Date(lastNotified) : new Date(0);

        // Filter new eligible jobs
        const newEligibleJobs = jobs.filter(job => {
          const postingDate = new Date(job.posting_date);
          const isNewJob = postingDate > lastNotifiedDate;

          // Check if the user is eligible for this job
          const isEligible = profile.ug_cgpa >= job.ug_cgpa_min &&
                             profile.ug_cgpa <= job.ug_cgpa_max &&
                             profile.tenth_percentage >= job.tenth_percentage_min &&
                             profile.tenth_percentage <= job.tenth_percentage_max &&
                             profile.twelfth_percentage >= job.twelfth_percentage_min &&
                             profile.twelfth_percentage <= job.twelfth_percentage_max;

                             
          return isNewJob && isEligible;
        });
        console.log(newEligibleJobs)
        
        // if (newEligibleJobs){
        //   setShowBadge(true);
        // }
        if (newEligibleJobs.length > 0) {
          setNewJobCount(newEligibleJobs.length); // Set new job count
          // setShowBadge(true);
          // alert("New eligible jobs have been posted!"); // Notify user
          localStorage.setItem("last_notified", new Date()); // Update last notified time
        } else {
          setNewJobCount(0); // Reset count if no new eligible jobs
        }
      } catch (err) {
        // setError("Error fetching job details");
        // setLoading(false);
      }
    };

    fetchJobDetails();
  }, [token, lastNotified]);

  useEffect(() => {
    if (filteredJobs.length > 0 && !sessionStorage.getItem("has_seen_badge")) {
      setShowBadge(true); // Show badge
    }
  }, [filteredJobs]);
  
  useEffect(() => {
    if (location.pathname === '/eligible-jobs' && showBadge) {
      sessionStorage.setItem("has_seen_badge", "true");
      setShowBadge(false); // Hide badge after viewing New Jobs
    }
  }, [location.pathname, showBadge]);

  useEffect(() => {
    const showBadgeFromStorage = localStorage.getItem('show_notification');
    if (showBadgeFromStorage === 'true') {
      setShowBadge(true); // Show notification badge
    }
  }, []);

 


    const handleLogout = async () => {
    try {
      await axios.post(`${config.base_url}/api/v1/auth/logout/`, {}, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      sessionStorage.removeItem('user_token');
      sessionStorage.removeItem('has_seen_badge');
      alert("Logout Success !!!");
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  const handleNavigateToEligibleJobs = () => {
    setShowBadge(false); // Reset badge when navigating to Eligible Jobs
  };
  const handleLoginClick = () => {
    navigate('/login');
  };



  useEffect(() => {
    const userToken = sessionStorage.getItem('user_token');
    setIsLoggedIn(!!userToken);
  }, []);



  const fetchData = async () => {
    if (!token) return;

    try {
      // Fetch user or company profile based on userType
      const profileUrl = userType === "company" 
        ? `${config.base_url}/api/v1/app/manage-company-profile/`
        : `${config.base_url}/api/v1/app/profile/`;
      
      const profileResponse = await axios.get(profileUrl, {
        headers: { 'Authorization': `Token ${token}` }
      });

      setProfile(profileResponse.data);

      if (userType === "company") {
        const companyPhotoURL = `${config.base_url}${profileResponse.data.company_photo}`;
        setCompanyPhoto(companyPhotoURL);
        setUsername(profileResponse.data.company_name);
      } else {
        const userPhotoURL = `${config.base_url}${profileResponse.data.photo}`;
        setPhoto(userPhotoURL);
        setUsername(profileResponse.data.first_name);
      }

      // Fetch job details
      const jobResponse = await axios.get(`${config.base_url}/api/v1/app/jobs/`);
      setJobDetails(jobResponse.data);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  // Fetch profile and job details together
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        // Fetch user or company profile based on userType
        const profileUrl = userType === "company" 
          ? `${config.base_url}/api/v1/app/manage-company-profile/`
          : `${config.base_url}/api/v1/app/profile/`;
        
        const profileResponse = await axios.get(profileUrl, {
          headers: { 'Authorization': `Token ${token}` }
        });

        setProfile(profileResponse.data);

        if (userType === "company") {
          const companyPhotoURL = `${config.base_url}${profileResponse.data.company_photo}`;
          setCompanyPhoto(companyPhotoURL);
          setUsername(profileResponse.data.company_name);
        } else {
          const userPhotoURL = `${config.base_url}${profileResponse.data.photo}`;
          setPhoto(userPhotoURL);
          setUsername(profileResponse.data.first_name);
        }
        console.log(companyphoto)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token, userType,companyphoto,photo]); // Only re-fetch when token or userType changes

  // Filter eligible jobs based on user profile
  useEffect(() => {
    if (jobDetails.length > 0 && profile) {
      const eligibleJobs = jobDetails.filter((job) => {
        const { ug_cgpa_min, ug_cgpa_max, tenth_percentage_min, tenth_percentage_max, twelfth_percentage_min, twelfth_percentage_max } = job;
        const userUGCGPA = parseFloat(profile.ug_cgpa);
        const userTenthPercentage = parseFloat(profile.tenth_percentage);
        const userTwelfthPercentage = parseFloat(profile.twelfth_percentage);

        return (
          userUGCGPA >= ug_cgpa_min &&
          userUGCGPA <= ug_cgpa_max &&
          userTenthPercentage >= tenth_percentage_min &&
          userTenthPercentage <= tenth_percentage_max &&
          userTwelfthPercentage >= twelfth_percentage_min &&
          userTwelfthPercentage <= twelfth_percentage_max
        );
      });

      setFilteredJobs(eligibleJobs);
      setShowBadge(eligibleJobs.length > 0);
    }
  }, [jobDetails, profile]);

 
  return (
    <Popover>
      <PopoverTrigger asChild>
      {isLoggedIn ? (
        <div>
          {userType === "company" ? (
            <img
              src={
                Companyphoto 
      ? Companyphoto 
      : PersonDefaultImg 
     }
              alt="Profile"
              className="w-12 h-12 sm:w-16 sm:h-16 lg:w-12 lg:h-12 rounded-full top-5 right-2 sm:top-4 sm:right-4"
            />
          )
          : userType === "candidate" ? (
            <img
              src={userphotos 
                ? userphotos || photo || PersonDefaultImg
                : PersonDefaultImg 
                }
              alt=" Profile"
              className="w-12 h-12 sm:w-16 sm:h-16 lg:w-12 lg:h-12 rounded-full top-5 right-2 sm:top-4 sm:right-4"
              
            />
          ) 
           : null}
        </div>
      ):(
        <Button variant="outline" onClick={handleLoginClick}>
          Login
        </Button>
      )
    }



      </PopoverTrigger>
      <PopoverContent className="p-4 w-full">

<NavigationMenu className={`flex flex-col space-y-2 list-none ${menuOpen ? 'open' : ''}`}>
    {userType === "company" ? (
      <>
        <NavigationMenuItem>
          <Link to="/recruiter" className={navigationMenuTriggerStyle()} onClick={() => { handleLinkClick(); setMenuOpen(false); }}>
            Home
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/company-profile" className={navigationMenuTriggerStyle()} onClick={() => { handleLinkClick(); setMenuOpen(false); }}>
            Company Profile
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/post-job" className={navigationMenuTriggerStyle()} onClick={() => { handleLinkClick(); setMenuOpen(false); }}>
            Post Jobs
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/manage-jobs" className={navigationMenuTriggerStyle()} onClick={() => { handleLinkClick(); setMenuOpen(false); }}>
            Manage Jobs
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/viewapplications" className={navigationMenuTriggerStyle()} onClick={() => { handleLinkClick(); setMenuOpen(false); }}>
            View Applications
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/view-job" className={navigationMenuTriggerStyle()} onClick={() => { handleLinkClick(); setMenuOpen(false); }}>
            View Jobs
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/" className="text-red-600 hover:underline" onClick={() => { handleLogout(); handleLinkClick(); setMenuOpen(false); }}>
            Logout
          </Link>
        </NavigationMenuItem>
      </>
    ) : (
      <>
        <NavigationMenuItem>
          <Link to="/candidate" className={navigationMenuTriggerStyle()} onClick={() => { handleLinkClick(); setMenuOpen(false); }}>
            Home
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/profile" className={navigationMenuTriggerStyle()} onClick={() => { handleLinkClick(); setMenuOpen(false);  }}>
            Profile
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/applied-jobs" className={navigationMenuTriggerStyle()} onClick={() => { handleLinkClick(); setMenuOpen(false); }}>
            Applied Jobs
          </Link>
        </NavigationMenuItem>
        {/* <NavigationMenuItem>
          <Link 
            to="/eligible-jobs" 
            className={navigationMenuTriggerStyle()} 
            onClick={() => { handleNavigateToEligibleJobs(); handleLinkClick(); setMenuOpen(false); }}
          >
            Eligible Jobs {showBadge && <span className="badge4">{filteredJobs.length}</span>}
          </Link>
        </NavigationMenuItem> */}
        <NavigationMenuItem>
          <Link to="/jobs" className={navigationMenuTriggerStyle()} onClick={() => { handleLinkClick(); setMenuOpen(false); }}>
            Find Jobs
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/saved-jobs" className={navigationMenuTriggerStyle()} onClick={() => { handleLinkClick(); setMenuOpen(false); }}>
            Saved Jobs
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/" className="text-red-600 hover:underline" onClick={() => { handleLogout(); handleLinkClick(); setMenuOpen(false); }}>
            Logout
          </Link>
        </NavigationMenuItem>
      </>
    )}
  </NavigationMenu>

      </PopoverContent>
    </Popover>
  );
}


export default PopOver;