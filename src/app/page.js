'use client';

import { Send, Zap, Users, Trash2, ShieldCheck, TrendingUp, Cpu, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
// 1. Import the router hook for navigation (Assuming Next.js App Router/Pages Router)
import { useRouter } from 'next/navigation'; 

export default function LandingPage() {
  // 2. Initialize the router
  const router = useRouter();

  // 3. Update navigation functions to use router.push()
  const handleStartChat = () => {
    // Navigate to the main chat interface, which we assume is at '/chat'
    router.push('/chatpage'); 
  };

  const handleNavigateTeam = () => {
    // Navigate to the Team/About page, which we assume is at '/team'
    router.push('/team');
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Feature set focusing on core value proposition
  const features = [
    { 
      icon: ShieldCheck, 
      title: "100% Private Sessions", 
      description: "We don't log, store, or analyze your conversations—ever. Your chat is for your eyes only." 
    },
    { 
      icon: TrendingUp, 
      title: "Truly Unlimited Access", 
      description: "Forget credits, subscriptions, or paywalls. Use the AI as much as you need, free forever." 
    },
    { 
      icon: Cpu, 
      title: "Zero-Trace Technology", 
      description: "No account required. Once you close the tab, all session data is permanently erased." 
    },
  ];

  return (
    // Updated background to dark gray, giving a high-tech/security feel
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white font-sans p-4">
      
      {/* --- Navigation Bar (Sleek Dark) --- */}
      <header className="fixed top-0 w-full max-w-7xl px-8 py-4 flex justify-between items-center z-20 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-teal-400 to-green-500 bg-clip-text text-transparent">
          ZERO-TRACE AI
        </h1>
        <nav className="flex items-center gap-6">
            <button 
                onClick={handleNavigateTeam}
                className="text-gray-400 hover:text-teal-400 font-medium transition flex items-center gap-1 text-sm"
            >
                <Users size={16} />
                Team
            </button>
            <button 
                onClick={handleStartChat}
                // Strong CTA button with gradient
                className="px-5 py-2 text-sm font-bold text-gray-900 bg-gradient-to-r from-teal-400 to-green-500 rounded-full shadow-lg hover:shadow-teal-500/50 transition-all"
            >
                Try Chat
            </button>
        </nav>
      </header>

      {/* --- Hero Section (Centered & Dominant) --- */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center pt-40 pb-20 max-w-5xl"
      >
        <motion.div variants={itemVariants}>
          <p className="inline-block px-4 py-1 text-xs font-semibold text-teal-400 border border-teal-400/50 bg-gray-800 rounded-full mb-4 uppercase tracking-widest">
            NO LOGIN. NO CREDIT. NO TRACE.
          </p>
        </motion.div>

        <motion.h2 
          variants={itemVariants}
          className="text-7xl md:text-8xl font-black mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
          style={{ 
            backgroundImage: 'linear-gradient(90deg, #FFFFFF, #BDBDBD)', // Fallback for subtle text gradient
          }}
        >
          Absolute Privacy, <br />
          <span className="bg-gradient-to-r from-teal-400 to-green-500 bg-clip-text text-transparent">Unlimited AI Power.</span>
        </motion.h2>

        <motion.p 
          variants={itemVariants}
          className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto"
        >
          Chat freely with an advanced AI assistant built on a revolutionary **zero-data policy**. Experience the future of interaction where your **privacy is the default setting**.
        </motion.p>
        
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(52, 211, 163, 0.6)" }} // Teal glow on hover
          whileTap={{ scale: 0.98 }}
          onClick={handleStartChat}
          className="flex items-center justify-center gap-4 px-12 py-4 mx-auto rounded-full font-bold text-lg text-gray-900 transition-all shadow-xl 
            bg-gradient-to-r from-teal-400 to-green-500"
        >
          <Send size={22} />
          Start 100% Private Chat
        </motion.button>
      </motion.section>
      
      {/* --- Main Privacy Features --- */}
      <section className="py-20 w-full max-w-7xl">
        <h3 className="text-4xl font-bold text-center mb-16 text-white">The Zero-Trace Promise</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 hover:border-teal-400 transition-all duration-300"
            >
              <feature.icon className="w-10 h-10 text-teal-400 mb-4 p-2 bg-gray-700 rounded-lg" />
              <h4 className="text-xl font-bold mb-3 text-white">{feature.title}</h4>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        
        {/* --- Highlighting the Privacy Benefit as a Feature (Ultimate Privacy) --- */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
            className="mt-20 text-center text-xl font-extrabold p-8 bg-gray-800 rounded-xl shadow-inner max-w-3xl mx-auto border-4 border-teal-500/60"
        >
            <Lock className="w-8 h-8 text-teal-400 mx-auto mb-3" />
            <p className="text-white">
                This is **Ultimate Privacy**. No login, no storage, and **absolutely zero data shared** with us or anyone else. Chat with complete peace of mind.
            </p>
        </motion.div>
        {/* ----------------------------------------------- */}

      </section>
      
      {/* --- Footer (Minimal Dark) --- */}
      <footer className="py-6 mt-16 w-full max-w-7xl border-t border-gray-800 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Zero-Trace AI. Privacy is our policy.
      </footer>
    </div>
  );
}