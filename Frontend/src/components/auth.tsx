import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { auth } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";

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
  const [displayText, setDisplayText] = useState("");
  const navigate = useNavigate();

  const messages = {
    login: [
      "Welcome back! Let's get you signed in.",
      "Ready to continue your journey?",
      "Access your personalized dashboard.",
      "Track your progress and achievements.",
      "Stay organized with your tasks.",
    ],
    signup: [
      "Let's create your account and get started.",
      "Begin your journey with us.",
      "Join our community of users.",
      "Start tracking your progress today.",
      "Your success story begins here.",
    ],
    forgot: [
      "Don't worry, we'll help you reset your password.",
      "Enter your email to receive reset instructions.",
      "We'll guide you through the process.",
      "Get back to your account quickly.",
      "Security is our top priority.",
    ],
  };

  const currentMessages = isForgotPassword ? messages.forgot : isLogin ? messages.login : messages.signup;

  useEffect(() => {
    let currentIndex = 0;
    let currentText = "";
    let isDeleting = false;
    let timeout: NodeJS.Timeout;

    const type = () => {
      const currentMessage = currentMessages[currentIndex];
      
      if (isDeleting) {
        currentText = currentMessage.substring(0, currentText.length - 1);
      } else {
        currentText = currentMessage.substring(0, currentText.length + 1);
      }

      setDisplayText(currentText);

      if (!isDeleting && currentText === currentMessage) {
        timeout = setTimeout(() => {
          isDeleting = true;
          type();
        }, 2000);
      } else if (isDeleting && currentText === "") {
        isDeleting = false;
        currentIndex = (currentIndex + 1) % currentMessages.length;
        timeout = setTimeout(type, 500);
      } else {
        timeout = setTimeout(type, isDeleting ? 30 : 50);
      }
    };

    timeout = setTimeout(type, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [isLogin, isForgotPassword]);

  const handleAuth = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (userCredential.user) {
          navigate('/welcome', { replace: true });
        }
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (userCredential.user) {
          await updateProfile(userCredential.user, { displayName: name });
          navigate('/welcome', { replace: true });
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Password reset email sent! Please check your inbox.");
      setError("");
      setEmail("");
    } catch (err: any) {
      setError(err.message);
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="absolute top-6 left-6">
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ 
            duration: 0.2,
            scale: {
              type: "spring",
              stiffness: 400,
              damping: 17
            }
          }}
          onClick={handleBack}
          className="group relative flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
        >
          <FiArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="font-medium">Back</span>
          
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-md whitespace-nowrap invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
            Back to Home
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </motion.button>
      </div>

      <div className="flex items-center justify-center p-4 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative"
        >
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl font-medium text-gray-900 mb-2"
            >
              {isForgotPassword ? "Reset Password" : isLogin ? "Welcome Back" : "Create Account"}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-16 flex items-center justify-center"
            >
              <p className="text-gray-600 font-normal">
                {displayText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-1 h-4 bg-gray-600 ml-1"
                />
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
          >
            <form onSubmit={isForgotPassword ? handleForgotPassword : handleAuth} className="space-y-6">
              <AnimatePresence mode="wait">
                {!isLogin && !isForgotPassword && (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, height: 0, x: -20 }}
                    animate={{ opacity: 1, height: "auto", x: 0 }}
                    exit={{ opacity: 0, height: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-transparent transition-all font-normal"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="space-y-2"
              >
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-transparent transition-all font-normal"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </motion.div>

              <AnimatePresence mode="wait">
                {!isForgotPassword && (
                  <motion.div
                    key="password"
                    initial={{ opacity: 0, height: 0, x: -20 }}
                    animate={{ opacity: 1, height: "auto", x: 0 }}
                    exit={{ opacity: 0, height: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-transparent transition-all font-normal"
                        placeholder="Enter your password"
                        required
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                        ) : (
                          <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-medium"
                  >
                    {error}
                  </motion.div>
                )}

                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="p-3 bg-green-50 border border-green-100 rounded-lg text-green-600 text-sm font-medium"
                  >
                    {successMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    {isForgotPassword ? "Send Reset Link" : isLogin ? "Sign In" : "Create Account"}
                    <FiArrowRight className="h-4 w-4" />
                  </>
                )}
              </motion.button>

              <div className="text-center space-y-4">
                {!isForgotPassword && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
                  >
                    Forgot your password?
                  </motion.button>
                )}

                <div className="text-sm text-gray-600 font-normal">
                  {isForgotPassword ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setIsForgotPassword(false)}
                      className="text-gray-900 hover:text-gray-700 transition-colors font-medium"
                    >
                      Back to {isLogin ? "Sign In" : "Sign Up"}
                    </motion.button>
                  ) : (
                    <>
                      {isLogin ? "Don't have an account? " : "Already have an account? "}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => {
                          setIsLogin(!isLogin);
                          setError("");
                          setSuccessMessage("");
                        }}
                        className="text-gray-900 hover:text-gray-700 transition-colors font-medium"
                      >
                        {isLogin ? "Sign Up" : "Sign In"}
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
