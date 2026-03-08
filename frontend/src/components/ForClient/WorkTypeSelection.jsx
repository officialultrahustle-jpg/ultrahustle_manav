import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function WorkTypeSelection() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [teamSize, setTeamSize] = useState("");
  const [buildTeamPlan, setBuildTeamPlan] = useState(null); // 'yes', 'no', 'maybe later'

  const currentStep = 2;
  const totalSteps = 8;

  const handleBack = () => navigate("/role-selection");

  const canContinue =
    !!selectedType &&
    (selectedType !== "team" || (teamSize && buildTeamPlan));

  const handleContinue = () => {
    if (canContinue) navigate("/goals-selection");
  };

  const handleReset = () => {
    setSelectedType(null);
    setTeamSize("");
    setBuildTeamPlan(null);
  };

  const WorkCard = ({ value, title, points }) => {
    const active = selectedType === value;

    return (
      <button
        type="button"
        onClick={() => setSelectedType(value)}
        className={[
          "flex-1 text-left rounded-2xl p-4 transition-all",
          "border bg-white",
          active ? "border-black shadow-md" : "border-[#CEFF1B] shadow-sm",
        ].join(" ")}
      >
        <span className="inline-flex items-center px-3 py-1 rounded-md text-[11px] font-medium border border-black/70 bg-white">
          {title}
        </span>

        <ul className="mt-3 space-y-2 text-[12px] leading-4 text-black/70">
          {points.map((t, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-[2px]">•</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </button>
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Top Section on Mobile / Left Side on Desktop - Acid Green Panel */}
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

          {/* Question */}
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

      {/* Bottom Section on Mobile / Right Side on Desktop - Content */}
      <div className="w-full md:w-[70%] bg-[#E0E0E0] md:bg-gradient-to-br md:from-[#E8E8E8] md:via-[#E0E0E0] md:to-[#D8D8D8] rounded-t-[50px] md:rounded-none -mt-12 md:mt-0 p-6 pt-8 md:p-12 flex flex-col justify-start md:justify-center items-center relative overflow-hidden min-h-[60vh] md:min-h-screen z-20">
        {/* Animated Gradient Glows - Desktop Only */}
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

        {/* ✅ MOBILE (fixed, screenshot-like) */}
        <div className="md:hidden w-full max-w-[420px] relative z-10">
          <div className="flex gap-3">
            <WorkCard
              value="solo"
              title="Solo Creator / Solo Professional"
              points={["I work individually", "I manage my own tasks and deliveries"]}
            />
            <WorkCard
              value="team"
              title="Team / Organization"
              points={["We have a team", "Multiple people handle projects"]}
            />
          </div>

          {selectedType === "team" && (
            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-center text-sm font-semibold text-black/80 mb-2">
                  Team Size
                </label>
                <select
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  className="w-full h-11 rounded-xl border border-black/20 bg-white px-4 text-sm text-black/70 focus:outline-none focus:border-black"
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

              <div>
                <label className="block text-center text-sm font-semibold text-black/80 mb-2">
                  Do you plan to build teams on Ultra Hustle?
                </label>

                <div className="flex gap-2">
                  {["Yes", "No", "Maybe Later"].map((label) => {
                    const value = label.toLowerCase();
                    const active = buildTeamPlan === value;

                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setBuildTeamPlan(value)}
                        className={[
                          "flex-1 h-10 rounded-xl border text-xs font-medium transition-all",
                          active
                            ? "bg-[#CEFF1B] border-black text-black"
                            : "bg-white border-black/20 text-black/60",
                        ].join(" ")}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between gap-3">
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
              disabled={!canContinue}
              className={[
                "h-10 px-6 rounded-lg text-sm font-medium border transition-all",
                canContinue
                  ? "bg-[#CEFF1B] border-black text-black"
                  : "bg-[#DADADA] border-black/20 text-black/30",
              ].join(" ")}
            >
              Continue
            </button>
          </div>

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
                    : "border-gray-400 bg-white"
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
                    : "border-gray-400 bg-white"
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

        {/* Extra Options for Team Selection - Desktop */}
        {selectedType === "team" && (
          <div className="hidden md:flex mt-8 flex-col md:flex-row gap-8 justify-between items-start w-full px-4 relative z-10 animate-fade-in-up">
            <div className="flex-1 w-full max-w-[450px]">
              <label className="block text-gray-800 font-semibold mb-3 text-lg">
                Team Size
              </label>
              <select
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="w-full p-4 rounded-xl border border-[#2B2B2B] bg-transparent text-gray-700 focus:border-black focus:outline-none transition-all appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 11 9'%3E%3Cpath d='M5.19629 9L0 0L10.3924 0L5.19629 9Z' fill='%232B2B2B'/%3E%3C/svg%3E")`,
                  backgroundPosition: `right 1rem center`,
                  backgroundRepeat: `no-repeat`,
                  backgroundSize: `1em 1em`,
                }}
              >
                <option value="" disabled>
                  Other
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
                    type="button"
                    onClick={() => setBuildTeamPlan(option.toLowerCase())}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                      buildTeamPlan === option.toLowerCase()
                        ? "bg-[#CEFF1B] border-black text-black"
                        : "bg-white/50 border-[#2B2B2B] text-[#2B2B2B] hover:bg-white/80"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Desktop Footer */}
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
                className="px-10 py-3 rounded-lg border-2 border-black text-[#2B2B2B] font-medium text-lg hover:bg-gray-100 transition-all"
              >
                Discard
              </button>

              <button
                onClick={handleContinue}
                disabled={!canContinue}
                className={`px-10 py-3 rounded-lg font-medium text-lg transition-all ${
                  canContinue
                    ? "bg-[#CEFF1B] border-2 border-black text-black hover:bg-[#b8e617]"
                    : "bg-[#CEFF1B]/50 border border-[#2B2B2B] text-[#2B2B2B] cursor-not-allowed"
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
