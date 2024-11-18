// import { useState } from 'react'
import './App.css'
// import { Button } from './components/ui/button'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from '../src/layouts/app-layout'
import LandingPage from './components/pages/landingpage';
// import Onboarding from './pages/onboarding';
// import JobPage from './pages/job';
// import PostJob from './pages/post-job';
// import MyJobs from './pages/my-jobs';
// import JobListing from './pages/job-listing';
// import SavedJobs from './pages/saved-job';
import { ThemeProvider } from "./components/theme-provider"
import Onboarding from './components/pages/onboarding';
import Candidate from './components/User/Candidate';
import Recruiter from './components/Company/Recruiter';
import { ScrollArea, ScrollBar } from './components/ui/scroll-area';
import Login from './components/Login';
import ProtectedRoute from './components/protected-route';
import JobListing from './components/pages/job-listing';
import UserProfile from './components/User/UserProfile';
import ChangePassword from './components/User/ChangePassword';
import ApplicationForm from './components/User/ApplicationForm';
import JobPage from './components/pages/job';
import PostJob from './components/Company/PostJob';
import AppliedJobs from './components/User/AppliedJobs';
import ViewApplications from './components/Company/ViewApplications';
import ManageJobs from './components/Company/ManageJobs';
import Edit from './components/Company/Edit';
import ViewJob from './components/Company/ViewJobs';
import CompanyProfile from './components/Company/CompanyProfile';
import ChangeCompanyPassword from './components/Company/ChangeCompanyPassword';
import EligibleJobs from './components/User/EligibleJobs';
import SavedJobs from './components/User/SavedJobs';
import ForgotPassword from './components/ForgotPassword';


const router=createBrowserRouter([
  {
    element:<AppLayout/>,
    children:[
      {
        path:'/',
        element:<LandingPage />
      },
      {
        path:'/onboarding',
        element:(<ProtectedRoute><Onboarding/></ProtectedRoute>)
        
      },
      {
        path:'/candidate',
        element:(
          <ProtectedRoute><Candidate/></ProtectedRoute>
        )
        
      },
      {
        path:'/recruiter',
        element:(<ProtectedRoute><Recruiter/></ProtectedRoute>)
        
      },
      {
        path:'/login',
        element:<Login/>
      },
      {
        path:'/jobs',
        element:<JobListing/>
      },
      {
        path:'/profile',
        element:<UserProfile/>
      },
      {
        path:'/changepass',
        element:<ChangePassword/>
      },
      {
        path:'/application-form/:id',
        element:<ApplicationForm/>
      },
      {
        path:'/job/:id',
        element:(<ProtectedRoute><JobPage/></ProtectedRoute>)
      },
      {
        path:'/post-job',
        element:(<ProtectedRoute><PostJob/></ProtectedRoute>)
      },
      {
        path:'/applied-jobs',
        element:<AppliedJobs/>
      },
      {
        path:'/viewapplications',
        element:<ViewApplications/>
      },
      {
        path:'/manage-jobs',
        element:<ManageJobs/>
      },
      {
        path:'/edit/:id',
        element:<Edit/>
      },
      {
        path:'/view-job',
        element:<ViewJob/>
      },
      {
        path:'/company-profile',
        element:<CompanyProfile/>
      },
      {
        path:'/company-password-change',
        element:<ChangeCompanyPassword/>
      },
      {
        path:'/eligible-jobs',
        element:<EligibleJobs/>
      },
      {
        path:'/saved-jobs',
        element:<SavedJobs/>
      },
      {
        path:'/reset-password/:uidb64/:token',
        element:<ForgotPassword/>
      },
      // {
      //   path:'/my-job',
      //   element:<MyJobs/>
      // },
      // {
      //   path:'/onboarding',
      //   element:<Onboarding/>
      // },
    ],
  },
]);

function App() {
  
  // const [count, setCount] = useState(0)

  return (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    
    <RouterProvider router={router} />
  
</ThemeProvider>
  )
  
  
  //   // <>
  //   //   <div>
  //   //     Hii this is arul
  //   //     <Button>Click</Button>
  //   //   </div>
      
  //   // </>
  
}

export default App
