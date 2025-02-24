// import React, { useContext } from 'react';
// import { Navigate } from 'react-router-dom';
// import { userContext } from '../components/context/UserContext';
// import Authorization from '../components/services/Authorization';

// export const AdminRoute = ({ children }) => {
//   const {user} = useContext(userContext);
//   return user.role === 'admin' ? children : <Authorization />;
// };

// export const UserRoute = ({ children }) => {
//   const {user} = useContext(userContext);
//   if (!user || !user.userName) {
//     return <Navigate to="/app/sign-in" />;
//   };
//   return children;
// }
