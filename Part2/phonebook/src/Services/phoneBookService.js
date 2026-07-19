import axios from "axios";
const baseUrl = "api/persons"

const getAll = () => {
    const request =  axios.get(baseUrl)
    return request.then(response => response.data)
}
const create = (personObject) => {
    const request = axios.post(baseUrl,personObject)
    return request.then(response => response.data)
}
const deletePhone = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}
const updatePhone = (id, changedPerson) => {
    const request = axios.put(`${baseUrl}/${id}`, changedPerson)
    return request.then(response => response.data)
}
export default {getAll, create, deletePhone, updatePhone}