import axios from 'axios';

import { User } from '../types/User';

export const API = 'http://js-assessment-backend.herokuapp.com';
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
  const userUrl = `${API}/users/${id}.json`;
  console.log('getUserById called');
  try {
    const response = await axios.get(
      `${API}/users/${id}.json`,
    );
    response.data.url = userUrl;
    console.log('response', response);
    return response.data;
  } catch (error) {
    throw new Error(`Getting user by id failed: ${error.message}`);
  }
};

export const updateUser = async (newUser: User) => {
  console.log('updateStatus called', newUser);
  try {
    const response = await axios.put(
      newUser.url,
      newUser,
    );
    console.log('updateStatus resp', response);
    if (response) return true;
    return false;
  } catch (error) {
    throw new Error(`Updating user failed: ${error.message}`);
  }
};

export const addNewUser = async (firstName: string, lastName: string) => {
  try {
    console.log('addNew called');
    const newUser = {
      first_name: firstName,
      last_name: lastName,
      status: 'active',
    };
    const response = await axios.post(
      API_USERS,
      newUser,
    );
    console.log('add resp', response);
  } catch (error) {
    throw new Error(`Adding user failed: ${error.message}`);
  }
};
