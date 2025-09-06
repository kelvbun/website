import Image from "next/image";

export default function Home() {
  return (
    <div id='container' className='h-full flex flex-col justify-center items-center mt-15 mp-15'>

      {/* about me */}
      <div id='about-me' className='w-2/5 flex flex-col mb-10'>

        <div className='mt-8'>
          <h1 className='text-2xl'>kelvin</h1>

          <div id='socials' className='flex items-center justify-between'>
            <h3>@ nyc</h3>
            <ul className='flex space-x-4'>
              <li>social 1</li>
              <li>social 2</li>
            </ul>
          </div>
        </div>

      </div>

      {/* hobbies */}
      <div id='hobbies' className='w-2/5 flex flex-col'>
        <img className='rounded-lg' src='https://images.unsplash.com/photo-1583425583779-27e82172cf05?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='' />

        <div className='rounded-xl border-2 bg-[rgb(70, 77, 81)] mt-2'>
          <h1 className='text-2xl'>hobbies</h1>

          <div className='flex items-center justify-between pb-4'>
            <h3>some shit</h3>
            <button className='border-1 rounded-full p-1 pl-4 pr-4'>click me</button>
          </div>

          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero molestiae laborum nobis officiis, quia inventore aut obcaecati iure voluptate at quas dolores eaque optio, corporis rem quam nam, repellendus omnis.</p>
        </div>

      </div>
      <div>1</div>

    </div>
  );
}
