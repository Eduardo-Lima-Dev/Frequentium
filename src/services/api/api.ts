import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://frequentium-backend-ykmc.onrender.com',
    headers: {
        'Content-Type': 'application/json'
    }
}); 