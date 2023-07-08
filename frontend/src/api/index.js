import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://gnosisapi.nftscan.com/api/v2/account/own/', // ваш базовый URL API
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-API-KEY': 'UVhFp1C49d5KZClQaYhKUHn2'
  }
});

export default {
  async getItems(address) {
    try {
      const response = await apiClient.get(address + '?erc_type=erc721&show_attribute=false');
      return response.data;
    } catch (error) {
      throw new Error(`[RWV] ApiService ${error}`);
    }
  }
};