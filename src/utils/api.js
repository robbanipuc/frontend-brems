// src/utils/api.js
import axios from 'axios';

const api = axios.create({
    // If VITE_API_URL exists, use it. Otherwise use localhost.
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});
// ... rest of your code