import React, { useState, useEffect } from "react";
import { ArrowRight, CheckCircle2, BarChart3, Calendar, Briefcase, ArrowUpRight } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const text = "Track Your Job Search Journey";
  const words = text.split(" ");

  const messages = [
    "Stay organized and focused on your career goals with our intuitive job application tracker.",
    "Never miss a follow-up or deadline with our smart application management system.",
    "Track your progress, analyze your success rate, and land your dream job faster.",
    "Keep all your job applications, interviews, and offers in one organized place.",
    "Get insights into your job search performance and improve your success rate.",
    "Manage multiple applications and interviews with ease and confidence."
  ];

  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isWaiting, setIsWaiting] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentMessage = messages[currentIndex];

    if (isWaiting) {
      timeout = setTimeout(() => {
        setIsWaiting(false);
        setIsTyping(false);
      }, 1000);
    } else if (isTyping) {
      if (displayText === currentMessage) {
        setIsWaiting(true);
      } else {
        timeout = setTimeout(() => {
          setDisplayText(currentMessage.slice(0, displayText.length + 1));
        }, 50);
      }
    } else {
      if (displayText === "") {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setIsTyping(true);
      } else {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 30);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, currentIndex, isTyping, isWaiting]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthNavigation = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Sign Up Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -inset-2 bg-gradient-to-r from-gray-200 via-white to-gray-200 rounded-full blur-md"
              />
              <Button 
                size="lg" 
                onClick={handleAuthNavigation}
                className="relative rounded-full px-8 py-6 text-base font-medium bg-white text-gray-900 flex items-center gap-2 transition-all duration-300 border border-gray-200/50 hover:border-gray-300/50 hover:bg-gray-50/50 backdrop-blur-sm overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-gray-100 via-white to-gray-100"
                  animate={{
                    x: ["0%", "100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <motion.div
                  className="relative flex items-center gap-2"
                  animate={{
                    y: [0, -2, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <span className="font-medium">Sign Up</span>
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </motion.div>
                </motion.div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container relative mx-auto px-4 py-16 sm:py-20 md:py-24 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 sm:mb-8"
            >
              <div className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 sm:mb-8 flex flex-wrap justify-center">
                {words.map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.2,
                      ease: "easeOut"
                    }}
                    className="mr-2"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
              <div className="h-24 sm:h-28 flex items-center justify-center">
                <motion.p 
                  className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-700 max-w-3xl mx-auto px-4 sm:px-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {displayText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-1 h-6 sm:h-7 md:h-8 bg-gray-700 ml-1"
                  />
                </motion.p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Button 
                  size="lg" 
                  onClick={handleAuthNavigation}
                  className="w-full sm:w-auto rounded-full px-8 sm:px-10 py-6 sm:py-7 text-lg sm:text-xl font-semibold bg-gray-900 hover:bg-gray-800 text-white shadow-lg shadow-gray-900/25"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Button size="lg" className="w-full sm:w-auto rounded-full px-8 sm:px-10 py-6 sm:py-7 text-lg sm:text-xl font-semibold bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-gray-900/10">
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20 sm:py-24 md:py-32 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gray-900">Everything you need to manage your job search</h2>
          <p className="text-xl sm:text-2xl text-gray-600">Powerful features to help you stay organized and focused</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {[
            {
              icon: <Briefcase className="h-6 w-6 sm:h-7 sm:w-7" />,
              title: "Track Applications",
              description: "Keep track of all your job applications in one place. Never miss a follow-up or deadline.",
              gradient: "from-gray-50 to-white",
              iconColor: "text-gray-900",
            },
            {
              icon: <Calendar className="h-6 w-6 sm:h-7 sm:w-7" />,
              title: "Interview Schedule",
              description: "Manage your interview schedule and never double-book or miss an important meeting.",
              gradient: "from-gray-50 to-white",
              iconColor: "text-gray-900",
            },
            {
              icon: <BarChart3 className="h-6 w-6 sm:h-7 sm:w-7" />,
              title: "Analytics & Insights",
              description: "Get insights into your job search progress with detailed analytics and reports.",
              gradient: "from-gray-50 to-white",
              iconColor: "text-gray-900",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ 
                y: -2,
                transition: { 
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }
              }}
              className={`group relative bg-gradient-to-br ${feature.gradient} backdrop-blur-sm rounded-2xl p-8 sm:p-10 border border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 ease-out`}
            >
              <motion.div 
                className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-100 flex items-center justify-center mb-6 sm:mb-8 ${feature.iconColor} transition-all duration-500 ease-out`}
                whileHover={{ 
                  rotate: 360,
                  scale: 1.05,
                  transition: {
                    rotate: {
                      duration: 0.8,
                      ease: "easeInOut"
                    },
                    scale: {
                      duration: 0.3,
                      ease: "easeOut"
                    }
                  }
                }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="relative text-xl sm:text-2xl font-semibold mb-4 sm:mb-5 text-gray-900 transition-all duration-500 ease-out">
                {feature.title}
              </h3>
              <p className="relative text-base sm:text-lg text-gray-600 transition-all duration-500 ease-out">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-20 sm:py-24 md:py-32 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900">Why choose JobTrackr?</h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">The smart way to manage your job search journey with powerful features designed for success</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {[
              { 
                text: "Organize all your job applications in one place", 
                emoji: "📋",
                description: "Keep track of every application, from submission to offer",
                color: "from-blue-50 to-white"
              },
              { 
                text: "Track application status and follow-ups", 
                emoji: "📊",
                description: "Never miss a follow-up or deadline again",
                color: "from-purple-50 to-white"
              },
              { 
                text: "Get reminders for important deadlines", 
                emoji: "⏰",
                description: "Stay on top of your interview schedule and application deadlines",
                color: "from-green-50 to-white"
              },
              { 
                text: "Analyze your job search progress", 
                emoji: "📈",
                description: "Get insights into your application success rate and areas for improvement",
                color: "from-orange-50 to-white"
              },
              { 
                text: "Access from anywhere, anytime", 
                emoji: "🌐",
                description: "Your job search data is always at your fingertips",
                color: "from-pink-50 to-white"
              },
            ].map((benefit, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  x: 10,
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className={`group bg-gradient-to-br ${benefit.color} rounded-xl p-4 sm:p-6 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    whileHover={{ 
                      scale: 1.2, 
                      rotate: 360,
                      transition: { duration: 0.5 }
                    }}
                    className="text-3xl sm:text-4xl bg-white p-3 rounded-lg shadow-sm"
                  >
                    {benefit.emoji}
                  </motion.div>
                  <div className="space-y-2 flex-1">
                    <motion.h3 
                      className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-gray-800 transition-colors duration-300"
                      whileHover={{ x: 5 }}
                    >
                      {benefit.text}
                    </motion.h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {[
                { 
                  label: "Success Rate", 
                  value: "85%", 
                  color: "from-blue-50 to-white",
                  icon: "📈",
                  description: "of users land interviews",
                  trend: "+12% from last month",
                  trendColor: "text-green-600"
                },
                { 
                  label: "User Rating", 
                  value: "4.8/5", 
                  color: "from-purple-50 to-white",
                  icon: "⭐",
                  description: "based on 2,000+ reviews",
                  trend: "98% would recommend",
                  trendColor: "text-purple-600"
                },
                { 
                  label: "Active Users", 
                  value: "10K+", 
                  color: "from-green-50 to-white",
                  icon: "👥",
                  description: "growing community",
                  trend: "2x growth this year",
                  trendColor: "text-blue-600"
                },
                { 
                  label: "Job Offers", 
                  value: "2.5K+", 
                  color: "from-orange-50 to-white",
                  icon: "🎯",
                  description: "successful placements",
                  trend: "500+ this month",
                  trendColor: "text-orange-600"
                }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  className={`group bg-gradient-to-br ${stat.color} backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <motion.div 
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 360,
                        transition: { duration: 0.5 }
                      }}
                      className="text-4xl sm:text-5xl bg-white p-3 rounded-lg shadow-sm"
                    >
                      {stat.icon}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="text-3xl sm:text-4xl font-bold text-gray-900"
                    >
                      {stat.value}
                    </motion.div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-lg sm:text-xl font-semibold text-gray-900">{stat.label}</div>
                    <div className="text-sm sm:text-base text-gray-600">{stat.description}</div>
                    <div className={`text-sm font-medium ${stat.trendColor}`}>{stat.trend}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="container mx-auto px-4 py-16 sm:py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
          <motion.div 
            className="space-y-6 col-span-2 sm:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">JobTrackr</h3>
            <p className="text-base sm:text-lg text-gray-600">
              Your all-in-one solution for managing job applications and interviews.
            </p>
          </motion.div>
          
          {[
            {
              title: "Product",
              links: ["Features", "Pricing", "Roadmap", "Updates"],
            },
            {
              title: "Company",
              links: ["About", "Blog", "Careers", "Contact"],
            },
            {
              title: "Legal",
              links: ["Privacy", "Terms", "Security", "Cookies"],
            },
          ].map((section, index) => (
            <motion.div 
              key={index}
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li 
                    key={linkIndex}
                    className="group"
                  >
                    <a
                      href="#"
                      className="text-base sm:text-lg text-gray-600 hover:text-gray-900 transition-colors inline-block hover:translate-x-1 duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-gray-200"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-sm sm:text-base text-gray-500">
              © 2025 JobTrackr. All rights reserved.
            </p>
            <div className="flex gap-6 sm:gap-8">
              {[
                {
                  icon: (
                    <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  ),
                },
                {
                  icon: (
                    <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  ),
                },
                {
                  icon: (
                    <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                    </svg>
                  ),
                },
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-gray-500 hover:text-gray-900 transition-all duration-300 hover:scale-110 hover:rotate-12 inline-block"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
