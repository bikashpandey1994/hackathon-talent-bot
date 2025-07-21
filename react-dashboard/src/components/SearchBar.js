import React from 'react';
import '../css/SearchBar.css';

const SearchBar = ({ search, setSearch }) => (
  <input
    type="text"
    placeholder="Search..."
    value={search}
    onChange={e => setSearch(e.target.value)}
    className="searchbar-input"
  />
);

export default SearchBar;
