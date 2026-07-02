import { useEffect, useState } from "react";
import countryService from "./Services/countryService";
import Countries from './Components/Countries'
import Filter from './Components/Filter'
const App = () => {
  const [countriesList, setCountriesList] = useState([]);
  const [filterValue, setFilterValue] = useState('')
  useEffect(() => {
    countryService
    .getAll()
    .then((countrydata) => {
      setCountriesList(countrydata);
    });
   
  }, []);
  
  const handleFilter = (event) => {
    setFilterValue(event.target.value)
  }

  return (
    <div>
      <Filter filterValue={filterValue} handleFilter = {handleFilter}/>
      <Countries filterValue={filterValue} countriesList={countriesList} />
    </div>
  )
};
export default App;
