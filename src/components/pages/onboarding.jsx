// import { Button } from "../ui/button";
// import { useNavigate } from "react-router-dom";
// import { BarLoader } from "react-spinners";
// import { useState } from "react";

// const Onboarding = () => {
//   const navigate = useNavigate();
//   const [isLoaded, setIsLoaded] = useState(true); // Set isLoaded to true to display buttons initially

//   const handleRoleSelection = (role) => {
//     // Store the user_type in sessionStorage based on the selected role
//     sessionStorage.setItem("user_type", role === "recruiter" ? "company" : "candidate");

//     // Navigate based on the selected role
//     if (role === "candidate") {
      
//       navigate("/candidate");
//       // window.location.reload();
//     } else if (role === "recruiter") {
//       navigate("/recruiter");
//       // window.location.reload();
//     }
//   };

  

//   if (!isLoaded) {
//     return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
//   }

//   return (
//     <><div className="flex flex-col items-center justify-center mt-40">
//       <h2 className="gradient-title font-extrabold text-5xl sm:text-7xl tracking-tighter">
//         I am a...
//       </h2>
//       <div className="mt-16 flex flex-wrap justify-evenly flex-shrink-0 grid-cols-2 gap-4 w-full  md:px-40">
//         <Button
//           variant="blue"
//           className="h-24 w-52   text-2xl"
//           onClick={() => handleRoleSelection("candidate")}
//         >
//           Candidate
//         </Button>
//         <Button
//           variant="destructive"
//           className="h-24 w-52 text-2xl"
//           onClick={() => handleRoleSelection("recruiter")}
//         >
//           Recruiter
//         </Button>
//       </div>
//     </div></>
    
//   );
// };

// export default Onboarding;



import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { useState, useEffect } from "react";

const Onboarding = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(true); // Set isLoaded to true to display buttons initially
  const [isCompanyEmployee, setIsCompanyEmployee] = useState(false);

  useEffect(() => {
    // Check if the user is a recruiter or candidate from sessionStorage
    const userType = sessionStorage.getItem("user_type");
    setIsCompanyEmployee(userType === "company_employee");
  }, []);

  const handleRoleSelection = (role) => {
    // Navigate based on the selected role
    if (role === "candidate") {
      sessionStorage.setItem("user_type", "candidate");
      navigate("/candidate");
    } else if (role === "recruiter") {
      sessionStorage.setItem("user_type", "company");
      navigate("/recruiter");
    }
  };

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <h2 className="gradient-title font-extrabold text-5xl sm:text-7xl tracking-tighter">
        I am a...
      </h2>
      <div className="mt-16 flex flex-wrap justify-evenly flex-shrink-0 grid-cols-2 gap-4 w-full md:px-40">
        {/* <Button
          variant="blue"
          className="h-24 w-52 text-2xl"
          onClick={() => handleRoleSelection("candidate")}
          disabled={isCompanyEmployee} // Disable if the user is a recruiter
        >
          Candidate
        </Button>
        <Button
          variant="destructive"
          className="h-24 w-52 text-2xl"
          onClick={() => handleRoleSelection("recruiter")}
          disabled={!isCompanyEmployee} // Disable if the user is a candidate
        >
          Recruiter
        </Button> */}



<Button
  variant={isCompanyEmployee ? "destructive" : ""}
  className={`
    h-16 w-52 text-2xl
     ${
    !isCompanyEmployee ? "bg-white text-black" : ""
  }`}
  onClick={() => handleRoleSelection("candidate")}
  disabled={isCompanyEmployee} // Disable if the user is a recruiter
>
  Candidate
</Button>

<Button
  variant={!isCompanyEmployee ? "destructive" : ""}
  className={`h-16 w-52 text-2xl ${
    isCompanyEmployee ? "bg-white text-black" : ""
  }`}
  onClick={() => handleRoleSelection("recruiter")}
  disabled={!isCompanyEmployee} // Disable if the user is a candidate
>
  Recruiter
</Button>

      </div>
    </div>
  );
};

export default Onboarding;
