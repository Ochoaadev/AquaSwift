import React from 'react'
import { Link } from 'react-router-dom';


function header() {
  return (
    <div className='bg-primary-500 h-24 flex items-center justify-center'>

      <Link  to={"/"}>
              <h1  className="text-lg px-1 py-2 poppins font-bold cursor-pointer">Home</h1>  
      </Link>

      <Link  to={"/AboutUs"}>
              <h1  className="text-lg px-1 py-2 poppins font-bold cursor-pointer">AboutUs</h1>  
      </Link>
      
      <Link  to={"/register"}>
              <h1  className="text-lg px-1 py-2 poppins font-bold cursor-pointer">Registro</h1>  
      </Link>

      <Link  to={"/login"}>
              <h1  className="text-lg px-1 py-2 poppins font-bold cursor-pointer">Login</h1>  
      </Link>
    </div>

    
  )
}

export default header
