import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Users = () => {

	
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/users')
      .then(response => {setUsers(response.data)})
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map(user => <li key={user.id}>nom : {user.nom}</li>)}
      </ul>
    </div>
  );
};

export default Users;
