import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {//usa esta funcon para revisar si el usuario esta logueado en el navegador //
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
//esta configurada con la libreria axios  //
//si hay un token jwt (json web token)en el localstorage(es la base de datos local del navegador)lo agrega a la cabecera http de todas las consultas//

//use axios por mas comodidad y porque si el backend cambia de servidor ,para solo modificar un solo archivo //