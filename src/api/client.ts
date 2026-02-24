import axios from 'axios';

const BASE_URL = 'https://au.testing.smartb.com.au/soc-api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getMatches = async (params: {
  limit: number;
  offset: number;
  timezone: string;
  tournament_ids?: string;
}) => {
  try {
    const response = await apiClient.get('/sports/matchList', {
      params: { ...params, status: 'all' },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
};

export const getAllSportsAndLeagues = async (params?: {
  search?: string;
  limit?: number;
  offset?: number;
}) => {
  try {
    const response = await apiClient.get('/sports/AllSportsAndLeagues', {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching filters:', error);
    throw error;
  }
};
