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
//   retryDelay: (retryCount) => Math.pow(2, retryCount) * 1000, // Exponential backoff
//   shouldResetTimeout: true,
//   retryCondition: (error) =>
//       axiosRetry.isNetworkError(error) || error.response?.status >= 500,
// });



// const Edit = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const token = sessionStorage.getItem("user_token");
//     const [isOpen,setIsOpen]=useState(true)
  
//     // State declarations
//     const [title, setTitle] = useState("");
//     const [description, setDescription] = useState("");
//     const [companyName, setCompanyName] = useState("");
//     const [location, setLocation] = useState("");
//     const [salary, setSalary] = useState(50000.00);
//     const [employmentType, setEmploymentType] = useState("");
//     const [ugCgpaMin, setUgCgpaMin] = useState("");
//     const [ugCgpaMax, setUgCgpaMax] = useState("");
//     const [tenthPercentageMin, setTenthPercentageMin] = useState("");
//     const [tenthPercentageMax, setTenthPercentageMax] = useState("");
//     const [twelfthPercentageMin, setTwelfthPercentageMin] = useState("");
//     const [twelfthPercentageMax, setTwelfthPercentageMax] = useState("");
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
//           setUgCgpaMin(data.ug_cgpa_min);
//           setUgCgpaMax(data.ug_cgpa_max);
//           setTenthPercentageMin(data.tenth_percentage_min);
//           setTenthPercentageMax(data.tenth_percentage_max);
//           setTwelfthPercentageMin(data.twelfth_percentage_min);
//           setTwelfthPercentageMax(data.twelfth_percentage_max);
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
//         ug_cgpa_min: parseFloat(ugCgpaMin),
//         ug_cgpa_max: parseFloat(ugCgpaMax),
//         tenth_percentage_min: parseFloat(tenthPercentageMin),
//         tenth_percentage_max: parseFloat(tenthPercentageMax),
//         twelfth_percentage_min: parseFloat(twelfthPercentageMin),
//         twelfth_percentage_max: parseFloat(twelfthPercentageMax),
//         additional_details: additionalDetails,
//       };
    
//       try {
//         const response = await axios.put(`${config.base_url}/api/v1/app/jobs/update/${id}/`, jobData, {
//           headers: {
//             // 'Content-Type': 'application/json',
//             'Authorization': `Token ${token}`
//           },
//           // timeout: 10000  // Retry for slow responses
//         });
//         if (response.status === 200) {
//           // setIsOpen(false);  // Close drawer before navigating
//           alert('Job Updated !!!')
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
    


//     // useEffect(() => {
//     //   if (navigate) {
//     //     navigate('/manage-jobs');  // Adjust according to the route you want.
//     //   }
//     // }, [id]);

//     const handleDrawerClose = (isDrawerOpen) => {
//         setIsOpen(isDrawerOpen);
//         if (!isDrawerOpen) navigate('/recruiter');
//       };

//   return (
//     <Drawer open={isOpen} onOpenChange={handleDrawerClose}>
//       <DrawerContent>
//         <DrawerHeader>
//           <DrawerTitle>Edit Job</DrawerTitle>
//         </DrawerHeader>

//         <ScrollArea className="h-[calc(100vh-150px)] overflow-y-auto">
//           <form  className="space-y-4 p-4">
//             <Input placeholder="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
//             <Textarea placeholder="Job Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
//             <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
//             <Input type="number" placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} required />
//             {/* <Input type="file" accept="image/*" onChange={(e) => setCompanyPhoto(e.target.files[0])} className="w-full p-2" /> */}

//             <Select onValueChange={setEmploymentType} value={employmentType} required>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Select Employment Type" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Full Time">Full-time</SelectItem>
//                 <SelectItem value="Part Time">Part-time</SelectItem>
//                 <SelectItem value="Contract">Contract</SelectItem>
//                 <SelectItem value="Internship">Internship</SelectItem>
//               </SelectContent>
//             </Select>

//             <div className="grid grid-cols-2 gap-4">
//               <Input type="number" placeholder="UG CGPA Min" value={ugCgpaMin} onChange={(e) => setUgCgpaMin(e.target.value)} />
//               <Input type="number" placeholder="UG CGPA Max" value={ugCgpaMax} onChange={(e) => setUgCgpaMax(e.target.value)} />
//               <Input type="number" placeholder="10th % Min" value={tenthPercentageMin} onChange={(e) => setTenthPercentageMin(e.target.value)} min="0" max="100" />
//               <Input type="number" placeholder="10th % Max" value={tenthPercentageMax} onChange={(e) => setTenthPercentageMax(e.target.value)} min="0" max="100" />
//               <Input type="number" placeholder="12th % Min" value={twelfthPercentageMin} onChange={(e) => setTwelfthPercentageMin(e.target.value)} min="0" max="100" />
//               <Input type="number" placeholder="12th % Max" value={twelfthPercentageMax} onChange={(e) => setTwelfthPercentageMax(e.target.value)} min="0" max="100" />
//             </div>

//             {/* {submissionStatus && <p className="text-center text-red-500">{submissionStatus}</p>} */}

//               <label>Additional Details</label>
//              <MDEditor value={additionalDetails} onChange={setAdditionalDetails} />


//             <DrawerFooter>
//               <Button type="submit" className="w-full mt-4" onClick={handleSubmit}>Save Changes</Button>
//               {/* <Button variant="outline" className="w-full mt-4" onClick={isOpen}>Cancel</Button> */}
//             </DrawerFooter>
            
//           </form>
//         </ScrollArea>
//       </DrawerContent>
//     </Drawer>
//   );
// };

// export default Edit;




import React, { useEffect, useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "../ui/Drawer";
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
        skills:JSON.stringify(skills.split(",").map(skill => skill.trim())),
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

    if (loading) {
      return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
    }

    const handleDrawerClose = (isDrawerOpen) => {
      setIsOpen(isDrawerOpen);
      if (!isDrawerOpen) navigate('/recruiter');
    };

    return (
      <Drawer open={isOpen} onOpenChange={handleDrawerClose}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit Job</DrawerTitle>
          </DrawerHeader>

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

              <label>Additional Details</label>
              <MDEditor value={additionalDetails} onChange={setAdditionalDetails} />

              <DrawerFooter>
                <Button type="submit" className="w-full mt-4" onClick={handleSubmit}>Save Changes</Button>
              </DrawerFooter>
            </form>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
};

export default Edit;
