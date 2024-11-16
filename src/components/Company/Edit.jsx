// import React, { useEffect, useState } from 'react';
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
// import { ScrollArea } from "../ui/scroll-area";
// import { Textarea } from "../ui/textarea";
// import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "../ui/Drawer";
// import axios from 'axios';
// import { useNavigate, useParams } from 'react-router-dom';
// import config from '../../functions/config';
// import MDEditor from "@uiw/react-md-editor";
// import { BarLoader } from 'react-spinners';
// import axiosRetry from 'axios-retry'; 

// axiosRetry(axios, {
//   retries: 3,
//   retryDelay: (retryCount) => Math.pow(2, retryCount) * 1000,
//   shouldResetTimeout: true,
//   retryCondition: (error) =>
//       axiosRetry.isNetworkError(error) || error.response?.status >= 500,
// });

// const Edit = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const token = sessionStorage.getItem("user_token");
//     const [isOpen, setIsOpen] = useState(true);

//     // State declarations
//     const [title, setTitle] = useState("");
//     const [description, setDescription] = useState("");
//     const [companyName, setCompanyName] = useState("");
//     const [location, setLocation] = useState("");
//     const [salary, setSalary] = useState(50000.00);
//     const [employmentType, setEmploymentType] = useState("");
//     const [skills, setSkills] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [additionalDetails, setAdditionalDetails] = useState("");

//     // Fetch job details
//     useEffect(() => {
//       const fetchJobDetails = async () => {
//         setLoading(true);
//         try {
//           const response = await axios.get(`${config.base_url}/api/v1/app/jobs/${id}/`, {
//             headers: {
//               'Authorization': `Token ${token}`
//             }
//           });
//           const data = response.data;
//           setTitle(data.title);
//           setDescription(data.description);
//           setCompanyName(data.company);
//           setLocation(data.location);
//           setSalary(data.salary);
//           setEmploymentType(data.employment_type);
//           setSkills(data.skills ? data.skills.join(", ") : "");
//           setAdditionalDetails(data.additional_details || "");
//         } catch (err) {
//           console.error('Error fetching job details:', err);
//           setError('Unable to fetch job details.');
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchJobDetails();
//     }, [id, token]);

//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       setLoading(true);

//       const jobData = {
//         title,
//         description,
//         company: companyName,
//         location,
//         salary: parseFloat(salary),
//         employment_type: employmentType,
//         skills:skills.split(",").map(skill => skill.trim()).join(", "),
//         additional_details: additionalDetails,
//       };

//       try {
//         const response = await axios.put(`${config.base_url}/api/v1/app/jobs/update/${id}/`, jobData, {
//           headers: {
//             'Authorization': `Token ${token}`
//           },
//         });
//         if (response.status === 200) {
//           alert('Job Updated !!!');
//           navigate('/manage-jobs');
//         }
//       } catch (err) {
//         console.error('Error updating job:', err);
//         setError('Failed to update job details.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (loading) {
//       return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
//     }

//     const handleDrawerClose = (isDrawerOpen) => {
//       setIsOpen(isDrawerOpen);
//       if (!isDrawerOpen) navigate('/recruiter');
//     };

//     return (
//       <Drawer open={isOpen} onOpenChange={handleDrawerClose}>
//         <DrawerContent>
//           <DrawerHeader>
//             <DrawerTitle>Edit Job</DrawerTitle>
//           </DrawerHeader>

//           <ScrollArea className="h-[calc(100vh-150px)] overflow-y-auto">
//             <form className="space-y-4 p-4">
//               <Input placeholder="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
//               <Textarea placeholder="Job Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
//               <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
//               <Input type="number" placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} required />

//               <Select onValueChange={setEmploymentType} value={employmentType} required>
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Select Employment Type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Full Time">Full-time</SelectItem>
//                   <SelectItem value="Part Time">Part-time</SelectItem>
//                   <SelectItem value="Contract">Contract</SelectItem>
//                   <SelectItem value="Internship">Internship</SelectItem>
//                 </SelectContent>
//               </Select>

