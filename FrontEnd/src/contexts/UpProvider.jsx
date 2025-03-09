import React, { useState, useContext, useEffect } from "react";

const itemsContext = React.createContext();
const upitemsContext = React.createContext();
export const SearchContext = React.createContext();

export function useItemsContext() {
  return useContext(itemsContext);
}

export function useUpItemsContext() {
  return useContext(upitemsContext);
}

export function useSearchContext() {
  return useContext(SearchContext);
}

export default function UpProvider({ children }) {
  const [items, setItems] = useState([]);
  const [inputSearch, setInputSearch] = useState("");

  // Función para obtener todos los datos iniciales
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/competencias"); // Cambia la URL
      const data = await response.json();
      setItems(data); // Guarda las competencias en el estado
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Función para buscar por nombre de competencia, nombre y apellido, o username
  const searchByNameOrCompetition = async () => {
    if (inputSearch === "") {
      fetchData(); // Si no hay valor de búsqueda, obtiene todos los datos
      return;
    }
    try {
      // Llama al nuevo endpoint de filtrado
      const response = await fetch(
        `http://localhost:4000/filtrar?nombreCompetencia=${inputSearch}&nombreApellido=${inputSearch}&username=${inputSearch}`
      );
      const data = await response.json();

      // Guarda los resultados en el estado
      setItems(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Obtiene los datos iniciales al cargar el componente
  useEffect(() => {
    fetchData();
  }, []);

  // Realiza la búsqueda cada vez que cambia el valor de inputSearch
  useEffect(() => {
    searchByNameOrCompetition();
  }, [inputSearch]);

  return (
    <itemsContext.Provider
      value={{
        items, 
      }}
    >
      <upitemsContext.Provider value={fetchData}>
        <SearchContext.Provider value={{ inputSearch, setInputSearch }}>
          {children} {/* Componentes hijos */}
        </SearchContext.Provider>
      </upitemsContext.Provider>
    </itemsContext.Provider>
  );
}