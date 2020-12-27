import React from 'react'

const Countries = ({countries, setFilter}) => {
    if (countries.length > 10) {
      return (
        <div>There are too many matches, specify another filter</div>
      )
    } else if (countries.length !== 1) {
      return (
        <div>{countries.map(country => <CountrySimple country={country} key={country.name} setFilter={setFilter}/>)}</div>
      )
    } else {
      return (
        <CountryDetailed country={countries[0]}/>
      )
    }
  }
  
  const CountrySimple = ({country, setFilter}) => {
    return(<p>{country.name} <button onClick={() => {setFilter(country.name)}}>Show</button></p>)
  }
  
  const CountryDetailed = ({country}) => {
    return (
      <div>
        <h2>{country.name}</h2>
        <p>capital: {country.capital}</p>
        <p>population: {country.population}</p>
        <h2>Languages</h2>
        <ul>
          {country.languages.map(language => 
          <li key={language.name}>
            {language.name}
          </li>)}
        </ul>
        <img src={country.flag} alt='Flag' width="200"/>
      </div>
    )
  }


export {Countries}