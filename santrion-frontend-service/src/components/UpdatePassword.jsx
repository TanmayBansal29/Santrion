import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

function UpdatePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    };
  };

  const handleUpdatePassword = () => {
    const newErrors = {};
    
    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else {
      const validation = validatePassword(newPassword);
      if (!validation.isValid) {
        newErrors.newPassword = 'Password does not meet requirements';
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (currentPassword === newPassword && currentPassword && newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        alert('Password updated successfully! (Demo)');
        // Reset form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }, 1500);
    }
  };

  const passwordValidation = validatePassword(newPassword);

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
          <h1 className="text-4xl font-black text-white mb-6 leading-tight tracking-wide">
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
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
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
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
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
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21,9V7l-3-2H6L3,7V9a3,3 0 0,0 3,3h12A3,3 0 0,0 21,9M19,16H5V14H3v6H21V14H19V16Z"/>
                </svg>
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
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
                </svg>
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

      {/* Right Panel - Update Password Form */}
      <div className="w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              UPDATE PASSWORD
            </h2>
            <p className="text-gray-500 text-sm">
              Please enter your current password and choose a new one
            </p>
          </div>

          {/* Update Password Form */}
          <div className="space-y-6">
            {/* Current Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`w-full px-4 py-4 pr-12 border rounded-lg focus:ring-2 transition-all text-gray-700 ${
                    errors.currentPassword 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'
                  }`}
                  placeholder=""
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  <span className="ml-1 text-xs">Show</span>
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
              )}
            </div>

            {/* New Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full px-4 py-4 pr-12 border rounded-lg focus:ring-2 transition-all text-gray-700 ${
                    errors.newPassword 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-200 focus:ring-teal-500 focus:border-teal-500'
                  }`}
                  placeholder=""
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  <span className="ml-1 text-xs">Show</span>
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
              )}
            </div>

            {/* Password Requirements */}
            {newPassword && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-3">Password Requirements:</p>
                <div className="space-y-2">
                  <div className={`flex items-center text-xs ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.minLength ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                    At least 8 characters
                  </div>
                  <div className={`flex items-center text-xs ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.hasUpperCase ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                    One uppercase letter
                  </div>
                  <div className={`flex items-center text-xs ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.hasLowerCase ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                    One lowercase letter
                  </div>
                  <div className={`flex items-center text-xs ${passwordValidation.hasNumbers ? 'text-green-600' : 'text-gray-500'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.hasNumbers ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                    One number
                  </div>
                  <div className={`flex items-center text-xs ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.hasSpecialChar ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                    One special character
                  </div>
                </div>
              </div>
            )}

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-4 pr-12 border rounded-lg focus:ring-2 transition-all text-gray-700 ${
                    errors.confirmPassword 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-200 focus:ring-teal-500 focus:border-teal-500'
                  }`}
                  placeholder=""
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  <span className="ml-1 text-xs">Show</span>
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Update Password Button */}
            <button
              onClick={handleUpdatePassword}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold py-4 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center text-lg tracking-wide"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'SET PASSWORD'
              )}
            </button>
          </div>

          {/* Back to Dashboard Link */}
          <div className="text-center mt-8">
            <span className="text-sm text-gray-500">Want to go back? </span>
            <button className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors">
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdatePasswordPage;