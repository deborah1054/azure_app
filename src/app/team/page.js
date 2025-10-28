'use client';

import { motion } from 'framer-motion';
import { Linkedin, Github, ExternalLink, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TeamPage() {
  const router = useRouter();

  // Define your team members dynamically
  const teamMembers = [
    {
      id: 1,
      name: 'Kerston Anto Singh A',
      role: 'Full Stack Developer',
      bio: 'Developed Frontend and Backed API control on website.',
      imageUrl: 'https://media.licdn.com/dms/image/v2/D5603AQFAYPLl5iuBZw/profile-displayphoto-shrink_400_400/B56ZbKc_GRHgAg-/0/1747153318915?e=1762992000&v=beta&t=EyVI3-Eskz2EnfbKl7tBD1mxpZ_JBcoiiL4JQpRc8nw', // Replace with actual image URLs
      websiteUrl: 'https://kas-portfolio-ten.vercel.app', // Example LinkedIn
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white font-sans p-4">
      {/* --- Header with Back Button --- */}
      <header className="fixed top-0 w-full max-w-7xl px-8 py-4 flex justify-between items-center z-20 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
        <button
          onClick={() => router.back()} // Go back to the previous page (chat or landing)
          className="flex items-center gap-2 text-gray-400 hover:text-teal-400 font-medium transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-teal-400 to-green-500 bg-clip-text text-transparent">
          Our Team
        </h1>
        {/* Empty div for spacing to align title center */}
        <div className="w-20"></div> 
      </header>

      {/* --- Team Section --- */}
      <section className="w-full max-w-6xl pt-32 pb-16">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-extrabold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
        >
          Meet the Visionaries
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.15 }}
              className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8 flex flex-col items-center text-center hover:border-teal-400 hover:shadow-teal-500/20 transition-all duration-300"
            >
              <img
                src={member.imageUrl}
                alt={member.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-teal-500/50 mb-6 shadow-md"
              />
              <h3 className="text-2xl font-bold mb-2 text-white">{member.name}</h3>
              <p className="text-teal-400 text-md font-medium mb-4">{member.role}</p>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{member.bio}</p>
              
              {member.websiteUrl && (
                <a
                  href={member.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-full font-semibold text-sm hover:from-teal-500 hover:to-green-500 transition-all shadow-md hover:shadow-lg"
                >
                  Visit Profile <ExternalLink size={16} />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- Footer (Minimal Dark) --- */}
      <footer className="py-6 mt-16 w-full max-w-7xl border-t border-gray-800 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Zero-Trace AI. Privacy is our policy.
      </footer>
    </div>
  );
}