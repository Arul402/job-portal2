import React from 'react'
import LandingPage from '../pages/landingpage'
import { ScrollArea } from '../ui/scroll-area'

function Recruiter() {
  return (
    // <div>Recruiter</div>
    <>
    {/* <ScrollArea className="h-[calc(100vh)] overflow-y-auto"> */}
    <LandingPage type={"Recruiter"} />
    {/* </ScrollArea> */}
    </>
  )
}

export default Recruiter