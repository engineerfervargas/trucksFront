import isEmpty from 'lodash/isEmpty';
import jwtDecode from 'jwt-decode';
import get from 'lodash/get';

const TOKEN_KEY = 'STORE_TOKEN';

export const authService = {
  saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  getToken() {
    const token = localStorage.getItem(TOKEN_KEY);
    return isEmpty(token) ? '' : `Bearer ${token}`;
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
  },
  isAuth() {
    const token = localStorage.getItem(TOKEN_KEY);

    if (isEmpty(token)) {
      return false;
    }

    if (jwtDecode(token).exp < Date.now() / 1000) {
      localStorage.removeItem(TOKEN_KEY);
      return false;
    }

    return true;
  },
  
  getUserData() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (isEmpty(token)) {
      return undefined;
    }

    const userData = jwtDecode(token);

    return {
      userUuid: get(userData, 'userUuid'),
      firstName: get(userData, 'firstName') || '',
      lastName: get(userData, 'lastName') || '',
      email: get(userData, 'email') || '',
    };
  },
};
