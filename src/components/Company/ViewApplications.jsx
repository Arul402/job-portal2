import React, { useEffect, useState } from 'react';
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

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { ToastProvider, Toast, ToastTitle, ToastDescription, ToastViewport } from '../ui/toast';

const ViewApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const token = sessionStorage.getItem('user_token');

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const profileResponse = await axios.get(`${config.base_url}/api/v1/app/manage-company-profile/`, {
            headers: {
              'Authorization': `Token ${token}`,
            },
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
          headers: {
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
        console.log(applicationsData)
        setLoading(false);
      } catch (err) {
        setError("Error fetching application history");
        setLoading(false);
      }
    };

    if (token) {
      fetchApplicationHistory();
    } else {
      showToastMessage("Please Login !!!");
      navigate('/login');
    }
  }, [token]);

  const handleStatusChange = async (applicationId, status) => {
    setLoading(true);
    try {
      await axios.patch(
        `${config.base_url}/api/v1/app/applications/${applicationId}/update-status/`,
        { status },
        {
          headers: {
            'Authorization': `Token ${token}`,
          },
        }
      );
      setApplications(prevApplications =>
        prevApplications.map(app =>
          app.id === applicationId ? { ...app, status } : app
        )
      );
      showToastMessage('Application status updated successfully');
    } catch (err) {
      console.error("Error updating application status:", err);
      showToastMessage('Error updating application status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToastProvider>
        <h1 className="gradient-title font-extrabold text-4xl sm:text-5xl text-center pb-8">
        View Applications
      </h1>
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <BarLoader width="100%" color="#36d7b7" />
        ) : applications.length === 0 ? (
          <div>No applications found.</div>
        ) : (
          applications.map((application, index) => (
            <Card key={index} className="flex flex-col my-4 flex-wrap  shadow-white transition-transform duration-300 delay-200 hover:scale-105 hover:shadow-none ">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="font-bold flex justify-between w-full">
                  {application.company}
                  <div
                    className={`badge ${
                      application.status === "accepted" ? "text-green-600" :
                      application.status === "rejected" ? "text-red-600" :
                      application.status === "applied" ? "text-white" : ""
                    }`}
                  >
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
        {showToast && (
          <Toast>
            <ToastTitle>Notification</ToastTitle>
            <ToastDescription>{toastMessage}</ToastDescription>
          </Toast>
        )}
        <ToastViewport />
      </div>
    </ToastProvider>
  );
};

export default ViewApplications;