import { useState } from "react";
import { MineDataProvider } from "./context/MineDataContext";
import PageLayout from "./components/layout/PageLayout";
import Dashboard from "./pages/Dashboard";
import LiveMine from "./pages/LiveMine";
import Workers from "./pages/Workers";
import Alerts from "./pages/Alerts";
import Sensors from "./pages/Sensors";
import Evacuation from "./pages/Evacuation";
import Analytics from "./pages/Analytics";
import Helmets from "./pages/Helmets";
import Network from "./pages/Network";
import Maintenance from "./pages/Maintenance";
import Settings from "./pages/Settings";

const pages = {
  dashboard: Dashboard,
  "live-mine": LiveMine,
  workers: Workers,
  alerts: Alerts,
  sensors: Sensors,
  evacuation: Evacuation,
  analytics: Analytics,
  helmets: Helmets,
  network: Network,
  maintenance: Maintenance,
  settings: Settings,
};

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const ActivePage = pages[activePage] || Dashboard;

  return (
    <MineDataProvider>
      <PageLayout activePage={activePage} setActivePage={setActivePage}>
        <ActivePage />
      </PageLayout>
    </MineDataProvider>
  );
}

export default App;
