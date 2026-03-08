import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function WorkTypeSelectionForCreator() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [teamSize, setTeamSize] = useState("");
  const [buildTeamPlan, setBuildTeamPlan] = useState(null);

  const currentStep = 2;
  const totalSteps = 8;

  const handleBack = () => navigate("/creator-role-selection");

  const handleContinue = () => {
    if (selectedType) navigate("/creator-goals-selection");
  };

  const handleReset = () => {
    setSelectedType(null);
    setTeamSize("");
    setBuildTeamPlan(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left Panel */}
      <div className="w-full md:w-[30%] relative overflow-hidden bg-[#CEFF1B] min-h-[45vh] md:min-h-screen">
        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10">
          {/* Back Button - Mobile Only */}
          <button
            onClick={handleBack}
            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center mb-4 relative"
            style={{
              background: "linear-gradient(180deg, #FFFFFF, #9C9C9C)",
              padding: "2px",
            }}
            aria-label="Back"
          >
            <span className="w-full h-full rounded-full flex items-center justify-center bg-[#CEFF1B]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </span>
          </button>

          <div className="flex-1 flex flex-col justify-center md:justify-start md:pt-32 items-center md:items-start text-center md:text-left px-4 md:px-0">
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              How do you work?
            </h2>
          </div>

          {/* Step Indicators - Desktop Only */}
          <div className="hidden md:flex items-center gap-3 ml-12">
            {[...Array(totalSteps)].map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStep ? "bg-black w-4 h-4" : "bg-white"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right / Content */}
      <div className="w-full md:w-[70%] bg-[#E0E0E0] md:bg-gradient-to-br md:from-[#E8E8E8] md:via-[#E0E0E0] md:to-[#D8D8D8] rounded-t-[50px] md:rounded-none -mt-12 md:mt-0 p-6 pt-8 md:p-12 flex flex-col justify-start md:justify-center items-center relative overflow-hidden min-h-[60vh] md:min-h-screen z-20">
        {/* Desktop glows (unchanged) */}
        <div
          className="hidden md:block absolute w-[500px] h-[500px] rounded-full pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(circle, rgba(195, 255, 0, 0.4) 0%, rgba(195, 255, 0, 0.15) 40%, transparent 70%)",
            bottom: "-15%",
            left: "-15%",
            filter: "blur(60px)",
            animation: "glow-bottomleft-center-right 8s ease-in-out infinite",
          }}
        />
        <div
          className="hidden md:block absolute w-[400px] h-[400px] rounded-full pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(circle, rgba(195, 255, 0, 0.35) 0%, rgba(195, 255, 0, 0.1) 40%, transparent 70%)",
            top: "-10%",
            right: "-10%",
            filter: "blur(50px)",
            animation: "glow-center-topright 8s ease-in-out infinite",
          }}
        />
        <div
          className="hidden md:block absolute w-[350px] h-[350px] rounded-full pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(circle, rgba(195, 255, 0, 0.3) 0%, rgba(195, 255, 0, 0.1) 40%, transparent 70%)",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            filter: "blur(50px)",
            animation: "glow-rotate 6s steps(3) infinite",
          }}
        />

        {/* ✅ MOBILE (screenshot-style) */}
        <div className="md:hidden w-full max-w-[420px] relative z-10">
          <div className="px-0 py-0 bg-transparent border-none rounded-none shadow-none">
            {/* Cards row */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedType("solo")}
                className={[
                  "text-left rounded-2xl p-4 transition-all border bg-white",
                  selectedType === "solo"
                    ? "border-black shadow-sm"
                    : "border-[#CEFF1B]",
                ].join(" ")}
              >
                <span
                  className={[
                    "inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium border",
                    selectedType === "solo"
                      ? "border-black bg-white"
                      : "border-black/40 bg-white",
                  ].join(" ")}
                >
                  Solo Creator / Solo Professional
                </span>

                <ul className="mt-3 space-y-2 text-[12px] leading-4 text-black/70">
                  <li className="flex gap-2">
                    <span className="mt-[2px]">•</span>
                    <span>I work individually</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[2px]">•</span>
                    <span>I manage my own tasks and deliveries</span>
                  </li>
                </ul>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType("team")}
                className={[
                  "text-left rounded-2xl p-4 transition-all border bg-white",
                  selectedType === "team"
                    ? "border-black shadow-sm"
                    : "border-[#CEFF1B]",
                ].join(" ")}
              >
                <span
                  className={[
                    "inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium border",
                    selectedType === "team"
                      ? "border-black bg-white"
                      : "border-black/40 bg-white",
                  ].join(" ")}
                >
                  Team / Organization
                </span>

                <ul className="mt-3 space-y-2 text-[12px] leading-4 text-black/70">
                  <li className="flex gap-2">
                    <span className="mt-[2px]">•</span>
                    <span>We have a team</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[2px]">•</span>
                    <span>Multiple people handle projects</span>
                  </li>
                </ul>
              </button>
            </div>

            {/* Team options (mobile) */}
            {selectedType === "team" && (
              <div className="mt-4">
                <label className="block text-black font-semibold mb-2 text-sm text-center">
                  Team Size
                </label>

                <div className="relative">
                  <select
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-black/30 bg-white text-black/70 text-sm focus:border-black focus:outline-none appearance-none pr-9"
                  >
                    <option value="" disabled>
                      Select one
                    </option>
                    <option value="2-5">2-5 people</option>
                    <option value="6-10">6-10 people</option>
                    <option value="11-25">11-25 people</option>
                    <option value="26-50">26-50 people</option>
                    <option value="50+">50+ people</option>
                  </select>

                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-black/50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                <label className="block text-black font-semibold mb-2 mt-4 text-sm text-center">
                  Do you plan to build teams on Ultra Hustle?
                </label>

                <div className="flex gap-2 justify-center">
                  {["Yes", "No", "Maybe Later"].map((option) => {
                    const val = option.toLowerCase();
                    const active = buildTeamPlan === val;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setBuildTeamPlan(val)}
                        className={[
                          "h-10 px-4 rounded-lg border text-xs font-medium transition-all",
                          active
                            ? "bg-[#CEFF1B] border-black text-black"
                            : "bg-white border-black/20 text-black/50",
                        ].join(" ")}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Buttons row */}
            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                onClick={handleReset}
                className="h-10 px-5 rounded-lg border border-black/20 bg-white text-black/60 text-sm"
              >
                Reset
              </button>

              <button
                onClick={handleBack}
                className="h-10 px-6 rounded-lg border border-black/40 bg-white text-black text-sm"
              >
                Back
              </button>

              <button
                onClick={handleContinue}
                disabled={
                  !selectedType ||
                  (selectedType === "team" && (!teamSize || !buildTeamPlan))
                }
                className={[
                  "h-10 px-6 rounded-lg text-sm font-medium border",
                  selectedType &&
                  (selectedType !== "team" || (teamSize && buildTeamPlan))
                    ? "bg-[#CEFF1B] border-black text-black"
                    : "bg-[#DADADA] border-black/20 text-black/30",
                ].join(" ")}
              >
                Continue
              </button>
            </div>

            {/* black dots */}
            <div className="mt-6 flex justify-center items-center gap-2">
              {[...Array(totalSteps)].map((_, index) => (
                <span
                  key={index}
                  className={[
                    "w-2 h-2 rounded-full",
                    index === currentStep ? "bg-black" : "bg-black/30",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ✅ DESKTOP (unchanged) */}
        <div className="hidden md:flex flex-col md:flex-row gap-6 justify-between items-stretch relative z-10 w-full px-4">
          {/* Solo Card */}
          <div
            onClick={() => setSelectedType("solo")}
            className={`flex-1 max-w-[450px] min-h-[200px] p-8 rounded-2xl cursor-pointer transition-all duration-300 backdrop-blur-sm ${
              selectedType === "solo"
                ? "bg-[#CEFF1B] border-2 border-black shadow-lg"
                : "bg-white/40 border border-[#CEFF1B] hover:bg-white/20"
            }`}
          >
            <div className="mb-4">
              <span
                className={`inline-block px-5 py-2 rounded-lg border-2 font-semibold text-lg ${
                  selectedType === "solo"
                    ? "border-black bg-[#C3FF00]/10"
                    : "border-gray-900 bg-white"
                }`}
              >
                Solo Creator / Solo Professional
              </span>
            </div>
            <ul className="text-gray-700 text-base space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-gray-500">•</span>
                <span>I work individually</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-500">•</span>
                <span>I manage my own tasks and deliveries</span>
              </li>
            </ul>
          </div>

          {/* Team Card */}
          <div
            onClick={() => setSelectedType("team")}
            className={`flex-1 max-w-[450px] min-h-[200px] p-8 rounded-2xl cursor-pointer transition-all duration-300 backdrop-blur-sm ${
              selectedType === "team"
                ? "bg-[#CEFF1B] border-2 border-black shadow-lg"
                : "bg-white/40 border border-[#CEFF1B] hover:bg-white/20"
            }`}
          >
            <div className="mb-4">
              <span
                className={`inline-block px-5 py-2 rounded-lg border-2 font-semibold text-lg ${
                  selectedType === "team"
                    ? "border-black bg-[#C3FF00]/10"
                    : "border-gray-900 bg-white"
                }`}
              >
                Team / Organization
              </span>
            </div>
            <ul className="text-gray-700 text-base space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-gray-500">•</span>
                <span>We have a team</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-500">•</span>
                <span>Multiple people handle projects</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Extra Options for Team Selection - Desktop (unchanged) */}
        {selectedType === "team" && (
          <div className="hidden md:flex mt-8 flex-col md:flex-row gap-8 justify-between items-start w-full px-4 relative z-10 animate-fade-in-up">
            <div className="flex-1 w-full max-w-[450px]">
              <label className="block text-gray-800 font-semibold mb-3 text-lg">
                Team Size
              </label>
              <select
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="w-full p-4 rounded-xl border-2 border-gray-300 bg-gray-100/80 text-gray-700 focus:border-black focus:outline-none transition-all appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: `right 1rem center`,
                  backgroundRepeat: `no-repeat`,
                  backgroundSize: `1.5em 1.5em`,
                }}
              >
                <option value="" disabled>
                  Select one
                </option>
                <option value="2-5">2-5 people</option>
                <option value="6-10">6-10 people</option>
                <option value="11-25">11-25 people</option>
                <option value="26-50">26-50 people</option>
                <option value="50+">50+ people</option>
              </select>
            </div>

            <div className="flex-1 w-full max-w-[450px]">
              <label className="block text-gray-800 font-semibold mb-3 text-lg">
                Do you plan to build teams on Ultra Hustle?
              </label>
              <div className="flex gap-4">
                {["Yes", "No", "Maybe Later"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setBuildTeamPlan(option.toLowerCase())}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                      buildTeamPlan === option.toLowerCase()
                        ? "bg-[#CEFF1B] border-black text-black"
                        : "bg-white/50 border-gray-200 text-gray-500 hover:bg-white/80"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Desktop Footer (unchanged) */}
        <div className="hidden md:block mt-6 relative z-10 w-full max-w-[750px]">
          {selectedType !== "team" && <div className="h-14 mb-8"></div>}

          <div className="flex justify-between items-center">
            <button
              onClick={handleReset}
              className="px-8 py-3 rounded-lg border-2 border-black text-gray-600 font-medium text-lg hover:bg-gray-100 transition-all -ml-24"
            >
              Reset
            </button>

            <div className="flex gap-4">
              <button
                onClick={handleBack}
                className="px-10 py-3 rounded-lg border-2 border-black text-gray-700 font-medium text-lg hover:bg-gray-100 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleContinue}
                disabled={
                  !selectedType ||
                  (selectedType === "team" && (!teamSize || !buildTeamPlan))
                }
                className={`px-10 py-3 rounded-lg font-medium text-lg transition-all ${
                  selectedType &&
                  (selectedType !== "team" || (teamSize && buildTeamPlan))
                    ? "bg-[#CEFF1B] border-2 border-black text-black hover:bg-[#b8e617]"
                    : "bg-gray-200 border-2 border-gray-300 text-gray-400 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
