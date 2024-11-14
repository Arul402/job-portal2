import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import JobCard from "../job-card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { State } from "country-state-city";
import config from "../../functions/config";
import { City } from "country-state-city";
// import config from "@/config"; // Assuming config.base_url is here

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [jobDetails, setJobDetails] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const token = sessionStorage.getItem("user_token");
  const lastNotified = localStorage.getItem("last_notified");
  const [newJobAlert, setNewJobAlert] = useState(false);
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState("");
  const [filteredJobs1, setFilteredJobs1] = useState([]);
  const [uniqueCompanies, setUniqueCompanies] = useState([]);


  const tamilNaduCities = City.getCitiesOfState("IN", "TN");
console.log(tamilNaduCities);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`${config.base_url}/api/v1/app/jobs/`, {
          headers: { "Content-Type": "application/json" },
        });
        const jobs = response.data;
        console.log(response.data)
        setJobDetails(jobs);
        setFilteredJobs(jobs); // Display all jobs initially
        setLoading(false);
        console.log(filteredJobs)

        const companies = [...new Set(jobs.map((job) => job.company))];
        setUniqueCompanies(companies);
        console.log(uniqueCompanies)

        // Check if there are any jobs posted after the last notified date
        const lastNotifiedDate = lastNotified ? new Date(lastNotified) : new Date(0);
        const newJobsPosted = jobs.some(job => new Date(job.posting_date) > lastNotifiedDate);

        if (newJobsPosted && !newJobAlert) {
          setNewJobAlert(true);
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setLoading(false);
      }
    };

    const fetchProfile = async () => {
      if (token) {
        try {
          const profileResponse = await axios.get(`${config.base_url}/api/v1/app/profile/`, {
            headers: { "Content-Type": "multipart/form-data", Authorization: `Token ${token}` },
          });
          setProfile(profileResponse.data);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };

    fetchJobDetails();
    fetchProfile();
  }, [token, lastNotified, newJobAlert]);

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = jobDetails.filter(
      (job) =>
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        
        job.employment_type.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (location ? job.location.toLowerCase() === location.toLowerCase() : true)
    );
    setFilteredJobs(filtered);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCompany_id("");
    setLocation("");
    setFilteredJobs(jobDetails); // Reset to all jobs
  };
//   const uniqueCompanies = [...new Set(jobDetails.map((job) => job.company))];

// Filter function for selected company
const handleCompanyFilterChange = (company) => {
    setSelectedCompany(company); // Update selected company state

    // Filter jobs based on selected company
    const filtered = jobDetails.filter((job) => job.company === company);

    // Update the filtered jobs state with the jobs that match the selected company
    setFilteredJobs(filtered);
};
const handleLocationFilterChange = (selectedLocation) => {
  setLocation(selectedLocation); // Update selected location state

  // Filter jobs based on the selected location
  const filtered = jobDetails.filter((job) => job.location === selectedLocation);

  // Update the filtered jobs state with the jobs that match the selected location
  setFilteredJobs(filtered);
};



  if (loading) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="">
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>
      <form onSubmit={handleSearch} className="h-14 flex flex-row w-full gap-2 items-center mb-3">
        <Input
          type="text"
          placeholder="Search Jobs by Title.."
          name="search-query"
          className="h-full flex-1  px-4 text-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit" className="h-full sm:w-28" variant="blue">
          Search
        </Button>
      </form>

      <div className="flex flex-col sm:flex-row gap-2">
        {/* <Select value={location} onValueChange={setLocation}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {tamilNaduCities.map(({ name }) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select> */}

<Select value={location} onValueChange={handleLocationFilterChange}>
  <SelectTrigger>
    <SelectValue placeholder="Filter by Location">
      {location || "Filter by Location"}
    </SelectValue>
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      {tamilNaduCities.map(({ name }, index) => {
        console.log("Location:", name, "Index:", index); // Debugging
        return (
          <SelectItem key={index} value={name}>
            {name}
          </SelectItem>
        );
      })}
    </SelectGroup>
  </SelectContent>
</Select>


        <Select value={selectedCompany} onValueChange={handleCompanyFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Company" >{selectedCompany || "Filter by Company"}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {/* {uniqueCompanies.map(({ company, index }) => (
                <SelectItem key={index} value={company}>
                  {uniqueCompanies[0]}
                </SelectItem>
              ))} */}

{uniqueCompanies.map((company, index) => {
  console.log("Company:", company, "Index:", index); // Debug
  return (
    <SelectItem key={index} value={company}>
      {company}
    </SelectItem>
  );
})}

            </SelectGroup>
          </SelectContent>
        </Select>

        <Button className="sm:w-1/2" variant="destructive" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>

      {filteredJobs.length ? (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div>No Jobs Found 😢</div>
      )}
    </div>
  );
};

export default JobListing;
