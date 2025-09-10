import Image from "next/image";
import { Music, Github } from "lucide-react";

export default function Home() {
  return (
    <div id='container' className='h-full flex flex-col justify-center items-center mt-15'>

      {/* about me */}
      <div id='about-me' className='w-full flex pr-4 pl-4 sm:w-2/5 sm:p-0'>

        <div className='mt-8'>
          <h1 className='text-5xl'>Hello, I'm <span className='text-black bg-gray-50 rounded-lg pl-2 pr-2'>kelvin</span>.</h1>

          <div id='socials' className='flex flex-col items-start space-y-4 bg-gray-50 rounded-lg p-4 mt-4'>
            <h3 className='mt-2'>NYC raised college student who’s passionate about programming, constantly exploring new tech, and always curious about how things work.</h3>

            <ul className='flex space-x-4'>
              <li><a href=""/><Github></Github></li>
              <li><a href=""/><Music></Music></li>
              <li><a href=""/><Music></Music></li>
              <li><a href=""/><Music></Music></li>
            </ul>
          </div>
        </div>

      </div>

      {/* hobbies */}
      <div id='hobbies' className='w-full flex flex-col pr-4 pl-4 mt-8 sm:w-2/5 sm:p-0'>
        <div>
          <h1 className='text-3xl'>hobbies</h1>

          <div className='flex items-center justify-between pb-4'>
            <h3 className='pl-2 border-l-2'>Here are some hobbies I enjoy.</h3>
            <button className='cursor-not-allowed hidden'>click me</button>
          </div>

          <div className="grid grid-cols-6 grid-rows-2 overflow-hidden gap-4">
            <div className="col-span-4 row-span-2 bg-gray-50 rounded-lg p-4">
              Big Box
            </div>

            <div className="col-span-1 row-span-1 bg-gray-50 rounded-lg p-4">Left Top</div>
            <div className="col-span-1 row-span-1 bg-gray-50 rounded-lg p-4">Right Top</div>
            <div className="col-span-1 row-span-1 bg-gray-50 rounded-lg p-4">Right Bottom</div>
            <div className="col-span-1 row-span-1 bg-gray-50 rounded-lg p-4">Right Bottom</div>

            <div className="col-span-2 row-span-1 p-4 bg-gray-50 rounded-lg">Small 1</div>
            <div className="col-span-2 row-span-1 p-4 bg-gray-50 rounded-lg">Small 2</div>
            <div className="col-span-2 row-span-1 p-4 bg-gray-50 rounded-lg">Small 3</div>
          </div>

        </div>
      </div>

      {/* projects */}
      <div id='projects' className='w-full flex flex-col pr-4 pl-4 mt-8 sm:w-2/5 sm:p-0'>
        <div>
          <h1 className='text-3xl'>projects</h1>

          <div className='flex flex-col items-start justify-start pb-4 lg:flex-row lg:items-center lg:justify-between'>
            <h3 className='pl-2 border-l-2'>Here are some projects I've done.</h3>
            <button className='cursor-not-allowed hidden'>click me</button>
          </div>

          <div className='grid grid-cols-1 grid-rows-4 gap-2 sm:grid-cols- sm:grid-rows-2'>
            <p className='bg-gray-50 rounded-lg p-4'>1. sleeping!</p>
            <p className='bg-gray-50 rounded-lg p-4'>1. sleeping!</p>
            <p className='bg-gray-50 rounded-lg p-4'>1. sleeping!</p>
            <p className='bg-gray-50 rounded-lg p-4'>1. sleeping!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