//               <Input placeholder="Skills (comma-separated)" value={skills} onChange={(e) => setSkills(e.target.value)} />

//               <label>Additional Details</label>
//               <MDEditor value={additionalDetails} onChange={setAdditionalDetails} />

//               <DrawerFooter>
//                 <Button type="submit" className="w-full mt-4" onClick={handleSubmit}>Save Changes</Button>
//               </DrawerFooter>
//             </form>
//           </ScrollArea>
//         </DrawerContent>
//       </Drawer>
//     );
// };

// export default Edit;



import React, { useEffect, useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "../ui/sheet"; // Updated import
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../../functions/config';
import MDEditor from "@uiw/react-md-editor";
import { BarLoader } from 'react-spinners';
import axiosRetry from 'axios-retry'; 

axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => Math.pow(2, retryCount) * 1000,
  shouldResetTimeout: true,
  retryCondition: (error) =>
      axiosRetry.isNetworkError(error) || error.response?.status >= 500,
});

const Edit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = sessionStorage.getItem("user_token");
    const [isOpen, setIsOpen] = useState(true);

    // State declarations
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [location, setLocation] = useState("");
    const [salary, setSalary] = useState(50000.00);
    const [employmentType, setEmploymentType] = useState("");
    const [skills, setSkills] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [additionalDetails, setAdditionalDetails] = useState("");

    // Fetch job details
    useEffect(() => {
      const fetchJobDetails = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${config.base_url}/api/v1/app/jobs/${id}/`, {
            headers: {
              'Authorization': `Token ${token}`
            }
          });
          const data = response.data;
          setTitle(data.title);
          setDescription(data.description);
          setCompanyName(data.company);
          setLocation(data.location);
          setSalary(data.salary);
          setEmploymentType(data.employment_type);
          setSkills(data.skills ? data.skills.join(", ") : "");
          setAdditionalDetails(data.additional_details || "");
        } catch (err) {
          console.error('Error fetching job details:', err);
          setError('Unable to fetch job details.');
        } finally {
          setLoading(false);
        }
      };

      fetchJobDetails();
    }, [id, token]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      const jobData = {
        title,
        description,
        company: companyName,
        location,
        salary: parseFloat(salary),
        employment_type: employmentType,
        skills:skills.split(",").map(skill => skill.trim()).join(", "),
        additional_details: additionalDetails,
      };

      try {
        const response = await axios.put(`${config.base_url}/api/v1/app/jobs/update/${id}/`, jobData, {
          headers: {
            'Authorization': `Token ${token}`
          },
        });
        if (response.status === 200) {
          alert('Job Updated !!!');
          navigate('/manage-jobs');
        }
      } catch (err) {
        console.error('Error updating job:', err);
        setError('Failed to update job details.');
      } finally {
        setLoading(false);
      }
    };
    const Close = () => {
      setIsOpen(false)
      navigate('/manage-jobs');
    };

    if (loading) {
      return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
    }

    const handleSheetClose = (isSheetOpen) => {
      setIsOpen(isSheetOpen);
      if (!isSheetOpen) navigate('/manage-jobs');
    };

    return (
      <Sheet open={isOpen} >
        <SheetContent side="bottom" className="p-7 fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background max-w-[90%] sm:max-w-[500px] mx-auto"> {/* Updated to side="bottom" */}
          <SheetHeader>
            <SheetTitle>Edit Job</SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-150px)] overflow-y-auto">
            <form className="space-y-4 p-4">
              <Input placeholder="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <Textarea placeholder="Job Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
              <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
              <Input type="number" placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} required />

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

              <Input placeholder="Skills (comma-separated)" value={skills} onChange={(e) => setSkills(e.target.value)} />

              <div className="p-4 border-2">
            <h3>Additional Details</h3><br/>
              <MDEditor value={additionalDetails} onChange={setAdditionalDetails} />
              </div>
              <SheetFooter>
                <Button type="submit" className="w-full " onClick={handleSubmit}>Save Changes</Button>
                <Button variant="outline"  onClick={Close}> Cancel</Button>
              </SheetFooter>
            </form>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
};

export default Edit;
