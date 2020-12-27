import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    return axios.get(baseUrl).then(response => response.data);
}

const create = (person) => {
    return axios.post(baseUrl, person).then(response => response.data);
}

const remove = (id) => {
    return axios.delete(`${baseUrl}/${id}`);
}

const update = (id, newPerson) => {
    const request = axios.put(`${baseUrl}/${id}`, newPerson)
    return request.then(response => response.data)
};

const noteService = {getAll, create, remove, update};
export default noteService;