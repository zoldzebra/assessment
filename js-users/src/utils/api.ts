/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios';

import { User } from '../types/User';

export const API = 'http://js-assessment-backend.herokuapp.com';
const API_USERS = `${API}/users.json`;

export const getUsers = async () => {
  try {
    const response = await axios.get(
      API_USERS,
    );
    const users = response.data;
    users.sort((a: User, b: User) => a.id - b.id);
    return users;
  } catch (error) {
    throw new Error(`Getting users failed: ${error.message}`);
  }
};

export const getUserById = async (id: number) => {
  const userUrl = `${API}/users/${id}.json`;
  try {
    const response = await axios.get(
      `${API}/users/${id}.json`,
    );
    response.data.url = userUrl;
    return response.data;
  } catch (error) {
    throw new Error(`Getting user failed: ${error.message}`);
  }
};

export const updateUser = async (newUser: User) => {
  try {
    const response = await axios.put(
      newUser.url,
      newUser,
    );
    if (response && response.status >= 200 && response.status < 300) return true;
    // eslint-disable-next-line no-console
    console.error(response);
    return false;
  } catch (error) {
    throw new Error(`Updating user failed: ${error.message}`);
  }
};

export const addNewUser = async (firstName: string, lastName: string) => {
  try {
    const newUser = {
      first_name: firstName,
      last_name: lastName,
      status: 'active',
    };
    const response = await axios.post(
      API_USERS,
      newUser,
    );
    return response;
  } catch (error) {
    throw new Error(`Adding user failed: ${error.message}`);
  }
};
