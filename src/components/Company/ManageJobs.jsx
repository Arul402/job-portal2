import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../../functions/config";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { MapPinIcon, Trash2Icon, Heart, FilePenLine, Briefcase } from "lucide-react";
import BarLoader from "react-spinners/BarLoader";
import {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose
} from "../ui/toast";
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogTitle, DialogClose } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";


const ManageJobs = () => {
  const [jobDetails, setJobDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDeleteJob, setLoadingDeleteJob] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("user_token");

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.base_url}/api/v1/app/company/jobs/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      setJobDetails(response.data);
      console.log(jobDetails)
    } catch (err) {
      setError("Error fetching job details");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (id) => {
    setLoadingDeleteJob(true);
    try {
      const response = await axios.delete(`${config.base_url}/api/v1/app/jobs/delete/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      if (response.status === 204) { // Check for no content response
        setShowDeleteToast(true);
        setConfirmDeleteId(null);
        fetchJobDetails(); // Fetch updated job list after deletion
      }
    } catch (error) {
      console.log("Error deleting job:", error);
      setShowDeleteToast(true);
    } finally {
      setLoadingDeleteJob(false);
    }
  };

  useEffect(() => {
    fetchJobDetails(); // Initial fetch when the component mounts
  }, []); // Only run on mount

  if (loading) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  if (error) return <p>{error}</p>;

  return (
    <>
      <ToastProvider>
        {showDeleteToast && (
          <Toast>
            <ToastTitle>Job Deleted</ToastTitle>
            <ToastDescription>Job successfully removed from the list.</ToastDescription>
            <ToastClose />
          </Toast>
        )}
        <ToastViewport />
        {/* <ScrollArea className="h-[calc(100vh)] overflow-y-auto"> */}

        <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
          Manage Jobs
        </h1>

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobDetails.map((job) => (
            <Card key={job.id} className="flex flex-col  shadow-white transition-transform duration-300 delay-200 hover:scale-105 hover:shadow-none">
              {loadingDeleteJob && <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />}
              <CardHeader className="flex justify-between">
                <CardTitle className="font-bold">{job.title.toUpperCase()}</CardTitle>
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
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="secondary" className="w-full" onClick={() => navigate(`/job/${job.id}`)}>
                  More Details
                </Button>
                <div className="flex items-center gap-2">
                  <FilePenLine
                    size={18}
                    className="text-gray-500 cursor-pointer"
                    onClick={(e) => {e.preventDefault();navigate(`/edit/${job.id}`)}}
                  />
                  <Dialog open={confirmDeleteId === job.id} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
                    <DialogTrigger asChild>
                      <Trash2Icon
                        fill="red"
                        size={18}
                        className="text-red-500 cursor-pointer"
                        onClick={() => setConfirmDeleteId(job.id)}
                      />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <p>Are you sure you want to delete this job?</p>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="secondary" onClick={() => setConfirmDeleteId(null)}>
                            Cancel
                          </Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button variant="destructive" onClick={() => handleDeleteJob(confirmDeleteId)}>
                            Confirm Delete
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        {/* </ScrollArea> */}
      </ToastProvider>
    </>
  );
};

export default ManageJobs;
