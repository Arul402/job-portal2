import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  IoLocationOutline,
  IoBusinessOutline,
  IoPowerOutline,
} from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import config from "../../functions/config";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import BarLoader from "react-spinners/BarLoader";

function EligibleJobs() {
  const [jobDetails, setJobDetails] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [photo, setPhoto] = useState();
  const token = sessionStorage.getItem("user_token");
  const navigate = useNavigate();
//   const isMobile = useMediaQuery({ maxWidth: "1150px" });

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
          setUsername(profileResponse.data.first_name);
          setPhoto(`${config.base_url}${profileResponse.data.photo}`);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };
    fetchProfile();
  }, [token]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`${config.base_url}/api/v1/app/jobs/`);
        setJobDetails(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching job details");
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, []);

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
    }
  }, [jobDetails, profile]);

  useEffect(() => {
    // Clear the notification when the user reaches this page
    localStorage.removeItem("last_notified");
  }, []);

  

  if (loading) return <BarLoader width={"100%"} color="#36d7b7" />;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div >
      <h1 className="gradient-title font-extrabold text-4xl sm:text-5xl text-center pb-8">
        Eligible Jobs 
      </h1>
        {filteredJobs.length === 0 ? (
          <p>No jobs match your eligibility criteria.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJobs.map((job, index) => (
              <Card key={index} className="flex flex-col  shadow-white transition-transform duration-300 delay-200 hover:scale-105 hover:shadow-none">
                <CardHeader className="flex justify-between">
                  <CardTitle className="font-bold">{job.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 flex-1">
                  <div className="flex justify-between items-center">
                    <img src={`${config.base_url}${job.company_profile_photo}`} alt="Company Photo" className="h-12" />
                    <div className="flex gap-2 items-center">
                      <IoLocationOutline /> {job.location}
                    </div>
                  </div>
                  <hr />
                  <p>{job.description}</p>
                </CardContent>
                <CardFooter className="flex gap-2">
                <Link to={`/job/${job.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            More Details
          </Button>
        </Link>
                  
                  <div className="flex items-center gap-2">
                    {/* <IoBusinessOutline size={18} className="text-gray-500" />
                    <IoPowerOutline size={18} className="text-gray-500" /> */}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default EligibleJobs;
