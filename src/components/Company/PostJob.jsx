import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet"; // Imported Sheet components
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { BarLoader } from "react-spinners";
import config from "../../functions/config";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/Drawer";

const PostJob = () => {
   const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState(50000.0);
  const [employmentType, setEmploymentType] = useState("");
  const [skills, setSkills] = useState([]);  // Updated to store skills as an array
  const [companyPhoto, setCompanyPhoto] = useState(null);
  const [additionalDetails, setAdditionalDetails] = useState(""); // New state for additional details
  const [isOpen, setIsOpen] = useState(true);
  const [isSkillsDrawerOpen, setIsSkillsDrawerOpen] = useState(false); // State for skills drawer
  // const [isAdditionalDetailsDrawerOpen, setIsAdditionalDetailsDrawerOpen] = useState(false); // State for additional details drawer
  const [isAdditionalDetailsDrawerOpen, setIsAdditionalDetailsDrawerOpen] = useState(false);
  const [isAdditionalDetailsSheetOpen, setIsAdditionalDetailsSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const token = sessionStorage.getItem("user_token");
  const navigate = useNavigate();
    const [profile, setProfile] = useState({
    company_name: '',
    company_photo: null,
    id: null
  });

  useEffect(() => {
    // Fetch company profile (if needed)
  }, [token]);

  const handleSkillChange = (index, e) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = e.target.value;
    setSkills(updatedSkills);
  };

  const addSkill = (e) => { 
    e.preventDefault();
    setSkills([...skills, ""]);
  };

  const removeSkill = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCompanyPhoto(file);
    }
  };

    useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (token) {
          const response = await axios.get(`${config.base_url}/api/v1/app/manage-company-profile/`, {
            headers: {
              'Authorization': `Token ${token}`,
            }
          });

          const fetchedProfile = response.data;
          const profilePhotoUrl = `${config.base_url}${fetchedProfile.company_photo}`;
          setCompanyPhoto(profilePhotoUrl);
          setProfile({ ...fetchedProfile, id: fetchedProfile.id });
          console.log(profile.company_name);
        }
      } catch (error) {
        console.error('Error fetching company profile:', error);
      }
    };

    fetchProfile();
  }, [token]);


  const handleJobPost = async (e) => {
    e.preventDefault();
    setLoading(true);

    const jobData = new FormData();
    jobData.append("title", title);
    if(!profile.company_name){
      alert("Enter the Company Name In Profile To Post The Job")
      return navigate('/company-profile');
    }else{
      jobData.append("company", profile.company_name);
    }
    
    jobData.append("description", description);
    jobData.append("location", location);
    jobData.append("salary", parseFloat(salary));
    jobData.append("employment_type", employmentType);
    jobData.append("skills", skills.join(','));
    // jobData.append("skills", JSON.stringify(skills)); // Append skills as JSON
    if ( companyPhoto || profile.company_photo) jobData.append("company_profile_photo", companyPhoto || profile.company_photo);
    if (additionalDetails) jobData.append("additional_details", additionalDetails); // Append additional details

    try {
      const response = await axios.post(`${config.base_url}/api/v1/app/jobs/create/`, jobData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        }
      });

      if (response.status === 201) {
        setSubmissionStatus("Job posted successfully.");
        localStorage.setItem('job_posted', new Date().toISOString());
        localStorage.setItem('show_notification', 'true');
        navigate('/recruiter');
      } else {
        setSubmissionStatus("Failed to post job. Please try again.");
      }
    } catch (error) {
      setSubmissionStatus(`Error: ${error.response?.data?.detail || "An error occurred."}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleSkillsDrawer = () => {
    setIsSkillsDrawerOpen(!isSkillsDrawerOpen);
  };
  const Close = () => {
    setIsOpen(false)
    navigate('/recruiter');
  };
  if (loading) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="w-full  p-4 max-w-[600px] mx-auto">
    {/* // <> */}
      <Sheet open={isOpen}  >
      <SheetContent side="bottom" className="p-7  fixed inset-x-0 bottom-0 z-50 mt-24 flex h-5/6 flex-col rounded-t-[10px] border bg-background max-w-[90%] sm:max-w-[500px] mx-auto">
        <SheetHeader>
          <SheetTitle>Post a Job</SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-150px)] overflow-y-auto">
          <form  className="space-y-4 p-4">
            <Input placeholder="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <Textarea placeholder="Job Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
            <Input type="number" placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} required />
            <div className="p-4 border-2">
            <h3>Company Logo</h3><br/>
            <Input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2" />
            </div>
            <Select onValueChange={setEmploymentType} value={employmentType} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Employment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full Time">Full-time</SelectItem>
                <SelectItem value="Part Time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>

            <div className="p-4 space-y-4 border-2">
              <h3>Skills Requirement:</h3>
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <div key={index} className="relative flex items-center space-x-2">
                    <Input
                      type="text"
                      value={skill}
                      onChange={(e) => handleSkillChange(index, e)}
                      className="flex-1"
                      placeholder="Enter a skill"
                    />
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </div>
                ))
              ) : (
                <p>No skills added yet. Click '+ Add Skill' to start adding skills.</p>
              )}
              <Button onClick={(e) => addSkill(e)} className="w-full mt-4">
                + Add Skill
              </Button>
            </div>

            <div className="p-4 border-2">
            <h3>Additional Details</h3><br/>
               <MDEditor
                value={additionalDetails}
                onChange={setAdditionalDetails}
                className="w-full"
                placeholder="Add any additional details for the job here..."
              />
            </div>

            {submissionStatus && <p className="text-center text-red-500">{submissionStatus}</p>}
          </form>
        </ScrollArea>

        <SheetFooter>
          <Button type="submit" onClick={handleJobPost} className="w-full">
            Post Job
          </Button>
          <Button variant="outline"  onClick={Close}>
            Cancel
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>

       
    
    
     </div>
  );
};

export default PostJob;
