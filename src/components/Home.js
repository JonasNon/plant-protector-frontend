import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [usernames, setUsernames] = useState([]); // State to store the fetched usernames


  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3036/users', { username, password });

      if (response.data.success) {
        setMessage('User created successfully');
        fetchUsernames();  // Refresh the usernames list after registration
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        setMessage(error.response.data.error);  // Display the backend error (e.g., "Username already exists")
      } else {
        setMessage('An error occurred while creating the user');
      }
    }
  };

  // Function to fetch all usernames from the server
  const fetchUsernames = async () => {
    try {
      
      const response = await axios.get('http://localhost:3036/users');
      console.log(response.data)
      setUsernames(response.data); // Store usernames in the state
    } catch (error) {
      console.error('Error fetching usernames:', error);
    }
  };

  // Fetch usernames when the component mounts
  useEffect(() => {
    fetchUsernames();
  }, []);

  return (
    <div className="card-container" style={{ backgroundColor: "green", height: "100vh", width: "100vw" }}>
      <button onClick={() => { console.log(usernames) }}>test</button>
      <div>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Register</button>
        </form>
        {message && <p>{message}</p>}
      </div>

      {/* Display the list of usernames */}
      <div>
        <h2>Usernames:</h2>
        <ul>
          {usernames.map((user, index) => (
            <li key={index}>{user.username}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;