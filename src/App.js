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
import Username from './components/username/Username';

const isCorrect = (name) => name && /^[a-zA-Z]{3,15}$/.test(name);

const CheckUsername = ({ children }) => {
  const { username, isAuth } = useAuth();
  return isAuth && !isCorrect(username) ? (
    <Navigate to="/username" replace />
  ) : (
    children
  );
};

const ProtectedSignIn = ({ children }) => {
  const { isAuth } = useAuth();
  return !isAuth ? children : <Navigate to="/profile" replace />;
};

const ProtectedUsername = ({ children }) => {
  const { username } = useAuth();
  return !isCorrect(username) ? children : <Navigate to="/profile" replace />;
};

const ProtectedProfile = ({ children }) => {
  const { username, isAuth } = useAuth();
  if (!isAuth) return <Navigate to="/signin" replace />;
  if (!isCorrect(username)) return <Navigate to="/username" replace />;
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
      {
        index: true,
        element: (
          <CheckUsername>
            <Main />
          </CheckUsername>
        ),
      },
      {
        path: 'leaderboard',
        element: (
          <CheckUsername>
            <Leaderboard />
          </CheckUsername>
        ),
      },
      {
        path: 'signin',
        element: (
          <ProtectedSignIn>
            <SignIn />
          </ProtectedSignIn>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedProfile>
            <Profile />
          </ProtectedProfile>
        ),
      },
      {
        path: 'username',
        element: (
          <ProtectedUsername>
            <Username />
          </ProtectedUsername>
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
