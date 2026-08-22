import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function PageLayout({ children, activePage, setActivePage }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#070b12] text-white">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div
        className={
          collapsed
            ? "min-h-screen transition-all duration-300 ml-[78px]"
            : "min-h-screen transition-all duration-300 ml-[250px]"
        }
      >
        <Topbar />

        <main className="min-h-[calc(100vh-76px)] p-5 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default PageLayout;