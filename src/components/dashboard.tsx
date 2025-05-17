// import React from 'react';

// export default function Dashboard() {
//   return (
//     <div>
//       {/* Empty dashboard */
//       }
//     </div>
//   );
// }


import { motion } from "framer-motion";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./ui/firebase";


export default function Dashboard() {
  const [user] = useAuthState(auth);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 p-8"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl font-bold mb-6"
        >
          Welcome, {user?.displayName || "User"}! 👋
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-blue-50 p-6 rounded-xl"
          >
            <h2 className="text-xl font-semibold mb-2">Your Applications</h2>
            <p className="text-gray-600">0 active applications</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-green-50 p-6 rounded-xl"
          >
            <h2 className="text-xl font-semibold mb-2">Upcoming Interviews</h2>
            <p className="text-gray-600">No scheduled interviews</p>
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => auth.signOut()}
          className="mt-6 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </motion.button>
      </div>
    </motion.div>
  );
}