import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../../functions/config";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { IoBusinessOutline, IoLocationOutline, IoPowerOutline } from "react-icons/io5";
import BarLoader from "react-spinners/BarLoader";

const ViewJob = () => {
  const [jobDetails, setJobDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem("user_token");
  const [profile, setProfile] = useState({
    company_name: '',
    company_photo: null,
  });
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (token) {
          const response = await axios.get(`${config.base_url}/api/v1/app/manage-company-profile/`, {
            headers: { 'Authorization': `Token ${token}` }
          });
          const fetchedProfile = response.data;
          setProfile(fetchedProfile);
          setPhoto(`${config.base_url}${fetchedProfile.company_photo}`);
        }
      } catch (error) {
        console.error("Error fetching company profile:", error);
      }
    };
    fetchProfile();
  }, [token]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`${config.base_url}/api/v1/app/company/jobs/`, {
          headers: { 'Authorization': `Token ${token}` }
        });
        setJobDetails(response.data);
      } catch (err) {
        setError("Error fetching job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, []);

  if (loading) return <BarLoader width={"100%"} color="#36d7b7" />;
  if (error) return <p>{error}</p>;

  return (
    <>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
       View Jobs
      </h1>

      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobDetails.map((job) => (
          <Card key={job.id} className="flex flex-col  shadow-white transition-transform duration-300 delay-200 hover:scale-105 hover:shadow-none">
            <CardHeader className="flex justify-between">
              <CardTitle className="font-bold">{job.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 flex-1">
              <div className="flex justify-between items-center">
                {profile.company_photo && (
                  <img src={profile.company_photo} alt="Company Logo" className="h-8 w-14" />
                )}
                <div className="flex gap-2 items-center">
                  <IoLocationOutline /> {job.location}
                </div>
              </div>
              <hr />
              <p>{job.description}</p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="secondary" className="w-full" onClick={() => navigate(`/job/${job.id}`)}>
                More Details
              </Button>
              <div className="flex items-center gap-2">
                {/* <IoBusinessOutline size={18} className="text-gray-500" />
                <IoPowerOutline size={18} className="text-gray-500" /> */}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
};

export default ViewJob;
