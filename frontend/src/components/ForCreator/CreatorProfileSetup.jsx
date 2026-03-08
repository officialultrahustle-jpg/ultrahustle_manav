import React from "react";
import { useNavigate } from "react-router-dom";

export default function CreatorProfileSetup() {
  const navigate = useNavigate();
  const currentStep = 6;
  const totalSteps = 8;

  const handleGetStarted = () => {
    // navigate('/creator-dashboard');
    console.log("Navigate to creator dashboard/profile setup");
  };

  const handleSkip = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#E8E8E8]">
      {/* Top (Mobile) / Left (Desktop) - Character Image */}
      <div className="w-full md:w-[30%] relative overflow-hidden flex items-center justify-center min-h-[45vh] md:min-h-screen z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8E8E8] via-[#E0E0E0] to-[#D8D8D8]" />
        <img
          src="/onboarding-character.png"
          alt="Ultra Hustle Character"
          className="relative z-10 h-[90%] w-auto object-contain md:object-cover md:w-full md:h-full md:object-top mt-4 md:mt-0"
        />
      </div>

      {/* Bottom (Mobile) / Right (Desktop) - Content */}
      <div className="w-full md:w-[70%] bg-[#E0E0E0] md:bg-gradient-to-br md:from-[#E8E8E8] md:via-[#E0E0E0] md:to-[#D8D8D8] rounded-t-[50px] md:rounded-none -mt-12 md:mt-0 p-6 md:p-12 flex flex-col justify-center items-center relative overflow-hidden min-h-[55vh] md:min-h-screen z-20">
        {/* Animated Gradient Glows - Desktop only */}
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
          <div className="bg-[#E9E9E9] rounded-[26px] px-3 py-4 border border-black/10 shadow-sm">
            <div className="bg-white rounded-[22px] border border-black/10 p-6 text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-3">
                You're all set!
              </h1>

              <p className="text-sm text-gray-600 leading-relaxed mb-5">
                Complete your profile to boost visibility and match accuracy
              </p>

              <div className="w-full h-px bg-black/70 mb-5" />

              <p className="text-sm font-medium text-gray-800 mb-6">
                Let's create your profile
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleGetStarted}
                  className="flex-1 h-10 rounded-lg bg-[#CEFF1B] border border-black text-black font-semibold text-sm"
                >
                  Get Started
                </button>
                <button
                  onClick={handleSkip}
                  className="flex-1 h-10 rounded-lg bg-white border border-black/30 text-black font-semibold text-sm"
                >
                  Skip
                </button>
              </div>
            </div>

            {/* black dots like other screens */}
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
        <div className="hidden md:flex bg-white/40 md:bg-white/40 backdrop-blur-xl rounded-[30px] shadow-xl p-6 md:p-16 w-full max-w-[500px] md:max-w-none md:w-[95%] md:h-[90%] relative z-10 border-[#CEFF1B] md:border md:border-[#CEFF1B] flex-col justify-center items-center text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 md:mb-6">
            You're all set!
          </h1>

          <p className="text-lg md:text-2xl text-gray-600 md:text-gray-700 max-w-[300px] md:max-w-[600px] leading-relaxed mb-6 md:mb-8">
            Complete your profile to boost visibility and match accuracy
          </p>

          <div className="w-full h-px bg-black md:bg-black mb-6 md:mb-8 max-w-[600px]" />

          <p className="text-lg md:text-xl font-medium text-gray-800 mb-6 md:mb-8">
            Let's create your profile
          </p>

          <div className="flex gap-3 md:gap-4 mb-10 md:mb-20 w-full justify-center">
            <button
              onClick={handleGetStarted}
              className="px-6 py-3 md:px-12 md:py-4 rounded-lg md:rounded-xl bg-[#CEFF1B] border border-black text-black font-semibold text-sm md:text-xl hover:bg-white hover:text-gray-900 transition-all shadow-sm hover:shadow-[0_0_15px_#CEFF1B] flex-1 md:flex-none whitespace-nowrap"
            >
              Get Started
            </button>
            <button
              onClick={handleSkip}
              className="px-6 py-3 md:px-12 md:py-4 rounded-lg md:rounded-xl bg-[#CEFF1B] border border-gray-900 text-gray-900 font-semibold text-sm md:text-xl hover:bg-white hover:border-black transition-all hover:shadow-[0_0_15px_#CEFF1B] flex-1 md:flex-none whitespace-nowrap"
            >
              Skip for now
            </button>
          </div>

          {/* Step Indicators (desktop) */}
          <div className="flex justify-center items-center gap-3">
            {[...Array(totalSteps)].map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? "bg-[#C3FF00]"
                    : "bg-gray-500 md:bg-gray-600 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
