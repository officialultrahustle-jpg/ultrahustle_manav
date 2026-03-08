import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function SetupWorkspace() {
  const navigate = useNavigate();
  const currentStep = 6; // Step 7 visually (0-indexed is 6)
  const totalSteps = 8;
  const [activeStep, setActiveStep] = useState(0);

  // Auto-progress simulation logic (optional, but implied by "We're configuring...")
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/client-profile-setup');
    }, 10000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#E8E8E8]">
      {/* Top (Mobile) / Left (Desktop) - Character Image */}
      <div className="w-full md:w-[30%] relative overflow-hidden flex items-start md:items-center justify-center min-h-[45vh] md:min-h-screen z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8E8E8] via-[#E0E0E0] to-[#D8D8D8]"></div>
        <img
          src="/onboarding-character.png"
          alt="Ultra Hustle Character"
          className="relative z-10 h-full w-full object-cover object-top md:object-cover md:w-full md:h-full md:object-top"
        />
      </div>

      {/* Bottom (Mobile) / Right (Desktop) - Content */}
      <div className="w-full md:w-[70%] bg-[#E0E0E0] md:bg-gradient-to-br md:from-[#E8E8E8] md:via-[#E0E0E0] md:to-[#D8D8D8] rounded-t-[50px] md:rounded-none -mt-12 md:mt-0 p-6 md:p-12 flex flex-col justify-center items-center relative overflow-hidden min-h-[55vh] md:min-h-screen z-20">
        {/* Animated Gradient Glows */}
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
        <div className="bg-white/40 md:bg-white/40 backdrop-blur-xl rounded-[30px] shadow-xl p-8 md:p-16 w-full max-w-[500px] md:max-w-none md:w-[95%] md:h-[90%] relative z-10 border border-[#CEFF1B] md:border md:border-[#CEFF1B] flex flex-col justify-center items-center text-center">

          {/* Circle Arrow Icon */}
          <div className="mb-8 md:mb-20">
            <img
              src="/arrow-loader.png"
              alt="Loading"
              className="w-24 h-24 md:w-32 md:h-32 object-contain"
            />
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 md:mb-6">
            Let us set up your workspace
          </h1>

          <p className="text-lg md:text-2xl text-gray-600 md:text-gray-700 max-w-[300px] md:max-w-[600px] leading-relaxed mb-10 md:mb-16">
            We're configuring your dashboard, recommendations, and category preferences
          </p>

          {/* Step Indicators */}
          <div className="flex justify-center items-center gap-3">
            {[...Array(totalSteps)].map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${index === currentStep
                    ? 'bg-[#C3FF00]'
                    : 'bg-gray-500 md:bg-gray-600 hover:bg-gray-400'
                  }`}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
