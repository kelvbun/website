import Image from "next/image";

export default function Home() {
  return (
    <div id='container' className='h-full flex flex-col justify-center items-center mt-15 mp-15'>

      {/* about me */}
      <div id='about-me' className='w-2/5 flex'>

        <div className='mt-8'>
          <h1 className='text-5xl'>Hello, I'm kelvin.</h1>
          <h3 className='mt-2'>An NYC raised, often dumbfounded college student who’s passionate about programming, constantly exploring new tech, and always curious about how things work.</h3>

          <div id='socials' className='flex items-center justify-start mt-2'>
            <ul className='flex space-x-4'>
              <li><button><a className='fa-brands fa-github fa-lg' href=""/></button></li>
              <li><button><a className='fa-brands fa-spotify fa-lg' href=""/></button></li>
            </ul>
          </div>
        </div>

      </div>

      {/* hobbies */}
      <div id='hobbies' className='w-2/5 flex flex-col mt-8'>
        <div>
          <h1 className='text-3xl'>hobbies</h1>

          <div className='flex items-center justify-between pb-4'>
            <h3>Here are some hobbies I enjoy.</h3>
            <button>click me</button>
          </div>

          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero molestiae laborum nobis officiis, quia inventore aut obcaecati iure voluptate at quas dolores eaque optio, corporis rem quam nam, repellendus omnis.</p>
        </div>
      </div>

      {/* projects */}
      <div id='projects' className='w-2/5 flex flex-col mt-8'>
        <div>
          <h1 className='text-3xl'>projects</h1>

          <div className='flex items-center justify-between pb-4'>
            <h3>Here are some projects I've done.</h3>
            <button>click me</button>
          </div>

          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero molestiae laborum nobis officiis, quia inventore aut obcaecati iure voluptate at quas dolores eaque optio, corporis rem quam nam, repellendus omnis.</p>
        </div>
      </div>
    </div>
  );
}
