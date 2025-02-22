import Footer from "./components/footer"
import Header from "./components/Header"
import Banner from "/bannerNata.jpg"

export default function App() {
  return (
    <>

    <Header/>

    <div className="px-5">

    <div className="flex justify-center items-center text-center w-full font-bold poppins my-4">
      <h1 className="text-3xl lg:text-5xl md:text-4xl sm:text-4xl xs:text-4xl">
        Bienvenido a <span className="text-primary-100">AquaSwift</span>
      </h1>
    </div>

    <div className="flex justify-center items-center">
      <img src={Banner} alt="Banner Natacion" className="rounded-2xl w-full h-full" />
    </div>


    </div>

    <Footer/>
    </>
  )
}