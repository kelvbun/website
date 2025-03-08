import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="w-[600px] bg-white rounded shadow-lg overflow-hidden">
        {/* URL Bar */}
        <div className="bg-gray-100 p-2 text-right text-sm text-gray-500">
          kelvin.social
        </div>

        {/* Navigation */}
        <div className="flex">
          <button className="bg-neutral-900 text-white px-6 py-2">home</button>
        </div>

        {/* Main Content */}
        <div className="flex p-8 bg-gray-50">
          {/* Character Image */}
          <div className="w-48 h-48 bg-neutral-900 mr-8 relative">
            <Image 
              src="/pfp.png" 
              alt="profile picture"
              layout="fill"
              className="object-cover"
            />
          </div>

          {/* Character Info */}
          <div className="flex-1">
            <h1 className="text-3xl mb-4 font-mono tracking-tight">kelvin</h1>
            <p className="text-sm text-gray-600 mb-4">
              spotify addict<br />
              <span className="text-gray-400">@ nyc</span>
            </p>
            <p className="text-sm text-gray-600">
              college student,<br />
              learning to code &<br />
              exploring new tech.<br />
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 flex items-center">
          <span className="text-sm text-gray-600">made with &lt;3</span>
        </div>
      </div>
    </div>
  );
}
