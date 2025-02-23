import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from 'axios';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Get the token from localStorage

  if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Attach token to Authorization header
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});