import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreatorOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 8;

  const handleGetStarted = () => {
    navigate('/creator-role-selection');
  };

  const handleSkip = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Character Image - Top on mobile, Left side on desktop */}
      <div className="w-full md:w-[30%] relative overflow-hidden flex items-center justify-center h-[50vh] md:h-auto">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8E8E8] via-[#E0E0E0] to-[#D8D8D8]"></div>
        <img
          src="/onboarding-character.png"
          alt="Ultra Hustle Character"
          className="relative z-10 w-full h-full object-cover object-top"
        />
      </div>

      {/* Welcome Content - Bottom on mobile with curved overlap, Right side on desktop */}
      <div className="w-full md:w-[70%] bg-[#E0E0E0] md:bg-gradient-to-br md:from-[#E8E8E8] md:via-[#E0E0E0] md:to-[#D8D8D8] rounded-t-[50px] md:rounded-none -mt-16 md:mt-0 p-6 pt-8 md:p-12 flex flex-col justify-center items-center relative overflow-hidden min-h-[60vh] md:min-h-screen z-20">
        {/* Animated Gradient Glow - Bottom Left */}
        <div
          className="hidden md:block absolute w-[500px] h-[500px] rounded-full pointer-events-none z-0"
          style={{
            background: 'radial-gradient(circle, rgba(195, 255, 0, 0.4) 0%, rgba(195, 255, 0, 0.15) 40%, transparent 70%)',
            bottom: '-15%',
            left: '-15%',
            filter: 'blur(60px)',
            animation: 'glow-bottomleft-center-right 8s ease-in-out infinite',
          }}
        ></div>

        {/* Animated Gradient Glow - Top Right */}
        <div
          className="hidden md:block absolute w-[400px] h-[400px] rounded-full pointer-events-none z-0"
          style={{
            background: 'radial-gradient(circle, rgba(195, 255, 0, 0.35) 0%, rgba(195, 255, 0, 0.1) 40%, transparent 70%)',
            top: '-10%',
            right: '-10%',
            filter: 'blur(50px)',
            animation: 'glow-center-topright 8s ease-in-out infinite',
          }}
        ></div>

        {/* Animated Gradient Glow - Center */}
        <div
          className="hidden md:block absolute w-[350px] h-[350px] rounded-full pointer-events-none z-0"
          style={{
            background: 'radial-gradient(circle, rgba(195, 255, 0, 0.3) 0%, rgba(195, 255, 0, 0.1) 40%, transparent 70%)',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(50px)',
            animation: 'glow-rotate 6s steps(3) infinite',
          }}
        ></div>

        {/* Content Card Container */}
        <div className="bg-white/40 md:bg-white/40 backdrop-blur-xl rounded-[24px] md:rounded-[30px] shadow-xl p-8 md:p-16 w-[90%] md:w-[95%] h-auto md:h-[90%] max-w-none relative z-10 border border-[#CEFF1B] md:border md:border-[#CEFF1B] flex flex-col justify-center items-stretch">
          {/* Top Content */}
          <div className="text-center max-w-[600px] mx-auto mt-2 md:mt-8">
            <h2 className="text-2xl md:text-5xl font-bold font-roboto text-gray-800 mb-2 md:mb-4">Welcome To</h2>
            <div className="mb-1 md:mb-4">
              <img
                src="/logo.png"
                alt="Ultra Hustle"
                className="h-16 md:h-24 mx-auto object-contain "
              />
            </div>
          </div>

          {/* Divider */}
          <div className="w-full flex-shrink-0 self-stretch" style={{ height: '2px', backgroundColor: '#000000', marginTop: '12px', marginBottom: '24px' }}></div>

          {/* Bottom Content */}
          <div className="text-center max-w-[600px] mx-auto">
            <p className="text-gray-800 text-sm md:text-2xl mb-6 md:mb-14">Let's personalize your workspace.</p>

            <div className="flex flex-row gap-2 md:gap-6 justify-center mb-6 md:mb-14">
              <button
                onClick={handleGetStarted}
                className="px-5 md:px-12 py-2.5 md:py-4 rounded-lg md:rounded-xl bg-[#CEFF1B] border border-black md:border-2 text-black font-medium md:font-semibold text-sm md:text-2xl hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_#CEFF1B]"
              >
                Get Started
              </button>

            </div>

            {/* Step Indicators */}
            <div className="flex justify-center items-center gap-2 md:gap-3.5">
              {[...Array(totalSteps)].map((_, index) => (
                <div
                  key={index}
                  className={`w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full transition-all duration-300 ${index === currentStep
                      ? 'bg-[#C3FF00] w-3.5 h-3.5 md:w-5 md:h-5 shadow-md shadow-[#C3FF00]/40'
                      : 'bg-[#5C5C5C] hover:bg-gray-400'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
