import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* ================= PAGES ================= */
import Home from "./pages/Home";
import User from "./pages/User";
import DesktopLogin from "./pages/DesktopLogin";
import DesktopSignup from "./pages/DesktopSignup";
import DesktopForgotPassword from "./pages/DesktopForgotPassword";
import DesktopEmailVerification from "./pages/DesktopEmailVerification";
import ClientOnboarding from "./pages/ClientOnboarding";
import CreatorOnboarding from "./pages/CreatorOnboarding";

/* ================ COMPONENTS ================= */
import RoleSelection from "./components/ForClient/RoleSelection";
import WorkTypeSelection from "./components/ForClient/WorkTypeSelection";
import GoalsSelection from "./components/ForClient/GoalsSelection";
import ClientNeeds from "./components/ForClient/ClientNeeds";
import BusinessDetails from "./components/ForClient/BusinessDetails";
import SetupWorkspace from "./components/ForClient/SetupWorkspace";
import CreatorRoleSelection from "./components/ForCreator/CreatorRoleSelection";
import WorkTypeSelectionForCreator from "./components/ForCreator/WorkTypeSelectionForCreator";
import CreatorGoalsSelection from "./components/ForCreator/CreatorGoalsSelection";
import CreatorNeeds from "./components/ForCreator/CreatorNeeds";
import SetupWorkspaceForCreator from "./components/ForCreator/SetupWorkspaceForCreator";
import CreatorProfileSetup from "./components/ForCreator/CreatorProfileSetup";
import ClientProfileSetup from "./components/ForClient/ClientProfileSetup";
import CreateTeam from "./pages/CreateTeam";
import TeamProfileLight from "./pages/TeamProfileLight";
import UserProfile from "./pages/UserProfile";
import SoloContractListing from "./pages/SoloContractListing";
import TeamContractListing from "./pages/TeamContractListing";


export default function App() {
  const THEME_KEY = "user-theme";

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || "light";
  });

  useEffect(() => {
    // body classes safe way
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);

    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* MAIN */}
          <Route path="/" element={<Home />} />

          {/* PROFILE */}
          <Route
            path="/setting"
            element={<User theme={theme} setTheme={setTheme} />}
          />

          {/* AUTH */}
          <Route path="/desktop-forgot-password" element={<DesktopForgotPassword />} />
          <Route path="/desktop-email-verification" element={<DesktopEmailVerification />} />
          <Route path="/login" element={<DesktopLogin />} />
          <Route path="/signup" element={<DesktopSignup />} />
          <Route path="/client-onboarding" element={<ClientOnboarding />} />
          <Route path="/creator-onboarding" element={<CreatorOnboarding />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/work-type-selection" element={<WorkTypeSelection />} />
          <Route path="/goals-selection" element={<GoalsSelection />} />
          <Route path="/client-needs" element={<ClientNeeds />} />
          <Route path="/business-details" element={<BusinessDetails />} />
          <Route path="/setup-workspace" element={<SetupWorkspace />} />
          <Route path="/creator-role-selection" element={<CreatorRoleSelection />} />
          <Route path="/creator-work-type-selection" element={<WorkTypeSelectionForCreator />} />
          <Route path="/creator-goals-selection" element={<CreatorGoalsSelection />} />
          <Route path="/creator-needs" element={<CreatorNeeds />} />
          <Route path="/creator-setup-workspace" element={<SetupWorkspaceForCreator />} />
          <Route path="/creator-profile-setup" element={<CreatorProfileSetup />} />
          <Route path="/client-profile-setup" element={<ClientProfileSetup />} />
          <Route path="/create-team" element={<CreateTeam theme={theme} setTheme={setTheme} />} />
          <Route path="/team-profile" element={<TeamProfileLight />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/solo-contracts-listing" element={<SoloContractListing theme={theme} setTheme={setTheme} />} />
          <Route path="/team-contracts-listing" element={<TeamContractListing theme={theme} setTheme={setTheme} />} />


        </Routes>
      </div>
    </Router>
  );
}
