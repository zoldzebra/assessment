import axios from 'axios';

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
    throw new Error('Getting users failed.');
  }
};
