// import React from 'react';

// export default function Auth() {
//   return (
//     <div>
//       {/* Empty auth page */}
//     </div>
//   );
// }


import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";

import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { auth } from "./ui/firebase";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputActive, setInputActive] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!email) return setError("Please enter your email address");

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Password reset email sent! Check your inbox.");
      setTimeout(() => {
        setIsForgotPassword(false);
        setEmail("");
      }, 3000);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.4 } },
  };

  const inputField = (type, value, setValue, label, icon, isPassword = false) => (
    <motion.div variants={inputVariants} className="relative group">
      <div className="absolute left-0 top-4 text-white opacity-60">
        {icon}
      </div>
      <input
        type={isPassword && !showPassword ? "password" : "text"}
        value={value}
        onClick={() => setInputActive(true)}
        onBlur={() => setInputActive(false)}
        onChange={(e) => setValue(e.target.value)}
        className="w-full pl-8 pr-10 bg-transparent border-0 border-b border-white/30 focus:border-white text-white py-2 placeholder-transparent focus:outline-none peer"
        placeholder={label}
      />
      <motion.label
        initial={{ y: 2, opacity: 0 }}
        animate={{ y: inputActive || value ? -22 : 2, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="absolute left-8 bottom-3 text-sm text-white/60 transition-all duration-200 peer-focus:-translate-y-4 peer-focus:text-white"
      >
        {label}
      </motion.label>
      
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-0 top-4 text-white/60 hover:text-white transition-colors"
        >
          {showPassword ? (
            <FiEyeOff className="w-5 h-5" />
          ) : (
            <FiEye className="w-5 h-5" />
          )}
        </button>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen authfont flex bg-gradient-to-tr from-[#121f28] to-[#000000] items-center justify-center text-white p-4"> 
      <motion.div
        initial={{ x: -700 }}
        animate={{ x: 0 }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 10,
          duration: 0.5,
          delay: 0.1
        }}
        className="w-full max-w-lg backdrop-blur-xl authfont rounded-2xl shadow-2xl border  border-white/10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isForgotPassword ? "forgot" : "auth"}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="p-8 space-y-6"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-3xl font-semibold text-center authfont bg-gradient-to-r authfont from-white to-gray-400 bg-clip-text text-transparent"
            >
              {isForgotPassword
                ? "Reset Password"
                : isLogin
                ? "Welcome to Job Tracker"
                : "Create Account"}
            </motion.h1>

            <form
              onSubmit={isForgotPassword ? handlePasswordReset : handleAuth}
              className="space-y-6"
            >
              {!isLogin && !isForgotPassword &&
                inputField("text", name, setName, "Full Name", <FiUser />)}

              {inputField("email", email, setEmail, "Email", <FiMail />)}

              {!isForgotPassword &&
                inputField("password", password, setPassword, "Password", <FiLock />, true)}

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {successMessage && <p className="text-green-400 text-sm">{successMessage}</p>}

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-white to-gray-500 text-black font-semibold py-3 rounded-xl hover:shadow-white/30 transition-all"
              >
                {loading
                  ? " Processing..."
                  : isForgotPassword
                  ? "Send Reset Link"
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </motion.button>
            </form>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-4 flex flex-col items-center gap-2 text-sm text-white/70"
            >
              {isLogin && !isForgotPassword && (
                <button
                  onClick={() => setIsForgotPassword(true)}
                  className="hover:text-[#00ffff] transition-colors"
                >
                  Forgot Password?
                </button>
              )}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setIsForgotPassword(false);
                }}
                className="hover:text-[#00ffff] transition-colors"
              >
                {isLogin
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Sign In"}
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
