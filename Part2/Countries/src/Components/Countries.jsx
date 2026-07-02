const Countries = (props) => {
     const matches = props.countriesList
         .filter((country)=>country.name.common.toLowerCase().includes(props.filterValue.toLowerCase()))
    if(matches.length>10){
        return (<p>too many matches, specify another filter</p>)
    }
    if(matches.length >= 2){
        return (
            <div>
                {matches.map(match => <li key={match.name.common}>{match.name.common}</li>)}
            </div>
        )
    }
    if(matches.length === 1 ){
        return(
            <div>
                 <h1>{matches[0].name.common} </h1>
                 <p>Capital {matches[0].capital} <br></br>Area {matches[0].area}</p>
                <h3>Languages</h3>
                <ul>
                {Object.values(matches[0].languages).map(language => <li key={language}>{language}</li>)}
                </ul>
                <img src={matches[0].flags.png} alt="" />
     
            </div>
        )
    }
    if(matches.length ===0){
        return(
            <div>No Country Found</div>
        )
    }
}

export default Countries