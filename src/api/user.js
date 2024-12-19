import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://127.0.0.1:8080/',
    timeout: 1000,
});

const createUser = async (user) => {
    try {
        const response = await instance.post('/users/create', user);
        return response;
    } catch (error) {
        console.error(error);
    }
}

const login = async (user) => {
    try {
        const response = await instance.post('/users/login', user);
        return response;
    } catch (error) {
        console.error(error);
    }
}

const getUser = async (id) => {
    try {
        const response = await instance.get(`/users/${id}`);
        return response;
    } catch (error) {
        console.error(error);
    }
}

const updateUser = async (id, user) => {
    try {
        const response = await instance.patch(`/users/${id}`, user);
        return response;
    } catch (error) {
        console.error(error);
    }
}

export {
    createUser,
    login,
    getUser,
    updateUser,
}