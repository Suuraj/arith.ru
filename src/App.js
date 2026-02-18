import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from 'react-router-dom';
import Leaderboard from './components/leaderboard/Leaderboard';
import Main from './components/main/Main';
import Menu from './components/menu/Menu';
import Profile from './components/profile/Profile';
import SignIn from './components/signIn/SignIn';
import { AuthProvider, useAuth } from './context/AuthProvider';
import Username from './components/Username/Username';

const ProtectedRoute = ({ children }) => {
  const { username, isAuth } = useAuth();
  if (!isAuth) return <Navigate to="/signin" />;
  if (!username) return <Navigate to="/username" />;
  if (username) return <Navigate to="/profile" />;
  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <header>
          <Menu />
        </header>
        <Outlet />
        <footer></footer>
      </>
    ),
    children: [
      { index: true, element: <Main /> },
      { path: 'leaderboard', element: <Leaderboard /> },
      { path: 'signin', element: <SignIn /> },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'username',
        element: (
          <ProtectedRoute>
            <Username />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
