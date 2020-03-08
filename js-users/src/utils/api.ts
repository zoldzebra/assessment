import axios from 'axios';

import { User } from '../types/User';

const API = 'https://js-assessment-backend.herokuapp.com';
const API_USERS = `${API}/users.json`;

// eslint-disable-next-line import/prefer-default-export
export const getUsers = async () => {
  try {
    const response = await axios.get(
      API_USERS,
    );
    return response.data;
  } catch (error) {
    throw new Error(`Getting users failed: ${error.message}`);
  }
};

export const getUserById = async (id: number) => {
  try {
    const response = await axios.get(
      `${API}/users/${id}.json`,
    );
    return response.data;
  } catch (error) {
    throw new Error(`Getting user by id failed: ${error.message}`);
  }
};

export const updateStatus = async (newUser: User) => {
  try {
    const response = await axios.put(
      newUser.url,
      newUser,
    );
    if (response) return true;
    return false;
  } catch (error) {
    throw new Error(`Updating status failed: ${error.message}`);
  }
};
