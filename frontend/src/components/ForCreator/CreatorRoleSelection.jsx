import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatorRoleSelection() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const currentStep = 1;
  const totalSteps = 8;

  const handleBack = () => navigate(-1);

  const handleContinue = () => {
    if (selectedRole) navigate("/creator-work-type-selection");
  };

  const handleReset = () => setSelectedRole(null);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#E0E0E0] md:bg-transparent overflow-x-hidden">
      {/* Top Section */}
      <div className="w-full md:w-[30%] relative overflow-hidden bg-[#CEFF1B] min-h-[42vh] md:min-h-screen">
        <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 md:p-10">
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

          {/* Question */}
          <div className="flex-1 flex flex-col justify-center md:justify-start md:pt-32 items-center md:items-start text-center md:text-left px-2 sm:px-4 md:px-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">
              How will you be using Ultra Hustle?
            </h2>
            <p className="text-black/60 text-sm sm:text-base md:text-xl mt-2 sm:mt-3 md:mt-6">
              This helps us tailor your dashboard
            </p>
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

      {/* Bottom Section */}
      <div className="w-full md:w-[70%] bg-[#E0E0E0] md:bg-gradient-to-br md:from-[#E8E8E8] md:via-[#E0E0E0] md:to-[#D8D8D8] rounded-t-[50px] md:rounded-none -mt-12 md:mt-0 p-6 pt-8 md:p-12 flex flex-col justify-center items-center relative overflow-hidden min-h-[60vh] md:min-h-screen z-20">
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

        {/* ✅ MOBILE (same screenshot-style) */}
        <div className="md:hidden w-full max-w-[420px] relative z-10">
          <div className="bg-[#E9E9E9] rounded-[26px] px-3 py-4 border border-black/10 shadow-sm">
            {/* cards row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Creator */}
              <button
                type="button"
                onClick={() => setSelectedRole("creator")}
                className={[
                  "text-left rounded-2xl p-4 transition-all border bg-white",
                  selectedRole === "creator"
                    ? "border-black shadow-sm"
                    : "border-[#CEFF1B]",
                ].join(" ")}
              >
                <span
                  className={[
                    "inline-flex items-center px-3 py-1 rounded-md text-xs font-medium border",
                    selectedRole === "creator"
                      ? "border-black bg-white"
                      : "border-black/40 bg-white",
                  ].join(" ")}
                >
                  Creator
                </span>

                <ul className="mt-3 space-y-2 text-[12px] leading-4 text-black/70">
                  <li className="flex gap-2">
                    <span className="mt-[2px]">•</span>
                    <span>I want to offer services and sell digital products</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[2px]">•</span>
                    <span>I want to run webinars and courses</span>
                  </li>
                </ul>
              </button>

              {/* Client */}
              <button
                type="button"
                onClick={() => setSelectedRole("client")}
                className={[
                  "text-left rounded-2xl p-4 transition-all border bg-white",
                  selectedRole === "client"
                    ? "border-black shadow-sm"
                    : "border-[#CEFF1B]",
                ].join(" ")}
              >
                <span
                  className={[
                    "inline-flex items-center px-3 py-1 rounded-md text-xs font-medium border",
                    selectedRole === "client"
                      ? "border-black bg-white"
                      : "border-black/40 bg-white",
                  ].join(" ")}
                >
                  Client
                </span>

                <ul className="mt-3 space-y-2 text-[12px] leading-4 text-black/70">
                  <li className="flex gap-2">
                    <span className="mt-[2px]">•</span>
                    <span>I want to hire creators and purchase products/courses</span>
                  </li>
                </ul>
              </button>
            </div>

            <p className="text-center text-black/60 text-sm mt-4">
              You can switch or use both roles anytime
            </p>

            {/* buttons row */}
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
                disabled={!selectedRole}
                className={[
                  "h-10 px-6 rounded-lg text-sm font-medium border",
                  selectedRole
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

        {/* ✅ DESKTOP (keep your code same) */}
               <div className="hidden md:flex flex-col md:flex-row gap-6 justify-between items-stretch relative z-10 w-full px-4">
          <div
            onClick={() => setSelectedRole("creator")}
            className={`flex-1 max-w-[450px] min-h-[200px] p-8 rounded-2xl cursor-pointer transition-all duration-300 backdrop-blur-sm ${
              selectedRole === "creator"
                ? "bg-[#CEFF1B] border-2 border-black shadow-lg"
                : "bg-white/40 border border-[#CEFF1B] hover:bg-white/20"
            }`}
          >
            <div className="mb-4">
              <span
                className={`inline-block px-5 py-2 rounded-lg border-2 font-semibold text-lg ${
                  selectedRole === "creator"
                    ? "border-black bg-[#C3FF00]/10"
                    : "border-gray-400 bg-white"
                }`}
              >
                Creator
              </span>
            </div>
            <ul className="text-gray-700 text-base space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-gray-500">•</span>
                <span>I want to offer services and sell digital products</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-500">•</span>
                <span>I want to run webinars and courses</span>
              </li>
            </ul>
          </div>

          <div
            onClick={() => setSelectedRole("client")}
            className={`flex-1 max-w-[450px] min-h-[200px] p-8 rounded-2xl cursor-pointer transition-all duration-300 backdrop-blur-sm ${
              selectedRole === "client"
                ? "bg-[#CEFF1B] border-2 border-black shadow-lg"
                : "bg-white/40 border border-[#CEFF1B] hover:bg-white/20"
            }`}
          >
            <div className="mb-4">
              <span
                className={`inline-block px-5 py-2 rounded-lg border-2 font-semibold text-lg ${
                  selectedRole === "client"
                    ? "border-black bg-[#C3FF00]/10"
                    : "border-gray-400 bg-white"
                }`}
              >
                Client
              </span>
            </div>
            <ul className="text-gray-700 text-base space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-gray-500">•</span>
                <span>I want to hire creators and purchase products/courses</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="hidden md:block mt-6 relative z-10 w-full max-w-[750px]">
          <p className="text-left text-gray-600 text-lg mb-8 -ml-24">
            You can switch or use both roles anytime.
          </p>

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
                className="px-10 py-3 rounded-lg border border-black text-black font-medium text-lg hover:bg-gray-100 transition-all"
              >
                Discard
              </button>
              <button
                onClick={handleContinue}
                disabled={!selectedRole}
                className={`px-10 py-3 rounded-lg font-medium text-lg transition-all ${
                  selectedRole
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
