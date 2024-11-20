import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../../functions/config';
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
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
import { BarLoader } from 'react-spinners';

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const token = sessionStorage.getItem('user_token');

  // Helper to get and update the previous statuses from localStorage
  const getPreviousStatuses = () => {
    const previousStatuses = localStorage.getItem('application_statuses');
    return previousStatuses ? JSON.parse(previousStatuses) : {};
  };

  const updatePreviousStatuses = (updatedStatuses) => {
    localStorage.setItem('application_statuses', JSON.stringify(updatedStatuses));
  };

  useEffect(() => {
    const fetchApplicationHistory = async () => {
      try {
        const response = await axios.get(`${config.base_url}/api/v1/app/applications/history/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });
        const applicationsData = response.data.map(application => ({
          ...application,
          skills: Array.isArray(application.skills)
            ? application.skills
            : JSON.parse(application.skills.replace(/'/g, '"')),
        }));
        setApplications(applicationsData);
        setLoading(false);

        // Get the last known statuses from localStorage
        const previousStatuses = getPreviousStatuses();
        const updatedStatuses = { ...previousStatuses };

        // Notify and update only for status changes
        applicationsData.forEach(application => {
          if (application.status !== previousStatuses[application.id]) {
            if (application.status === 'accepted') {
              toast.success(`Your application for ${application.company} has been ACCEPTED!`);
              sessionStorage.setItem('show_Application_Status','true')
            } else if (application.status === 'rejected') {
              toast.error(`Your application for ${application.company} has been REJECTED.`);
              sessionStorage.setItem('show_Application_Status','true')
            }
            // Update the status in the map
            updatedStatuses[application.id] = application.status;
          }
        });

        // Save the updated statuses in localStorage
        updatePreviousStatuses(updatedStatuses);
      } catch (err) {
        setError("Error fetching application history");
        setLoading(false);
      }
    };

    if (token) {
      fetchApplicationHistory();
    } else {
      alert("Please Login !!!");
      navigate('/login');
    }
  }, [token]);

  useEffect(() => {
    const showNotification = localStorage.getItem("show_notification");

    if (showNotification === "true") {
      // Show notification after a slight delay (2ms)
      const timer = setTimeout(() => {
        // alert("New jobs have been posted!");
        setAlertMessage("New jobs have been posted!");
      setAlertOpen(true);
        // toast.info("New jobs have been posted!");

        // Clear the notification flag
        localStorage.removeItem("show_notification");
        sessionStorage.setItem("has_seen_badge", "false");
      }, 2);
      return () => clearTimeout(timer);
  }
}, [token]);

  if(loading){
    <BarLoader width="100%" color="#36d7b7" />
  }

  return (
    <>
      <h1 className="gradient-title font-extrabold text-4xl sm:text-5xl text-center pb-8">
        Applied Jobs 
      </h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <BarLoader width="100%" color="#36d7b7" />
        ) : applications.length === 0 ? (
          <div>No applications found.</div>
        ) : (
          applications.map((application, index) => (
            <Card key={index} className="flex flex-col my-4 flex-wrap shadow-white transition-transform duration-300 delay-200 hover:scale-105 hover:shadow-none ">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="font-bold flex justify-between w-full">
                  {application.company}
                  <div className={`badge ${
                    application.status === "accepted" ? "text-green-600" :
                    application.status === "rejected" ? "text-red-600" :
                    application.status === "Applied" ? "text-white" : ""
                    }`}>
                    {application.status.toUpperCase()}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex justify-end items-center">
                   {application.username}
                </div>
                <hr />
                <div>Experience: {application.experience}</div>
                <div>Education: {application.education}</div>
                <div className="product-price">Skills: 
                  {Array.isArray(application.skills) ? <div className='gap-2 '>{application.skills.join(',  ').toUpperCase()}</div> : 'No skills available'}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="secondary" className="flex-1">
                  <a href={`${config.base_url}${application.resume}`} target="_blank" rel="noopener noreferrer">
                    View Resume
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
        {error && <div className="error-message">{error}</div>}
      </div>

      {/* ToastContainer component to render the notifications */}
      <ToastContainer 
      theme="dark"
      transition={Bounce}
      />
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
};

export default AppliedJobs;
