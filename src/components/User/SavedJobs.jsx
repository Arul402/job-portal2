import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoHeartOutline, IoHeart } from "react-icons/io5";
import { Link } from "react-router-dom";
import config from "../../functions/config";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import BarLoader from "react-spinners/BarLoader";
import { Heart } from "lucide-react";

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem("user_token");

  // Fetch saved jobs on component mount
  useEffect(() => {
    const fetchSavedJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${config.base_url}/api/v1/app/jobs/saved/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setSavedJobs(response.data);
      } catch (err) {
        setError("Error fetching saved jobs.");
      } finally {
        setLoading(false);
      }
    };
    fetchSavedJobs();
  }, [token]);

  // Toggle save/unsave job
  const toggleSaveJob = async (jobId) => {
    try {
      const response = await axios.post(
        `${config.base_url}/api/v1/app/jobs/${jobId}/save/`,
        {},
        { headers: { Authorization: `Token ${token}` } }
      );

      // Update UI based on save/unsave response
      if (response.data.message === "Job removed from saved jobs.") {
        setSavedJobs(savedJobs.filter((job) => job.id !== jobId));
      } else {
        const updatedJob = response.data.job; // Assuming response contains updated job details
        setSavedJobs([...savedJobs, updatedJob]);
      }
    } catch (error) {
      console.error("Error toggling saved job:", error);
    }
  };

  if (loading) return <BarLoader width={"100%"} color="#36d7b7" />;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-4xl sm:text-5xl text-center pb-8">
        Saved Jobs
      </h1>
      {savedJobs.length === 0 ? (
        <p>No saved jobs.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedJobs.map((job) => (
            <Card key={job.id} className="flex flex-col  shadow-white transition-transform duration-300 delay-200 hover:scale-105 hover:shadow-none">
              <CardHeader className="flex justify-between">
                <CardTitle className="font-bold">{job.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 flex-1">
                <div className="flex justify-between items-center">
                  <img src={`${job.company_profile_photo}`} alt="Company Photo" className="h-8" />
                  <div className="flex gap-2 items-center">
                    {job.location}
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
                <Button
                  variant="outline"
                  className="w-15"
                  onClick={() => toggleSaveJob(job.id)}
                >
                  <Heart size={20} fill={savedJobs.some((j) => j.id === job.id) ? "red" : "none"} stroke="red" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedJobs;