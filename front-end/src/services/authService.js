// src/services/authService.js

const API_BASE_URL = 'http://127.0.0.1:8000';

export const loginUser = async (credentials) => {
  const url = `${API_BASE_URL}/auth/login`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      username: credentials.username,
      password: credentials.password,
      grant_type: 'password',
      scope: '',
      client_id: '',
      client_secret: ''
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Login failed:', errorText);
    throw new Error(`Erreur ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data;
};
