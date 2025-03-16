import React, { useState, useContext, useEffect } from "react";

const itemsContext = React.createContext();
const upitemsContext = React.createContext();
export const SearchContext = React.createContext();
export const CategoriasContext = React.createContext();

export function useItemsContext() {
  return useContext(itemsContext);
}

export function useUpItemsContext() {
  return useContext(upitemsContext);
}

export function useSearchContext() {
  return useContext(SearchContext);
}

export function useCategoriasContext() {
  return useContext(CategoriasContext); // Hook para acceder a las categorías
}

export default function UpProvider({ children }) {
  const [items, setItems] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  const [categorias, setCategorias] = useState([]); // Estado para categorías

  // Función para obtener todas las competencias
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/competencias");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Función para obtener categorías por modalidad
  const fetchCategorias = async (modalidad) => {
    try {
      const response = await fetch(`http://localhost:4000/api/categorias?modalidad=${modalidad}`);
      const data = await response.json();
      setCategorias(data); // Guarda las categorías filtradas en el estado
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  // Obtiene los datos iniciales al cargar el componente
  useEffect(() => {
    fetchData();
    fetchCategorias(""); // Carga categorías de Natación por defecto
  }, []);

  return (
    <itemsContext.Provider value={{ items }}>
      <upitemsContext.Provider value={{ fetchData, setItems }}>
        <SearchContext.Provider value={{ inputSearch, setInputSearch }}>
          <CategoriasContext.Provider value={{ categorias, fetchCategorias }}>
            {children}
          </CategoriasContext.Provider>
        </SearchContext.Provider>
      </upitemsContext.Provider>
    </itemsContext.Provider>
  );
}