import axios from 'axios';

const API_URL = 'http://localhost:3000/viagem'; // Atualize o URL conforme sua API

export const getViagens = async () => {
  return axios.get(`${API_URL}`);
};

export const getViagemById = (id: string) => {
    return axios.get(`${API_URL}/${id}`);
  };

export const createViagem = async (viagemData: any) => {
  return axios.post(`${API_URL}`, viagemData);
};

export const updateViagem = async (id: string, viagemData: any) => {
  return axios.patch(`${API_URL}/${id}`, viagemData);
};

export const deleteViagem = async (id: string) => {
  return axios.delete(`${API_URL}/${id}`);
};

export const addDestino = async (id: string, destino: any) => {
  return axios.post(`${API_URL}/add-destino/${id}`, destino);
};


export const removeDestino = async (id: string, destino: any) => {
  return axios.post(`${API_URL}/remove-destino/${id}`, destino);
};
