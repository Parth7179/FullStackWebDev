const Filter = (props) => {
return(
    <div>
        Find Country
        <input value={props.filterValue} onChange={props.handleFilter} />
    </div>
)
}
export default Filter