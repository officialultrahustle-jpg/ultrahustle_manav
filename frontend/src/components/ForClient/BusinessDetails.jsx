import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BusinessDetails() {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    businessName: '',
    employees: '',
    industry: '',
    otherIndustry: '',
    website: '',
    taxId: '',
    country: '',
    state: '',
    city: ''
  });

  const [isPersonalAccount, setIsPersonalAccount] = useState(false);

  const currentStep = 5; // Step 5 (0-indexed was 4 previously)
  const totalSteps = 8;

  const industries = [
    'Technology',
    'Marketing',
    'Design',
    'E-commerce',
    'Education',
    'Healthcare',
    'Real Estate',
    'Entertainment',
    'Finance',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Numeric validation for employees
    if (name === 'employees' && value && !/^\d*$/.test(value)) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBack = () => {
    navigate('/client-needs');
  };

  const handleContinue = () => {
    // Navigate to next step
    if (isFormValid()) {
      navigate('/setup-workspace');
    }
  };

  const handleReset = () => {
    setFormData({
      businessName: '',
      employees: '',
      industry: '',
      otherIndustry: '',
      website: '',
      taxId: '',
      country: '',
      state: '',
      city: ''
    });
    setIsPersonalAccount(false);
  };

  // Validation: 
  // If personal: always valid.
  // If business: Name, Employees, Industry, Country, State, City required? 
  // Images show "Optional" on Website and GST. Implies others are required.
  const isFormValid = () => {
    if (isPersonalAccount) return true;
    return (
      formData.businessName.trim() !== '' &&
      formData.employees.trim() !== '' &&
      formData.industry.trim() !== '' &&
      (formData.industry !== 'Other' || formData.otherIndustry.trim() !== '') &&
      formData.country.trim() !== '' &&
      formData.state.trim() !== '' &&
      formData.city.trim() !== ''
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Top Section on Mobile / Left Side on Desktop - Acid Green Panel */}
      <div className="w-full md:w-[30%] relative overflow-hidden bg-[#CEFF1B] min-h-[30vh] md:min-h-screen">
        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10">
          {/* Back Button - Mobile Only */}
          <button
            onClick={handleBack}
            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center mb-4 relative"
            style={{
              background: 'linear-gradient(180deg, #FFFFFF, #9C9C9C)',
              padding: '2px',
            }}
          >
            <span
              className="w-full h-full rounded-full flex items-center justify-center bg-[#CEFF1B]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </span>
          </button>

          {/* Title */}
          <div className="flex-1 flex flex-col justify-center md:justify-start md:pt-32 items-center md:items-start text-center md:text-left px-4 md:px-0">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-1 leading-tight">
              Organization &
            </h2>
            <h2 className="text-4xl md:text-4xl font-bold text-black mb-4 leading-tight">
              Business Details
            </h2>
            <h2 className="hidden md:block text-black text-3xl font-bold">
              (Optional)
            </h2>
          </div>

          {/* Step Indicators - Desktop Only */}
          <div className="hidden md:flex items-center gap-3 ml-12">
            {[...Array(totalSteps)].map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentStep
                  ? 'bg-black w-4 h-4'
                  : 'bg-white'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section on Mobile / Right Side on Desktop - Content */}
      <div className="w-full md:w-[70%] bg-[#E0E0E0] md:bg-gradient-to-br md:from-[#E8E8E8] md:via-[#E0E0E0] md:to-[#D8D8D8] rounded-t-[50px] md:rounded-none -mt-12 md:mt-0 px-3 py-6 md:p-12 flex flex-col justify-start md:pt-32 items-center relative overflow-hidden min-h-[60vh] md:min-h-screen z-20">
        {/* Animated Gradient Glows - Desktop Only -> Now Mobile too */}
        <div
          className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full pointer-events-none z-0"
          style={{
            background: 'radial-gradient(circle, rgba(195, 255, 0, 0.4) 0%, rgba(195, 255, 0, 0.15) 40%, transparent 70%)',
            bottom: '-15%',
            left: '-15%',
            filter: 'blur(60px)',
            animation: 'glow-bottomleft-center-right 8s ease-in-out infinite',
          }}
        ></div>
        <div
          className="absolute w-[250px] h-[250px] md:w-[400px] md:h-[400px] rounded-full pointer-events-none z-0"
          style={{
            background: 'radial-gradient(circle, rgba(195, 255, 0, 0.35) 0%, rgba(195, 255, 0, 0.1) 40%, transparent 70%)',
            top: '-10%',
            right: '-10%',
            filter: 'blur(50px)',
            animation: 'glow-center-topright 8s ease-in-out infinite',
          }}
        ></div>

        {/* Main Content Area */}
        <div className="relative z-10 w-full max-w-[1200px]">
          {/* Main Card */}
          <div className={`bg-white/40 md:bg-white/40 backdrop-blur-md border border-[#CEFF1B] md:border md:border-[#CEFF1B] rounded-[24px] md:rounded-[30px] p-4 md:p-8 shadow-xl mb-6 md:mb-8 flex flex-col transition-all duration-300`}>

            {isPersonalAccount ? (
              /* Personal Account View */
              <div className="text-center animate-fade-in-up w-full py-10 md:py-0">
                <h3 className="text-xl md:text-2xl font-bold text-gray-700">No business details required</h3>
              </div>
            ) : (
              /* Business Details Form */
              <div className="w-full grid grid-cols-2 gap-3 md:gap-x-8 md:gap-y-6 animate-fade-in-up">
                {/* Business Name */}
                <div>
                  <label className="block text-gray-800 font-bold mb-1 md:mb-2 text-sm md:text-base">Business / Brand Name</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Type here"
                    className="w-full p-2.5 md:p-3 rounded-lg md:rounded-xl border border-[#2B2B2B] bg-[#F0F0F0]/50 md:bg-transparent text-gray-800 focus:border-black focus:outline-none transition-all text-base md:text-base font-medium"
                  />
                </div>

                {/* Number of Employees */}
                <div>
                  <label className="block text-gray-800 font-bold mb-1 md:mb-2 text-sm md:text-base">Number of Employees</label>
                  <input
                    type="text"
                    name="employees"
                    value={formData.employees}
                    onChange={handleInputChange}
                    placeholder="Type here (only numeric)"
                    className="w-full p-2.5 md:p-3 rounded-lg md:rounded-xl border border-[#2B2B2B] bg-[#F0F0F0]/50 md:bg-transparent text-gray-800 focus:border-black focus:outline-none transition-all text-base md:text-base font-medium"
                  />
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-gray-800 font-bold mb-1 md:mb-2 text-sm md:text-base">Industry</label>
                  <div className="relative">
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="w-full p-2.5 md:p-3 rounded-lg md:rounded-xl border border-[#2B2B2B] bg-[#F0F0F0]/50 md:bg-transparent text-gray-800 focus:border-black focus:outline-none transition-all appearance-none cursor-pointer text-base md:text-base font-medium"
                    >
                      <option value="" disabled>Type here</option>
                      {industries.map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                {/* Other Industry - shows when Other is selected */}
                {formData.industry === 'Other' ? (
                  <div>
                    <label className="block text-gray-800 font-bold mb-1 md:mb-2 text-sm md:text-base">Industry</label>
                    <input
                      type="text"
                      name="otherIndustry"
                      value={formData.otherIndustry}
                      onChange={handleInputChange}
                      placeholder="Type your industry"
                      className="w-full p-2.5 md:p-3 rounded-lg md:rounded-xl border border-[#2B2B2B] bg-[#F0F0F0]/50 md:bg-transparent text-gray-800 focus:border-black focus:outline-none transition-all text-base md:text-base font-medium"
                    />
                  </div>
                ) : (
                  /* Website - shows when Other is NOT selected */
                  <div>
                    <label className="block text-gray-800 font-bold mb-1 md:mb-2 text-sm md:text-base">Website (optional)</label>
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="Type here"
                      className="w-full p-2.5 md:p-3 rounded-lg md:rounded-xl border border-[#2B2B2B] bg-[#F0F0F0]/50 md:bg-transparent text-gray-800 focus:border-black focus:outline-none transition-all text-base md:text-base font-medium"
                    />
                  </div>
                )}

                {/* Website - always shows */}
                {formData.industry === 'Other' && (
                  <div>
                    <label className="block text-gray-800 font-bold mb-1 md:mb-2 text-sm md:text-base">Website (optional)</label>
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="Type here"
                      className="w-full p-2.5 md:p-3 rounded-lg md:rounded-xl border border-[#2B2B2B] bg-[#F0F0F0]/50 md:bg-transparent text-gray-800 focus:border-black focus:outline-none transition-all text-base md:text-base font-medium"
                    />
                  </div>
                )}

                {/* GST */}
                <div>
                  <label className="block text-gray-800 font-bold mb-1 md:mb-2 text-sm md:text-base">GST / VAT / Tax ID (optional)</label>
                  <input
                    type="text"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleInputChange}
                    placeholder="Type here"
                    className="w-full p-2.5 md:p-3 rounded-lg md:rounded-xl border border-[#2B2B2B] bg-[#F0F0F0]/50 md:bg-transparent text-gray-800 focus:border-black focus:outline-none transition-all text-base md:text-base font-medium"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-gray-800 font-bold mb-1 md:mb-2 text-sm md:text-base">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Type here"
                    className="w-full p-2.5 md:p-3 rounded-lg md:rounded-xl border border-[#2B2B2B] bg-[#F0F0F0]/50 md:bg-transparent text-gray-800 focus:border-black focus:outline-none transition-all text-base md:text-base font-medium"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-gray-800 font-bold mb-1 md:mb-2 text-sm md:text-base">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Type here"
                    className="w-full p-2.5 md:p-3 rounded-lg md:rounded-xl border border-[#2B2B2B] bg-[#F0F0F0]/50 md:bg-transparent text-gray-800 focus:border-black focus:outline-none transition-all text-base md:text-base font-medium"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-gray-800 font-bold mb-1 md:mb-2 text-sm md:text-base">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Type here"
                    className="w-full p-2.5 md:p-3 rounded-lg md:rounded-xl border border-[#2B2B2B] bg-[#F0F0F0]/50 md:bg-transparent text-gray-800 focus:border-black focus:outline-none transition-all text-base md:text-base font-medium"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Toggle - outside container */}
          <div className="flex items-center gap-3 md:gap-4 mb-6">
            <button
              onClick={() => setIsPersonalAccount(!isPersonalAccount)}
              className={`w-12 h-6 md:w-16 md:h-8 rounded-full p-0.5 md:p-1 transition-all duration-300 border ${isPersonalAccount
                ? 'bg-black border-black'
                : 'bg-white border-[#2B2B2B]'
                }`}
            >
              <div className={`w-5 h-5 md:w-6 md:h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isPersonalAccount ? 'translate-x-6 md:translate-x-8' : 'translate-x-0 bg-[#F0F0F0]'
                }`} >
                {!isPersonalAccount && <div className="w-full h-full bg-[#2B2B2B] rounded-full" />}
              </div>
            </button>
            <span className="text-sm md:text-xl text-gray-600 font-medium">This is a personal account</span>
          </div>

          <div className="flex justify-between items-center w-full gap-4">
            <button
              onClick={handleReset}
              className="px-4 py-2 md:px-8 md:py-3 rounded-md md:rounded-lg border border-[#2B2B2B] text-gray-600 font-medium text-lg md:text-lg hover:bg-gray-100 transition-all"
            >
              Reset
            </button>

            <div className="flex gap-2 md:gap-4">
              <button
                onClick={handleBack}
                className="px-4 py-2 md:px-10 md:py-3 rounded-md md:rounded-lg border border-[#2B2B2B] text-gray-700 font-medium text-lg md:text-lg hover:bg-gray-100 transition-all"
              >
                Discard
              </button>
              <button
                onClick={handleContinue}
                disabled={!isFormValid()}
                className={`px-4 py-2 md:px-10 md:py-3 rounded-md md:rounded-lg font-medium text-lg md:text-lg transition-all whitespace-nowrap ${isFormValid()
                  ? 'bg-[#CEFF1B] border border-black text-black hover:bg-[#b8e617]'
                  : 'bg-[#CEFF1B]/50 border border-[#2B2B2B] text-gray-400 cursor-not-allowed'
                  }`}
              >
                Continue
              </button>
            </div>
          </div>

          {/* Step Indicators - Mobile */}
          <div className="flex justify-center items-center gap-2 mt-8 md:hidden">
            {[...Array(totalSteps)].map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentStep
                  ? 'bg-[#C3FF00] w-2.5 h-2.5 shadow-md shadow-[#C3FF00]/40'
                  : 'bg-black/60'
                  }`}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
