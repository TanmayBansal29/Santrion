import React, { useState } from 'react';
import { User, Calendar, Truck, Heart, Eye, EyeOff } from 'lucide-react';

// Reusable Form Input Component
const FormInput = ({ label, type = "text", name, value, onChange, placeholder, className = "" }) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-600 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-700"
        placeholder={placeholder}
        maxLength={type === "text" && (name === "date" || name === "month") ? "2" : name === "year" ? "4" : undefined}
      />
    </div>
  );
};

// Reusable Form Select Component
const FormSelect = ({ label, name, value, onChange, options = [], placeholder }) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-600 mb-2">
          {label}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-700"
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Main SignUpForm2 Component (Step 2)
const SignUpForm2 = () => {
  const [formData, setFormData] = useState({
    streetAddress: '',
    countryName: '',
    stateName: '',
    cityName: '',
    gender: '',
    bloodGroup: '',
    date: '',
    month: '',
    year: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Account created successfully! (Demo)');
    }, 1500);
  };

  const handleBack = () => {
    alert('Going back to previous step (Demo)');
  };

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  const bloodGroupOptions = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left Panel - Features */}
      <div className="w-1/2 bg-gradient-to-br from-purple-400 via-purple-400 to-purple-500 p-16 flex flex-col justify-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-16 w-40 h-40 bg-white rounded-full blur-sm"></div>
          <div className="absolute bottom-40 right-20 w-32 h-32 bg-white rounded-full blur-sm"></div>
          <div className="absolute top-1/2 right-40 w-20 h-20 bg-white rounded-full blur-sm"></div>
        </div>
        
        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-black text-white mb-6 leading-tight tracking-wide">
            A SMARTER WAY TO<br />
            STAY HEALTHY
          </h1>
          <p className="text-white text-xl mb-16 italic font-light">
            Your All In One Healthcare Companion
          </p>

          <div className="space-y-10">
            {/* 24/7 AI Support */}
            <div className="flex items-start space-x-5">
              <div className="flex-shrink-0 w-16 h-16 bg-white bg-opacity-25 rounded-xl flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl mb-2">
                  24/7 AI-Powered Support
                </h3>
                <p className="text-white text-sm leading-relaxed opacity-90">
                  Get instant answers and help with symptoms,<br />
                  prescriptions, and more anytime.
                </p>
              </div>
            </div>

            {/* Book Appointments */}
            <div className="flex items-start space-x-5">
              <div className="flex-shrink-0 w-16 h-16 bg-white bg-opacity-25 rounded-xl flex items-center justify-center">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl mb-2">
                  Book Appointments in Seconds
                </h3>
                <p className="text-white text-sm leading-relaxed opacity-90">
                  Connect with top doctors, mental health specialists<br />
                  and fitness experts - all in one place.
                </p>
              </div>
            </div>

            {/* Medicines */}
            <div className="flex items-start space-x-5">
              <div className="flex-shrink-0 w-16 h-16 bg-white bg-opacity-25 rounded-xl flex items-center justify-center">
                <Truck className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl mb-2">
                  Medicines at your doorstep
                </h3>
                <p className="text-white text-sm leading-relaxed opacity-90">
                  Fast, reliable doorstep delivery of your prescribed<br />
                  medicines and health essentials.
                </p>
              </div>
            </div>

            {/* Wellness */}
            <div className="flex items-start space-x-5">
              <div className="flex-shrink-0 w-16 h-16 bg-white bg-opacity-25 rounded-xl flex items-center justify-center">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl mb-2">
                  Your Wellness, Inside and Out
                </h3>
                <p className="text-white text-sm leading-relaxed opacity-90">
                  Comprehensive care for your body and mind with<br />
                  fitness tracking, therapy, and consultations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              CREATE ACCOUNT
            </h2>
          </div>

          {/* Signup Form */}
          <div className="space-y-4">
            {/* Address Fields */}
            <FormInput
              label="Street Address"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleInputChange}
              placeholder=""
            />

            <FormInput
              label="Country Name"
              name="countryName"
              value={formData.countryName}
              onChange={handleInputChange}
              placeholder=""
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="State Name"
                name="stateName"
                value={formData.stateName}
                onChange={handleInputChange}
                placeholder=""
              />
              <FormInput
                label="City Name"
                name="cityName"
                value={formData.cityName}
                onChange={handleInputChange}
                placeholder=""
              />
            </div>

            {/* Gender and Blood Group */}
            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                options={genderOptions}
                placeholder="Select Gender"
              />
              <FormSelect
                label="Blood Group"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleInputChange}
                options={bloodGroupOptions}
                placeholder="Select Blood Group"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Date of Birth</label>
              <div className="grid grid-cols-3 gap-4">
                <FormInput
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  placeholder="Date"
                />
                <FormInput
                  name="month"
                  value={formData.month}
                  onChange={handleInputChange}
                  placeholder="Month"
                />
                <FormInput
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="Year"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleBack}
                className="flex-1 py-4 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors duration-200 text-lg tracking-wide"
              >
                BACK
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-400 text-white font-bold py-4 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center text-lg tracking-wide"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'CREATE ACCOUNT'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm2;