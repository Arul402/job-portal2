import { Briefcase, Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import axios from "axios";
import config from "../functions/config";

const JobCard = ({
  job,
  savedInit = false,
  onJobAction = () => {},
  isMyJob = false,
}) => {
  const [saved, setSaved] = useState(savedInit);
  const [loadingDeleteJob, setLoadingDeleteJob] = useState(false);
  const [loadingSavedJob, setLoadingSavedJob] = useState(false);
  const [jobDetails,setJobDetails]=useState()
  const token = sessionStorage.getItem("user_token");

  const user_id = sessionStorage.getItem("user_id");


  useEffect(() => {
    // Fetch saved jobs once to set initial saved state if necessary
    const fetchSavedJobs = async () => {
      try {
        const response = await axios.get(`${config.base_url}/api/v1/app/jobs/saved/`, {
          headers: { 'Authorization': `Token ${token}` },
        });
        const jobs = response.data;
        console.log(jobs);
        
        // Find the current job in the list of saved jobs
        const currentJob = jobs.find(j => j.id === job.id);
        
        // Check if the current job exists in saved jobs and set the state accordingly
        if (currentJob && currentJob.is_saved) {
          setSaved(true);
        } else {
          setSaved(false); // If not found, set it as not saved
        }
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
      }
    };

    fetchSavedJobs();
  }, [job.id, token]);

  
  

  const handleSaveJob = async () => {
    setLoadingSavedJob(true);
    try {
      if (saved) {
        // If already saved, remove from saved jobs
        await axios.delete(`${config.base_url}/api/v1/app/jobs/${job.id}/unsave/`,{
          headers: { 'Authorization': `Token ${token}` }
        });
        setSaved(false);
      } else {
        // If not saved, add to saved jobs
        await axios.post(`${config.base_url}/api/v1/app/jobs/${job.id}/save/`, {
          user_id,
          job_id: job.id,
        },{
          headers: { 'Authorization': `Token ${token}` }
        });
        setSaved(true);
      }
      onJobAction(); // Optionally trigger any other actions you need
    } catch (error) {
      console.error("Error toggling saved job:", error);
    } finally {
      setLoadingSavedJob(false);
    }
  };


  const handleDeleteJob = async () => {
    setLoadingDeleteJob(true);
    try {
      await axios.delete(`${config.base_url}/api/v1/app/jobs/${job.id}/delete/`);
      onJobAction(); // Optionally trigger any other actions after deletion
    } catch (error) {
      console.error("Error deleting job:", error);
    } finally {
      setLoadingDeleteJob(false);
    }
  };

  useEffect(() => {
    // Assuming `savedJob` is fetched on mount and will update the `saved` state
  }, []);


  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`${config.base_url}/api/v1/app/jobs/`, {
          headers: { "Content-Type": "application/json" },
        });
        const jobs = response.data;
        setJobDetails(jobs);
        // setFilteredJobs(jobs); // Display all jobs initially
        // setLoading(false);

        // Check if there are any jobs posted after the last notified date
        // const lastNotifiedDate = lastNotified ? new Date(lastNotified) : new Date(0);
        // const newJobsPosted = jobs.some(job => new Date(job.posting_date) > lastNotifiedDate);

    //     if (newJobsPosted && !newJobAlert) {
    //       setNewJobAlert(true);
    //     }
    //   } catch (err) {
    //     console.error("Error fetching jobs:", err);
    //     setLoading(false);
    //   }
    }
    catch(error){
        console.log(error)
    }
}
    fetchJobDetails();
}, []);



  return (
    <Card className="flex flex-col  shadow-white transition-transform duration-300 delay-200 hover:scale-105 hover:shadow-none" >
      {loadingDeleteJob && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}
      <CardHeader className="flex">
        <CardTitle className="flex justify-between font-bold">
          {job.title.toUpperCase()}
          {/* {isMyJob && (
            <Trash2Icon
              fill="red"
              size={18}
              className="text-red-300 cursor-pointer"
              onClick={handleDeleteJob}
            />
          )} */}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
      <div className="flex justify-between items-center">
                  
                  <div className="flex gap-2 items-center">
                    {job.company.toUpperCase()}
                    {/* <MapPinIcon size={15} /> {job.location} */}
                  </div>
                  {job.company_profile_photo && (
                    <img src={`${config.base_url}${job.company_profile_photo}`} alt="Company Logo" className="h-6 w-10" />
                  )}
                </div><br/>
                <div className="flex justify-between items-center">
                  
                  <div className="flex gap-2 items-center">
                  <Briefcase />  {job.employment_type.toUpperCase()}
                  </div>
                  <div className="flex gap-2 items-center">
                    <MapPinIcon size={15} />{job.location.toUpperCase()}
                  </div>
                  
                </div>
                <hr />
                <p>{job.description}</p>




        {/* <div className="flex justify-between">
          {job.company && <img src={`${config.base_url}${job.company_profile_photo}`} className="h-6" />}
          <div className="flex gap-2 items-center">
            <MapPinIcon size={15} /> {job.location}
          </div>
        </div>
        <hr />
        {job.description.substring(0, job.description.indexOf("."))}.
        {job.description} */}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            More Details
          </Button>
        </Link>
        
        {!isMyJob && (
          <Button
            variant="outline"
            className="w-15"
            onClick={handleSaveJob}
            disabled={loadingSavedJob}
          >
            {saved ? (
              <Heart size={20} fill="red" stroke="red" />
            ) : (
              <Heart size={20} />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
