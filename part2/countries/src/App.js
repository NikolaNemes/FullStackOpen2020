import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Countries } from './components/countries'

const Filter = ({filter, setFilter}) => <div>find countries <input value={filter} onChange={(event) => {setFilter(event.target.value)}}/></div>

const App = () => {

  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, []);

  const toShow = countries.filter(country => country.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));

  return (
    <div>
      <h2>Filter</h2>
      <Filter filter={filter} setFilter={setFilter}/>
      <h2>Countries</h2>
      <Countries countries={toShow} setFilter={setFilter}/>
    </div>
  )
}

export default App