import React from 'react'

const Search = ({searchTerm, setSearchTerm}) => {
    
  return (
    <div className="search">
      <div>
        <img src='search.svg'></img>
        <input
          type="text"
          placeholder="Search Movie"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  )
}

export default Search
