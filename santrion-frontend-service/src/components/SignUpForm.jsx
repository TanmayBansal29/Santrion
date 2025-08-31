import React from 'react';
import { User, Calendar, Truck, Heart } from 'lucide-react';

// Reusable Form Input Component
const FormInput = ({ label, type = "text", name, value, onChange, placeholder, className = "" }) => {
  return (
    <div className={className}>
      {label && <label className="block text-white text-sm mb-2">{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
        placeholder={placeholder}
      />
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="flex items-start mb-8 text-white">
      <div className="mr-4 mt-1">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-purple-100 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

// Features Panel Component
const FeaturesPanel = () => {
  const features = [
    {
      icon: <User className="w-6 h-6" />,
      title: "24/7 AI-Powered Support",
      description: "Get instant answers and help with symptoms, prescriptions, and more anytime."
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Book Appointments in Seconds",
      description: "Connect with top doctors, mental health specialists and fitness experts - all in one place."
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Medicines at your doorstep",
      description: "Fast, reliable doorstep delivery of your prescribed medicines and health essentials."
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Your Wellness, Inside and Out",
      description: "Comprehensive care for your body and mind with fitness tracking, therapy, and consultations."
    }
  ];

  return (
    <div className="flex-1 p-8 flex flex-col justify-center">
      <div className="max-w-md">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};

// Main HealthcareSignup Component (Step 1)
const SignUpForm = ({ formData, onInputChange, onNext, onSendOTP }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 flex">
      <FeaturesPanel />
      
      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Create an Account
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="First Name"
                name="firstName"
                // value={firstName}
                // onChange={onInputChange}
                // placeholder="First Name"
              />
              <FormInput
                label="Last Name"
                name="lastName"
                // value={formData.lastName}
                // onChange={onInputChange}
                // placeholder="Last Name"
              />
            </div>

            <div className="flex gap-2">
              <FormInput
                type="email"
                name="email"
                // value={formData.email}
                // onChange={onInputChange}
                // placeholder="Email Address"
                // className="flex-1"
              />
              <button
                // onClick={onSendOTP}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                Send OTP
              </button>
            </div>

            <FormInput
              name="username"
            //   value={formData.username}
            //   onChange={onInputChange}
            //   placeholder="UserName"
            />

            <FormInput
              type="tel"
              name="phone"
            //   value={formData.phone}
            //   onChange={onInputChange}
            //   placeholder="Phone number"
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Password"
                type="password"
                name="password"
                // value={formData.password}
                // onChange={onInputChange}
                // placeholder="Password"
              />
              <FormInput
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                // value={formData.confirmPassword}
                // onChange={onInputChange}
                // placeholder="Confirm Password"
              />
            </div>

            <p className="text-white/70 text-sm">
              use 8 or more characters with a mix of letters, number & symbols
            </p>

            <button
            //   onClick={onNext}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors mt-6"
            >
              Next
            </button>

            <p className="text-center text-white/70 text-sm mt-4">
              Have an account?{' '}
              <span className="text-blue-300 hover:text-blue-200 cursor-pointer underline">
                Log in here
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;