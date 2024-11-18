import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../../functions/config';
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { BarLoader } from 'react-spinners';
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

import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';

const ViewApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState({});
  const previousLengthRef = useRef(0);
  const [previousLength, setPreviousLength] = useState(0);
  const [newApplicationNotified, setNewApplicationNotified] = useState(false);
  const navigate = useNavigate();
  const token = sessionStorage.getItem('user_token');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const profileResponse = await axios.get(`${config.base_url}/api/v1/app/manage-company-profile/`, {
            headers: { 'Authorization': `Token ${token}` },
          });
          setProfile(profileResponse.data);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };
    fetchProfile();
  }, [token]);

  useEffect(() => {
    const fetchApplicationHistory = async () => {
      try {
        const response = await axios.get(`${config.base_url}/api/v1/app/applications/all/`, {
          headers: { Authorization: `Token ${token}` },
        });
  
        const applicationsData = response.data.map(application => ({
          ...application,
          skills: Array.isArray(application.skills)
            ? application.skills
            : JSON.parse(application.skills.replace(/'/g, '"')),
        }));
  
        if (applicationsData.length === previousLength + 1) {
          toast.info("A new application has been received!"); // Notify about new application
        }
  
        setApplications(applicationsData);
        setPreviousLength(applicationsData.length);
        setLoading(false);
      } catch (err) {
        console.log("Error fetching application history");
        // toast.error("Error fetching application history");
        setLoading(false);
      }
    };
  
    if (token) {
      fetchApplicationHistory();
    } else {
      toast.error("Please Login !!!");
      navigate("/login");
    }
  }, [token, previousLength]);

  

  const handleStatusChange = async (applicationId, status) => {
    setLoading(true);
    try {
      await axios.patch(
        `${config.base_url}/api/v1/app/applications/${applicationId}/update-status/`,
        { status },
        {
          headers: { 'Authorization': `Token ${token}` },
        }
      );
      setApplications(prevApplications =>
        prevApplications.map(app =>
          app.id === applicationId ? { ...app, status } : app
        )
      );
      // toast.success('Application status updated successfully');
      setAlertMessage("Application status updated successfully");
      setAlertOpen(true);
    } catch (err) {
      console.error("Error updating application status:", err);
      toast.error('Error updating application status');
    } finally {
      setLoading(false);
    }
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
      <h1 className="gradient-title font-extrabold text-4xl sm:text-5xl text-center pb-8">
        View Applications
      </h1>
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {applications.length === 0 ? (
          <div>No applications found.</div>
        ) : (
          applications.map((application, index) => (
            <Card key={index} className="flex flex-col my-4 flex-wrap shadow-white transition-transform duration-300 delay-200 hover:scale-105 hover:shadow-none">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="font-bold flex justify-between w-full">
                  {application.company}
                  <div className={`badge ${
                    application.status === "accepted" ? "text-green-600" :
                    application.status === "rejected" ? "text-red-600" :
                    application.status === "applied" ? "text-white" : ""
                  }`}>
                    {application.status.toUpperCase()}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="text-sm">Email: {application.username}</div>
                <div className="text-sm">Experience: {application.experience}</div>
                <div className="text-sm">Education: {application.education}</div>
                <div className="text-sm">Skills: 
                  {Array.isArray(application.skills) ? application.skills.join(', ').toUpperCase() : 'No skills available'}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="secondary" className="flex-1">
                  <a href={`${config.base_url}${application.resume}`} target="_blank" rel="noopener noreferrer">
                    View Resume
                  </a>
                </Button>
                {application?.recruiter_id === profile?.id && (
                  <Select onValueChange={(status) => handleStatusChange(application.id, status)}>
                    <SelectTrigger className={`w-full ${application.status === 'accepted' ? "bg-green-950" : "bg-red-950"}`}>
                      <SelectValue placeholder={`Status: ${application.status.toUpperCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accepted">Accept</SelectItem>
                      <SelectItem value="rejected">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </CardFooter>
            </Card>
          ))
        )}
        {error && <div className="error-message">{error}</div>}
      </div>
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

export default ViewApplications;
