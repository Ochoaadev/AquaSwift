import { Link } from "react-router-dom";
import { useEffect, useState } from "react";;
import Banner from "/bannerNata.jpg";
import Acuatlon from "/Acuatlon.png";
import Ironman from "/ironman.png";
import aguaSound from "/Agua.mp3";

export default function LandingPage() {

  const [audio] = useState(new Audio(aguaSound));
  useEffect(() => {
    const enableAudio = () => {
      audio.loop = true;
      audio.volume = 0.5;

      audio.play().catch((error) => {
        console.error("Error al reproducir el audio:", error);
      });

      // Removemos los event listeners después de la primera interacción
      document.removeEventListener("mousemove", enableAudio);
      document.removeEventListener("keydown", enableAudio);
    };

    // Esperamos la primera interacción del usuario
    document.addEventListener("mousemove", enableAudio);
    document.addEventListener("keydown", enableAudio);

    return () => {
      document.removeEventListener("mousemove", enableAudio);
      document.removeEventListener("keydown", enableAudio);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);


  return (
<>
      <div className='px-5 w-11/12 mx-auto mt-5 '>
        <div className='flex justify-center items-center text-center w-full font-bold poppins my-4'>
          <h1 className='text-4xl lg:text-5xl md:text-4xl sm:text-4xl xs:text-4xl'>
            Bienvenido a{" "}
            <span className='text-primary-100 animate-pulse'>AquaSwift</span>
          </h1>
        </div>

        <div className='flex justify-center items-center'>
          <img
            src={Banner}
            alt='Banner Natacion'
            className='transition hover:scale-105 duration-200 rounded-2xl w-full h-full'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 items-center mx-auto my-5 w-11/12 '>
          <div className=''>
            <img
              src={Acuatlon}
              alt='Acuatlon'
              className='transition hover:scale-105 duration-200 rounded-2xl w-full h-auto'
            />
          </div>

          <div className='flex flex-col justify-start items-center lg:items-start md:items-start'>
            <h1 className='text-center lg:text-left md:text-left  lg:text-6xl md:text-4xl text-4xl font-bold poppins'>
              Todas tus <br />
              <span className='text-primary-100 animate-pulse'>
                competencias
              </span>{" "}
              <br />
              en un mismo <br />
              lugar
            </h1>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 items-center mx-auto my-5 w-11/12 '>
          <div className='order-1 lg:order-1 md:order-1 sm:order-2 flex flex-col justify-end items-center lg:items-end md:items-end'>
            <h1 className='text-center lg:text-right md:text-right lg:text-6xl md:text-4xl text-4xl font-bold poppins '>
              Registrate <br />
              <span className='text-primary-400 animate-pulse'>hoy </span>
              mismo <br />
            </h1>

            <Link
              to='/register'
              onClick={() => window.scrollTo(0, 0)}
              className='bg-gradient-to-r from-primary-100 to-primary-500 rounded-xl overflow-hidden mt-4 animate-bounce'
            >
              <h1 className='text-4xl px-6 py-2 poppins font-bold cursor-pointer'>
                Registro
              </h1>
            </Link>
          </div>

          <div className='lg:order-2 md:order-2 sm:order-1'>
            <img
              src={Ironman}
              alt='Acuatlon'
              className='transition hover:scale-105 duration-200 rounded-2xl w-full h-auto'
            />
          </div>
        </div>
      </div>

      </>
  );
}
