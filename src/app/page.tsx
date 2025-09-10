import Image from "next/image";
import { Music, Github } from "lucide-react";

export default function Home() {
  return (
    <div id='container' className='h-full flex flex-col justify-center items-center mt-15'>

      {/* about me */}
      <div id='about-me' className='w-full flex pr-4 pl-4 sm:w-2/5 sm:p-0'>

        <div className='mt-8'>
          <h1 className='text-5xl'>Hello, I'm kelvin.</h1>
          <h3 className='mt-2'>NYC raised college student who’s passionate about programming, constantly exploring new tech, and always curious about how things work.</h3>

          <div id='socials' className='flex items-center justify-start mt-4'>
            <ul className='flex space-x-4'>
              <li><a href=""/><Github></Github></li>
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

          <div className='flex grid grid-cols-1 grid-rows-4 gap-2 sm:grid-cols-2 sm:grid-rows-2'>
            <p className='border-2 rounded-lg border-gray-200 rounded p-4'>1. sleeping!</p>
            <p className='border-2 rounded-lg border-gray-200 rounded p-4'>1. sleeping!</p>
            <p className='border-2 rounded-lg border-gray-200 rounded p-4'>1. sleeping!</p>
            <p className='border-2 rounded-lg border-gray-200 rounded p-4'>1. sleeping!</p>
          </div>
        </div>
      </div>

      {/* projects */}
      <div id='projects' className='w-full flex flex-col pr-4 pl-4 mt-8 sm:w-2/5 sm:p-0'>
        <div>
          <h1 className='text-3xl'>projects</h1>

          <div className='flex flex-col items-start justify-start pb-4 lg:flex-row lg:items-center lg:justify-between'>
            <h3 className='pl-2 border-l-2'>Here are some projects I've done.</h3>
            <button className='bg-gray-50 border-gray-200 shadow-md'>click me</button>
          </div>

          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero molestiae laborum nobis officiis, quia inventore aut obcaecati iure voluptate at quas dolores eaque optio, corporis rem quam nam, repellendus omnis.</p>
        </div>
      </div>
    </div>
  );
}
