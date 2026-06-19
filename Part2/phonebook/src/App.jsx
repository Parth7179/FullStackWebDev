import { useState } from 'react'
const Person = ({person}) => {
  return(
    <li>{person.name}</li>
  )
}
const App = () => {
  const [persons, setPersons] = useState([{ name: 'Arto Hellas' }]) 
  const [newName, setNewName] = useState('') 

  const addNewPerson = (event) =>{
    event.preventDefault()
    const nameExists = persons.some(persons =>persons.name === newName)
    if(nameExists){
      alert(`${newName} already exists in phonebook.`)
    }else{
      const personObject = {
        name: newName
      }
      setPersons(persons.concat(personObject))
      setNewName('')
    }
  }
  const handleChange = (event) => {
    setNewName(event.target.value)
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addNewPerson}>
        <div>
          name: <input value={newName} onChange={handleChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map((person)=>(
          <Person key={person.name} person={person} />
        ))}
      </ul>
    </div>
  )
}

export default App
