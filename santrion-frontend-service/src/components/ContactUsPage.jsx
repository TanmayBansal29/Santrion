import React, { useState } from "react";
import { FaEnvelope, FaHome, FaPhone, FaLinkedin, FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Message sent successfully! (Demo)');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Contact Info */}
        <div className="w-1/2 bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 p-16 flex flex-col justify-center relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-16 w-40 h-40 bg-white rounded-full blur-sm"></div>
            <div className="absolute bottom-40 right-20 w-32 h-32 bg-white rounded-full blur-sm"></div>
            <div className="absolute top-1/2 right-40 w-20 h-20 bg-white rounded-full blur-sm"></div>
          </div>
          
          <div className="relative z-10 max-w-lg">
            <h1 className="text-5xl font-black text-white mb-6 leading-tight tracking-wide">
              LET'S CONNECT<br />
              & CREATE TOGETHER
            </h1>
            <p className="text-white text-xl mb-16 italic font-light">
              We are committed to processing your information to contact you about your project
            </p>

            <div className="space-y-10">
              {/* Email */}
              <div className="flex items-start space-x-5">
                <div className="flex-shrink-0 w-16 h-16 bg-white bg-opacity-25 rounded-xl flex items-center justify-center">
                  <FaEnvelope className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl mb-2">
                    Email Address
                  </h3>
                  <p className="text-white text-lg leading-relaxed opacity-90">
                    santrionn@gmail.com
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-5">
                <div className="flex-shrink-0 w-16 h-16 bg-white bg-opacity-25 rounded-xl flex items-center justify-center">
                  <FaHome className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl mb-2">
                    Our Location
                  </h3>
                  <p className="text-white text-lg leading-relaxed opacity-90">
                    Jalandhar, Punjab, India
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-5">
                <div className="flex-shrink-0 w-16 h-16 bg-white bg-opacity-25 rounded-xl flex items-center justify-center">
                  <FaPhone className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl mb-2">
                    Phone Number
                  </h3>
                  <p className="text-white text-lg leading-relaxed opacity-90">
                    +91 7814080390
                  </p>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex items-start space-x-5">
                <div className="flex-shrink-0 w-16 h-16 bg-white bg-opacity-25 rounded-xl flex items-center justify-center">
                  <FaLinkedin className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl mb-2">
                    Follow Us
                  </h3>
                  <div className="flex gap-4 mt-3 text-2xl text-white">
                    <FaLinkedin className="hover:scale-110 transition-transform cursor-pointer" />
                    <FaInstagram className="hover:scale-110 transition-transform cursor-pointer" />
                    <FaFacebook className="hover:scale-110 transition-transform cursor-pointer" />
                    <FaTwitter className="hover:scale-110 transition-transform cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Contact Form */}
        <div className="w-1/2 bg-white flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-black text-gray-900 mb-4">
                CONTACT US
              </h2>
              <p className="text-gray-600 text-lg">
                Ready to start your project? Let's talk!
              </p>
            </div>

            {/* Contact Form */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-700 text-lg"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-700 text-lg"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Website (Optional)
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-700 text-lg"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-700 text-lg resize-none"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 disabled:opacity-70 text-white font-bold py-4 px-4 rounded-lg transition-all duration-200 flex items-center justify-center text-lg tracking-wide mt-8 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Send Message'
                )}
              </button>
            </div>

            {/* Response Time */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                We typically respond within 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t py-12 px-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-gray-700">
            {/* Profile */}
            <div>
              <h2 className="font-black text-lg mb-4 text-gray-900">SANTRIONN</h2>
              <p className="text-sm mb-1 text-gray-600">Santrionn@gmail.com</p>
              <p className="text-sm mb-4 text-gray-600">+91 7814080390</p>
              <div className="flex gap-3 text-xl text-gray-500">
                <FaLinkedin className="hover:text-blue-600 cursor-pointer transition-colors" />
                <FaInstagram className="hover:text-pink-600 cursor-pointer transition-colors" />
                <FaFacebook className="hover:text-blue-700 cursor-pointer transition-colors" />
                <FaTwitter className="hover:text-blue-400 cursor-pointer transition-colors" />
              </div>
            </div>

            {/* Blog */}
            <div>
              <h2 className="font-bold mb-4 text-gray-900">Blog</h2>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-orange-500 cursor-pointer transition-colors">Company</li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">Career</li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">Mobile</li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">How it works</li>
              </ul>
            </div>

            {/* About */}
            <div>
              <h2 className="font-bold mb-4 text-gray-900">About</h2>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-orange-500 cursor-pointer transition-colors">Contacts</li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">About us</li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">FAQ</li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">Our Team</li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">Terms of service</li>
              </ul>
            </div>

            {/* Product */}
            <div>
              <h2 className="font-bold mb-4 text-gray-900">Product</h2>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-orange-500 cursor-pointer transition-colors">Terms of use</li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">Privacy policy</li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">Log in</li>
              </ul>
            </div>

            {/* Download */}
            <div>
              <h2 className="font-bold mb-4 text-gray-900">Download App</h2>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-orange-500 cursor-pointer transition-colors">Google Play</li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">Apple Store</li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">Desktop</li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-200 mt-8 pt-6 text-center">
            <p className="text-sm text-gray-500">
              © 2025 SANTRIONN. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ContactUsPage;