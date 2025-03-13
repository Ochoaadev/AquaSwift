import logo from "/logo.png";

const Footer = () => {
  return (
    <footer className='bg-primary-700 text-center lg:text-left md:flex md:justify-center md:items-center md:flex-row flex-col mt-8 py-5'>
      <div className='flex justify-center items-center'>
        <img
          src={logo || "/placeholder.svg"}
          alt='Logo'
          className='w-36 mr-4 animate-pulse'
        />
      </div>
      <div className='mt-4 md:mt-0 md:ml-4'>
        <p>&copy; 2025 AquaSwift. Todos los derechos reservados.</p>
        <div className='mt-2 text-center'>
          <a
            href='https://github.com/Ochoaadev/AquaSwift'
            className=' hover:text-primary-200 hover:underline mr-4'
          >
            Github
          </a>
          <a
            href='https://www.figma.com/design/hLPzBs1tjFYrE3NWaJvcP5/AquaSwift?node-id=0-1&t=DdA2B8grAW50A5vQ-1'
            className=' hover:text-primary-200 hover:underline mr-4'
          >
            Figma
          </a>
          <span className='relative group'>
            <a className=' hover:text-primary-200 hover:underline hover:cursor-pointer'>
              Contacto
            </a>
            <span className='absolute z-10 bg-primary-500 text-md rounded-lg py-1 px-2 -top-10 left-1/2 transform -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
              AquaSwift@gmail.com
              <svg
                className='absolute text-primary-500 h-2 top-full left-1/2 transform -translate-x-1/2'
                x='0px'
                y='0px'
                viewBox='0 0 255 255'
                xmlSpace='preserve'
                fill='currentColor'
              >
                <polygon
                  className='fill-current'
                  points='0,0 127.5,127.5 255,0'
                />
              </svg>
            </span>
          </span>
          <div className='mt-4 flex items-center justify-center gap-3'>
            <div>
              <p className='mt-1 text-sm'>Universidad Valle Momboy</p>
              <p className='text-sm'>Facultad de Ingeniería</p>
            </div>
            <img
              src='/logouvm.png'
              alt='Logo UVM'
              className='w-12 rounded-full'
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
