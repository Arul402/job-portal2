import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "../ui/Drawer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area"; 
import { Textarea } from "../ui/textarea"; 
import { BarLoader } from "react-spinners";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "../ui/sheet";
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
import config from "../../functions/config";

const ApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [profile, setProfile] = useState({
    resume: null,
    skills: [],
    experience: "",
    education: "",
  });
  const [resume, setResume] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [coverLetter, setCoverLetter] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem("user_token");

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const profileResponse = await axios.get(
            `${config.base_url}/api/v1/app/profile/`,
            { headers: { "Authorization": `Token ${token}` } }
          );
          setProfile({
            ...profileResponse.data,
            skills: Array.isArray(profileResponse.data.skills)
              ? profileResponse.data.skills.join(", ")
              : profileResponse.data.skills,
          });
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };
    fetchProfile();
  }, [token]);

  const validateForm = () => {
    if (!resume) {
      setAlertMessage("Please upload your resume.");
      setAlertOpen(true);
      return false;
    }
    if (!coverLetter.trim()) {
      setAlertMessage("Please provide a cover letter.");
      setAlertOpen(true);
      return false;
    }
    if (!profile.skills.trim()) {
      setAlertMessage("Please enter your skills.");
      setAlertOpen(true);
      return false;
    }
    if (!profile.experience.trim()) {
      setAlertMessage("Please enter your experience.");
      setAlertOpen(true);
      return false;
    }
    if (!profile.education.trim()) {
      setAlertMessage("Please enter your education details.");
      setAlertOpen(true);
      return false;
    }
    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("job", parseInt(id));
    formData.append("resume", resume);
    formData.append("cover_letter", coverLetter);
    formData.append("skills", profile.skills);
    formData.append("experience", profile.experience);
    formData.append("education", profile.education);

    try {
      await axios.post(
        `${config.base_url}/api/v1/app/applications/`,
        formData,
        { headers: { "Authorization": `Token ${token}` } }
      );
      setSubmissionStatus("Application submitted successfully!");
      setIsOpen(false);
      alert("Application Submitted successfully!");
      // setAlertMessage("Application Submitted successfully!");
      // setAlertOpen(true);
      navigate("/applied-jobs")
    } catch (error) {
      console.error("Error submitting application:", error);
      setSubmissionStatus("Error submitting application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerClose = (isDrawerOpen) => {
    setIsOpen(isDrawerOpen);
    if (!isDrawerOpen) navigate(`/job/${id}`); // Navigate to /candidate if the drawer is closed
  };
  const Close = () => {
    setIsOpen(false)
    navigate(`/job/${id}`);
  };

  if (loading) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <>
    
    
<Sheet open={isOpen} >
  <SheetContent side="bottom" className="p-7  fixed inset-x-0 bottom-0 z-50 mt-24 flex h-5/6 flex-col rounded-t-[10px] border bg-background max-w-[90%] sm:max-w-[500px] mx-auto">
    <SheetHeader>
      <SheetTitle>Application Form</SheetTitle>
    </SheetHeader>

    <ScrollArea className="h-[calc(85vh-100px)] overflow-y-auto">
      <form className="flex flex-col p-4 space-y-4" >
        <label htmlFor="resume">Resume</label>
        <Input type="file" id="resume" onChange={(e) => setResume(e.target.files[0])} required />
        {profile.resume && (
          <a href={`${config.base_url}${profile.resume}`} target="_blank" rel="noopener noreferrer">
            View Resume
          </a>
        )}

        <label htmlFor="coverLetter">Cover Letter</label>
        <Textarea
          id="coverLetter"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Cover Letter"
        />

        <label htmlFor="skills">Skills</label>
        <Textarea
          id="skills"
          value={profile.skills}
          onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
          placeholder="Skills"
        />

        <label htmlFor="experience">Experience</label>
        <Textarea
          id="experience"
          value={profile.experience}
          onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
          placeholder="Experience"
        />

        <label htmlFor="education">Education</label>
        <Textarea
          id="education"
          value={profile.education}
          onChange={(e) => setProfile({ ...profile, education: e.target.value })}
          placeholder="Education"
        />

        
      </form>
    </ScrollArea>

    <SheetFooter>
    <Button type="submit" onClick={handleSubmit} className="w-full ">
          Apply
        </Button>
      <Button variant="outline" onClick={Close}>
        Cancel
      </Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
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

export default ApplicationForm;
