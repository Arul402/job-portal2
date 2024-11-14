


import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications
import LandingPage from '../pages/landingpage';
import config from '../../functions/config'; // Ensure this is correctly configured

function Candidate() {
  const [jobDetails, setJobDetails] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newJobAlert, setNewJobAlert] = useState(false);
  const lastNotified = localStorage.getItem("last_notified");
  const [profile, setProfile] = useState(null);
  const token = sessionStorage.getItem("user_token");

  // Notify user if new jobs are found
  useEffect(() => {
    if (newJobAlert) {
      notifyUser(); // Notify once when new jobs are found
    }
  }, [newJobAlert]);

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(
          `${config.base_url}/api/v1/app/jobs/`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const jobs = response.data;
        setJobDetails(jobs);
        setFilteredJobs(jobs); // Initially display all jobs
        setLoading(false);

        // Convert 'last_notified' from localStorage to Date object
        const lastNotifiedDate = lastNotified
          ? new Date(lastNotified)
          : new Date(0);

        // Check if there are any jobs posted after the last notified date
        const newJobsPosted = jobs.some(
          (job) => new Date(job.posting_date) > lastNotifiedDate
        );

        if (newJobsPosted && !newJobAlert) {
          setNewJobAlert(true); // Trigger notification alert
          localStorage.setItem("last_notified", new Date()); // Update last notified time
        }
      } catch (err) {
        setError("Error fetching job details");
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [newJobAlert, lastNotified]);

  // Check if the job posting notification flag is set
  // useEffect(() => {
  //   const showNotification = localStorage.getItem("show_notification");

  //   if (showNotification === "true") {
  //     // Show notification
  //     // alert("New jobs have been posted!");

  //     // Clear the notification flag so it doesn't show again
  //     localStorage.removeItem("show_notification");
  //     // sessionStorage.setItem("has_seen_badge","false")
  //   }
  // }, []);

  // useEffect(() => {
  //   const showNotification = localStorage.getItem("show_notification");
  
  //   if (showNotification === "true") {
  //     // Set a 2ms delay before showing the notification
  //     const timer = setTimeout(() => {
  //       // Show notification
  //       alert("New jobs have been posted!");
  
  //       // Clear the notification flag so it doesn't show again
  //       localStorage.removeItem("show_notification");
  //       sessionStorage.setItem("has_seen_badge", "false");
  //     }, 2);
  
  //     // Clear the timeout if the component unmounts to prevent memory leaks
  //     return () => clearTimeout(timer);
  //   }
  // }, []);


  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const profileResponse = await axios.get(
            `${config.base_url}/api/v1/app/profile/`,
            {
              headers: { "Authorization": `Token ${token}` },
            }
          );
          setProfile(profileResponse.data);
          // setUsername(profileResponse.data.first_name);
          // setPhoto(`${config.base_url}${profileResponse.data.photo}`);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };
    fetchProfile();
  }, [token]);


  useEffect(() => {
    if (jobDetails.length > 0 && profile) {
      // Fetch the latest job based on the last entry in jobDetails
      const latestJob = jobDetails[jobDetails.length - 1];
      const {
        ug_cgpa_min,
        ug_cgpa_max,
        tenth_percentage_min,
        tenth_percentage_max,
        twelfth_percentage_min,
        twelfth_percentage_max,
      } = latestJob;
      
      const userUGCGPA = parseFloat(profile.ug_cgpa);
      const userTenthPercentage = parseFloat(profile.tenth_percentage);
      const userTwelfthPercentage = parseFloat(profile.twelfth_percentage);
  
      const isEligible =
        userUGCGPA >= ug_cgpa_min &&
        userUGCGPA <= ug_cgpa_max &&
        userTenthPercentage >= tenth_percentage_min &&
        userTenthPercentage <= tenth_percentage_max &&
        userTwelfthPercentage >= twelfth_percentage_min &&
        userTwelfthPercentage <= twelfth_percentage_max;
  
      if (isEligible) {
        setFilteredJobs([latestJob]); // Only setting the latest eligible job
        
        // Check notification status
        const showNotification = localStorage.getItem("show_notification");
  
        if (showNotification === "true") {
          // Show notification after a slight delay (2ms)
          const timer = setTimeout(() => {
            alert("New jobs have been posted!");
  
            // Clear the notification flag
            localStorage.removeItem("show_notification");
            sessionStorage.setItem("has_seen_badge", "false");
          }, 2);
  
          // Clean up the timeout if the component unmounts
          return () => clearTimeout(timer);
        }
      }
    }
  }, [jobDetails, profile]);

  const notifyUser = () => {
    // Your notification logic (toast, alert, etc.)
    alert("New jobs have been posted!");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <LandingPage type={"Candidate"} />
    </>
  );
}

export default Candidate;