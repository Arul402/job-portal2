// import Header from "@/components/header";
// import { ScrollArea, Scrollbar } from "@radix-ui/react-scroll-area";
import Header from "../components/header";
import { Outlet } from "react-router-dom";
// import { ScrollBar } from "../components/ui/scroll-area";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";

const AppLayout = () => {
  return (

    <div>
      <ScrollArea  className="h-[calc(100vh)] overflow-y-auto">
        <div className="grid-background"></div>
        <main className="min-h-screen min-w-full container p-7">
        
        <Header/>
        <Outlet/>
        {/* <Scrollbar orientation="horizontal"  /> */}
        
        </main>
        <div className="p-5 text-center bg-gray-800 mt-5">
         {/* Developed by Job Site Team */}
         © Job Site 2024
       </div>
       </ScrollArea>
        
    </div>
  );
};

export default AppLayout

