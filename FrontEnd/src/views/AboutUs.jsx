import React from 'react'

import Footer from "../components/Footer"
import Header from "../components/Header"

import Natacion from "/natacion.jpg";
import Triatlon from "/Triatlon.jpg";
import Lol from "/lol.png";

function AboutUs() {
  return (
    <>
    <Header/>
    
    <div className="flex justify-center items-center text-center w-full font-bold poppins my-5">
      <h1 className="text-4xl lg:text-5xl md:text-4xl sm:text-4xl xs:text-4xl">
        Conoce a nuestro <span className="text-primary-100 animate-pulse">Equipo</span>
      </h1>
    </div>

 {/* CAMBIAR POR FOTO DE CADA UNO */}
    <div className='px-5 w-11/12 mx-auto mt-5'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>

            <div>
                <img src={Lol} alt="Juan Alvarez" className="transition hover:scale-105 duration-200 rounded-2xl" />
                <div className='grid justify-center items-center text-center poppins text-2xl font-bold mt-2'>
                    <h1 className='text-primary-400'>CEO</h1>
                    <h1>Fundador</h1>
                </div>
            </div>

            <div>
                 <img src={Lol} alt="Adolfo Ochoa" className="transition hover:scale-105 duration-200 rounded-2xl" />
                 <div className='grid justify-center items-center text-center poppins text-2xl font-bold mt-2'>
                    <h1 className='text-primary-400'>CEO</h1>
                    <h1>Fundador</h1>
                </div>
            </div>

            <div>
                 <img src={Lol} alt="Elias Guillen" className="transition hover:scale-105 duration-200 rounded-2xl" />
                 <div className='grid justify-center items-center text-center poppins text-2xl font-bold mt-2'>
                    <h1 className='text-primary-400'>CEO</h1>
                    <h1>Fundador</h1>
                </div>
            </div>

            <div>
                 <img src={Lol} alt="Esteban Eli" className="transition hover:scale-105 duration-200 rounded-2xl" />
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
                <h1 className='text-4xl poppins font-bold mb-2'>Nuestra Mision</h1>
                <p className='text-xl'> Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit explicabo corrupti illo non delectus, cumque ab saepe, qui iste eius excepturi quae beatae, iusto praesentium vero optio ipsum pariatur? Vitae!Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit explicabo corrupti illo non delectus, cumque ab saepe, qui iste eius excepturi quae beatae, iusto praesentium vero optio ipsum pariatur? Vitae!</p>
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
                    <h1 className='text-4xl poppins font-bold mb-2'>Nuestra Historia</h1>
                    <p className='text-xl'> Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit explicabo corrupti illo non delectus, cumque ab saepe, qui iste eius excepturi quae beatae, iusto praesentium vero optio ipsum pariatur? Vitae!Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit explicabo corrupti illo non delectus, cumque ab saepe, qui iste eius excepturi quae beatae, iusto praesentium vero optio ipsum pariatur? Vitae!</p>
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
