import { createContext, useState, useEffect } from 'react';
import { getUserById } from '../services/Api';

export const userContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserById(user._id)
      .then(response => {
        setUser(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
      setLoading(true);
  }, []);

  if (loading) {
    return null; 
  }

  return (
    <userContext.Provider value={{user, setUser}}>
      {children}
    </userContext.Provider>
  );
};
