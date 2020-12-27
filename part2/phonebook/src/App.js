import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import {PersonForm, Persons} from './components/persons'


const Filter = ({filter, setFilter}) => <div><input value={filter} onChange={(event) => {setFilter(event.target.value)}}/></div>

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={`notification ${message.error ? 'error' : 'success'}`}>
      {message.text}
    </div>
  )
}

const App = () => {

  const [ persons, setPersons ] = useState([]);
  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber] = useState('');
  const [ filter, setFilter ] = useState('');
  const [message, setMessage] = useState(null)



  useEffect(() => {personService.getAll().then(returnedPersons => setPersons(returnedPersons));}, []);
  const addPerson = (event) => {
    event.preventDefault();
    const foundPerson = persons.find((person) => person.name === newName);
    if (!foundPerson) {
      personService.create({name: newName, number: newNumber})
        .then(newPerson => {
          setPersons(persons.concat(newPerson));
          setNewName('');
          setNewNumber('');
          setMessage(
            {
            text: `Person '${newPerson.name}' successfully added!`,
            error: false
          })
          setTimeout(() => {
            setMessage(null)
          }, 5000)
      });
    } else {
      const newPerson = foundPerson;
      newPerson.number = newNumber;
      personService.update(foundPerson.id, {...foundPerson, number: newNumber})
        .then(newPerson => {
          setPersons(persons.map(person => person.id !== newPerson.id ? person : newPerson));
          setNewNumber('');
          setNewName('');
          setMessage(
            {
            text: `Person '${newPerson.name}' successfully updated!`,
            error: false
          })
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          setMessage(
            {
            text: `Person '${newPerson.name}' was already removed from server`,
            error: true
          })
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
  }

  const removePerson = (toDelete) => {
    if (!window.confirm(`Do you really want to delete ${toDelete.name}?`)) {
      return;
    }
    personService.remove(toDelete.id)
      .then(response => {
        console.log(response);
        setPersons(persons.filter(person => person.id !== toDelete.id));
      })
      .catch(error => {
        alert(`Failed in deleting: ${toDelete.name}`)
      });
  }

  const toShow = persons.filter(person => person.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message}/>
      <Filter filter={filter} setFilter={setFilter}/>
      <h2>Add new</h2>
      <PersonForm addPerson={addPerson} newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber}/>
      <h2>Numbers</h2>
      <Persons persons={toShow} deleteHandler={removePerson}/>
    </div>
  )
}

export default App