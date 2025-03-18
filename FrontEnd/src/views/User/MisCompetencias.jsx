import React from 'react'

import CompetenciasFilter from '../../components/competenciasFilter';
import trofeo from "/trofeo.png";

function MisCompetencias() {
  return (
    <div className="p-6 md:w-11/12 lg:w-5/6 mx-auto poppins">
          <div className="flex items-center justify-center">
            <img src={trofeo} alt="trofeo" className="lg:w-1/12 md:w-2/12 w-3/12 mr-1" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold lg:mt-12 md:mt-12 mt-3 text-start">Mis Competencias</h1>
          </div>
      <CompetenciasFilter/>

    </div>
  )
}

export default MisCompetencias
