import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';

export default function WelcomePage() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    { text: "Your journey to success begins here", style: "font-light italic" },
    { text: "Every step forward is progress", style: "font-medium" },
    { text: "Great things take time", style: "font-light tracking-wide" },
    { text: "You're capable of amazing things", style: "font-normal" }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 6000);

    const messageTimer = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearInterval(messageTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="text-center"
      >
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="text-4xl font-light text-gray-900 mb-4"
        >
          Welcome,{" "}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="font-normal"
          >
            {user?.displayName || 'User'}
          </motion.span>
        </motion.h1>

        <AnimatePresence mode="wait">
          <motion.p
            key={currentMessage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.8,
              ease: "easeInOut"
            }}
            className={`text-gray-600 mb-8 text-lg ${messages[currentMessage].style}`}
          >
            {messages[currentMessage].text}
          </motion.p>
        </AnimatePresence>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.9 }}
          className="mt-8"
        >
          <div className="w-12 h-12 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto" />
        </motion.div>
      </motion.div>
    </div>
  );
} 