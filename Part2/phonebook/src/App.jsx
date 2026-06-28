import { useEffect, useState } from "react";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import phoneService from "./Services/phoneBookService";

const App = () => {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    console.log("fetching");
    phoneService.getAll().then((initialList) => setPersons(initialList));
  }, []);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterVal, setFilterVal] = useState("");

  const addNewPerson = (event) => {
    event.preventDefault();

    const existingPerson = persons.find((person) => person.name === newName);
    const changedPerson = { ...existingPerson, number: newNumber };

    if (newNumber === "" || newName === "") {
      alert("Fill all the details!");
    } else if (existingPerson) {
      const confirmed = window.confirm(
        `${newName} Already exists, Replace the old number with a new one?`,
      );
      if (confirmed) {
        phoneService
          .updatePhone(existingPerson.id, changedPerson)
          .then( updatedPerson => {
                setPersons( persons.map(person => person.id ===updatedPerson.id? updatedPerson:person))
                 setNewName("");
                 setNewNumber("");
          })

      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      };
      phoneService
        .create(personObject).then((newPerson) => {
        setPersons(persons.concat(newPerson));
        setNewName("");
        setNewNumber("");
      });
    }
  };

  const handleChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilter = (event) => {
    setFilterVal(event.target.value);
  };
  const handleDelete = (id) => {
    phoneService.deletePhone(id).then(() => {
      setPersons(persons.filter((p) => p.id !== id));
    });
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleFilter={handleFilter} />

      <h2>Add a new</h2>
      <PersonForm
        addNewPerson={addNewPerson}
        newName={newName}
        handleChange={handleChange}
        newNumber={newNumber}
        handleNewNumber={handleNewNumber}
      />

      <h2>Numbers</h2>
      <Persons
        persons={persons}
        filterVal={filterVal}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default App;
