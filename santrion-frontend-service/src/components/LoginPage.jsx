import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

 function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Login successful! (Demo)');
    }, 1500);
  };

  const handleGoogleLogin = () => {
    alert('Google login clicked! (Demo)');
  };

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

      {/* Right Panel - Login Form */}
      <div className="w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              WELCOME BACK!
            </h2>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-700"
                placeholder=""
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-gray-700"
                  placeholder=""
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  <span className="ml-1 text-xs">Show</span>
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button className="text-sm text-teal-600 hover:text-teal-700 transition-colors">
                Forgot Password ?
              </button>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-400 text-white font-bold py-4 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center text-lg tracking-wide"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'LOGIN'
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center my-8">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-6 text-sm text-gray-400 font-medium">OR</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-4 px-4 rounded-lg border border-gray-200 transition-colors duration-200 flex items-center justify-center space-x-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <span className="text-sm text-gray-500">Don't Having an Account? </span>
            <button className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors">
              Register Now!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;