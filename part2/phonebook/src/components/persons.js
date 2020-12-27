import React from 'react'


const Persons = ({persons, deleteHandler}) => <div>{persons.map(person => <Person person={person} key={person.name} deleteHandler={deleteHandler}/>)}</div>

const Person = ({person, deleteHandler}) => {
  return(<div>{person.name} {person.number} <button onClick={() => {deleteHandler(person)}}>delete</button></div>)
}

const PersonForm = ({addPerson, newName, setNewName, newNumber, setNewNumber}) => {
    return(
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={(event) => {setNewName(event.target.value)}}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={(event) => {setNewNumber(event.target.value)}}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}


export {Persons, PersonForm};