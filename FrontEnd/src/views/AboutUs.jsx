import React from 'react'

import Footer from "../components/Footer"
import Header from "../components/Header"

import Natacion from "/natacion.jpg";
import Triatlon from "/Triatlon.jpg";
import adolfo from "/adolfo.jpeg";
import elias from "/elias.jpeg";
import esteban from "/esteban.jpeg";
import juan from "/juan.png";

function AboutUs() {
  return (
    <>
    <Header/>
    
    <div className="flex justify-center items-center text-center w-full font-bold poppins my-5">
      <h1 className="text-4xl lg:text-5xl md:text-4xl sm:text-4xl xs:text-4xl">
        Conoce a nuestro <span className="text-primary-100 animate-pulse">Equipo</span>
      </h1>
    </div>

    <div className='px-5 w-11/12 mx-auto mt-5'>
  <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
    
    {/* Juan Alvarez */}
    <div>
      <div className="relative overflow-hidden transition hover:scale-105 duration-200 rounded-2xl group">
        <img
          src={juan}
          alt="Juan Alvarez"
          className="rounded-2xl"
        />
        <div className="absolute inset-0 flex items-end justify-center p-4 bg-primary-500 bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-200">
          <span className="text-white text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Juan Alvarez
          </span>
        </div>
      </div>
      <div className='grid justify-center items-center text-center poppins text-2xl font-bold mt-2'>
        <h1 className='text-primary-400'>CEO</h1>
        <h1>Fundador</h1>
      </div>
    </div>

    {/* Adolfo Ochoa */}
    <div>
      <div className="relative overflow-hidden transition hover:scale-105 duration-200 rounded-2xl group">
        <img
          src={adolfo}
          alt="Adolfo Ochoa"
          className="rounded-2xl"
        />
        <div className="absolute inset-0 flex items-end justify-center p-4 bg-primary-500 bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-200">
          <span className="text-white text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Adolfo Ochoa
          </span>
        </div>
      </div>
      <div className='grid justify-center items-center text-center poppins text-2xl font-bold mt-2'>
        <h1 className='text-primary-400'>CEO</h1>
        <h1>Fundador</h1>
      </div>
    </div>

    {/* Elias Guillen */}
    <div>
      <div className="relative overflow-hidden transition hover:scale-105 duration-200 rounded-2xl group">
        <img
          src={elias}
          alt="Elias Guillen"
          className="rounded-2xl"
        />
        <div className="absolute inset-0 flex items-end justify-center p-4 bg-primary-500 bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-200">
          <span className="text-white text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Elias Guillen
          </span>
        </div>
      </div>
      <div className='grid justify-center items-center text-center poppins text-2xl font-bold mt-2'>
        <h1 className='text-primary-400'>CEO</h1>
        <h1>Fundador</h1>
      </div>
    </div>

    {/* Esteban Eli */}
    <div>
      <div className="relative overflow-hidden transition hover:scale-105 duration-200 rounded-2xl group">
        <img
          src={esteban}
          alt="Esteban Eli"
          className="rounded-2xl"
        />
        <div className="absolute inset-0 flex items-end justify-center p-4 bg-primary-500 bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-200">
          <span className="text-white text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Esteban Eli
          </span>
        </div>
      </div>
      <div className='grid justify-center items-center text-center poppins text-2xl font-bold mt-2'>
        <h1 className='text-primary-400'>CEO</h1>
        <h1>Fundador</h1>
      </div>
    </div>
  </div>
</div>

    <div className='px-5 w-11/12 mx-auto mt-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-5 '>

            <div className="flex flex-col justify-center items-center text-center">
                <h1 className='text-4xl poppins font-bold mb-2 animate-bounce'>Nuestra Mision</h1>
                <p className='text-xl'> Queremos ser la plataforma líder global para la gestión de competencias de natación, acuatlón y triatlón, inspirando a personas de todos los niveles a llevar un estilo de vida activo y saludable. Buscamos conectar a atletas, entrenadores y organizadores, fomentando valores como la perseverancia y la excelencia, y creando una comunidad inclusiva donde cada participante encuentre el apoyo necesario para alcanzar sus metas y superar sus límites.

</p>
            </div>

            <div className="">
                <img src={Natacion} alt="Natacion" className="mx-auto transition hover:scale-105 duration-200 rounded-2xl lg:w-10/12 md:w-11/12" />
            </div>

      

      </div>
    </div>
    
    
    <div className='px-5 w-11/12 mx-auto mt-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-5 '>

            <div className="order-1 lg:order-1 md:order-2 sm:order-2">
                <img src={Triatlon} alt="Acuatlon" className="mx-auto transition hover:scale-105 duration-200 rounded-2xl lg:w-10/12 md:w-11/12" />
            </div>

            < div className="flex flex-col justify-center items-center lg:order-2 md:order-1 sm:order-1 ">
                <div className="text-center">
                    <h1 className='text-4xl poppins font-bold mb-2 animate-bounce'>Nuestra Historia</h1>
                    <p className='text-xl'> Nuestra plataforma surgió de la pasión por los deportes acuáticos y de resistencia, como la natación, el acuatlón y el triatlón. Un grupo de entusiastas identificó la necesidad de una herramienta centralizada para gestionar competencias, y así nació este espacio que hoy conecta a atletas, organizadores y aficionados de todo el mundo. Con el tiempo, nos convertimos en un referente que no solo registra resultados, sino que celebra el esfuerzo de quienes forman parte de esta comunidad.</p>
                </div>
            </div>

      </div>
    </div>

    <div className="flex justify-center items-center text-center px-5 w-full font-bold poppins my-5">
        <h1 className="text-3xl lg:text-4xl md:text-3xl sm:text-3xl">
            Un placer en <span className="text-primary-400 animate-pulse">conocerte</span>!
        </h1>
    </div>

    <div className="flex justify-center items-center text-center px-5 w-full font-bold poppins my-5">
        <h1 className="text-center lg:text-6xl md:text-5xl text-4xl font-bold poppins ">
            Conviertete en un <br />
            <span className="text-primary-100 animate-pulse">atleta </span> de elite <br />
            con nosotros! <br />
        </h1>
    </div>

    <Footer/>
    </>
  )
}

export default AboutUs
