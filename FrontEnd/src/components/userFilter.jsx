import { useState } from 'react';

function UserFilter({ onSearch, onSortAge, onFilterGender }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedAgeOrder, setSelectedAgeOrder] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleGenderChange = (e) => {
    setSelectedGender(e.target.value);
    onFilterGender(e.target.value);
  };

  const handleAgeSortChange = (e) => {
    setSelectedAgeOrder(e.target.value);
    onSortAge(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedGender('');
    setSelectedAgeOrder('');
    onSearch('');
    onFilterGender('');
    onSortAge('');
  };

  return (
    <div className='bg-primary-650 rounded-xl p-3 w-full lg:w-9/12 md:w-5/6 mx-auto mb-5'>
    <div className="flex flex-col justify-center items-center text-black lg:flex-row lg:items-center gap-4">
      {/* Campo de búsqueda */}
      <input
        type="text"
        placeholder="Buscar por nombre o usuario..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="border p-2 rounded-lg w-full"
      />

      {/* Contenedor flexible para filtros de género y edad */}
      <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row gap-4 w-full lg:w-auto">
        {/* Filtro por género */}
        <select
          value={selectedGender}
          onChange={handleGenderChange}
          className="border p-2 rounded-lg md:w-1/2 "
        >
          <option value="">Todos</option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
        </select>

        {/* Ordenar por edad */}
        <select
          value={selectedAgeOrder}
          onChange={handleAgeSortChange}
          className="border p-2 rounded-lg  md:w-1/2 "
        >
          <option value="">Edad</option>
          <option value="asc">Menor a mayor</option>
          <option value="desc">Mayor a menor</option>
        </select>
      </div>

      {/* Botón para limpiar filtros */}
      <button
        onClick={handleClearFilters}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition lg:w-auto"
      >
        Limpiar
      </button>
    </div>
    </div>
  );
}

export default UserFilter;
