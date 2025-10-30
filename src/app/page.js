import Image from 'next/image';

// You can easily add or remove team members from this array
const teamMembers = [
  {
    id: 1,
    name: 'Deborah m',
    url:'https://www.rewind.sk/wp-content/uploads/2021/09/what-if-black-widow-1.jpg',
    role: 'Lead Developer',
  },
  {
    id: 2,
    name: 'Joshua A.',
    role: 'Project Manager',
  },
  {
    id: 3,
    name: 'Joy Subash.',
    role: 'UI/UX Designer',
  },
  {
    id: 4,
    name: 'Jude E',
    role: 'QA Engineer',
  },  {
    id: 5,
    name: 'Gowtham ',
    role: 'QA Engineer',
  }
];

export default function TeamPage() {
  return (
    // .container
    <main className="flex min-h-screen w-full flex-col items-center bg-gray-50 py-16 px-8">
      
      {/* .title */}
      <h1 className="mb-2 text-4xl font-bold text-gray-900">
        Meet Our Team
      </h1>
      
      {/* .subtitle */}
      <p className="mb-12 text-xl text-gray-600">
        The talented individuals driving our success.
      </p>

      {/* .grid */}
      <div className="grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        
        {teamMembers.map((member) => (
          // .card
          <div 
            key={member.id} 
            className="flex transform flex-col items-center rounded-xl bg-white p-6 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            {/* .avatar */}
           {/* <Image
              // Corrected logic:
              // 1. Use 'member.url' if it exists.
              // 2. If 'member.url' is missing, fall back to the DiceBear URL.
              src={member.url || `https://static0.gamerantimages.com/wordpress/wp-content/uploads/2022/07/what-if-avengers-Cropped.jpg`}
              alt={`${member.name}'s avatar`}
              width={100}
              height={100}
              className="mb-4 rounded-full bg-gray-200"
            /> */}
            
            {/* .name */}
            <h2 className="text-xl font-semibold text-gray-900">
              {member.name}
            </h2>
            
            {/* .role */}
            <p className="text-gray-500">{member.role}</p>
          </div>
        ))}
      </div>
    </main>
  );
}