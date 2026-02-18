import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Menu.module.css';
import { useAuth } from '../../context/AuthProvider';

const Menu = () => {
  const { isAuth } = useAuth();

  return (
    <nav id={styles.menu}>
      <ul>
        <li>
          <NavLink
            end
            to="/"
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              {/* <path d="M 0 1 V 15 H 3 V 1 H 0 M 13 1 V 15 H 16 V 1 H 13 Z M 5 7 H 7 V 5 H 9 V 7 H 11 V 9 H 9 V 11 H 7 V 9 H 5 V 7" /> */}
              <path d="m 8 3.293 l 6 6 V 13.5 a 1.5 1.5 0 0 1 -1.5 1.5 h -9 A 1.5 1.5 0 0 1 2 13.5 V 9.293 l 6 -6 z" />
              <path d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z" />
            </svg>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/leaderboard"
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="m 1 10 h 4 v 5 H 1 v -5 z M 6 1 h 4 v 14 H 6 V 1 z m 5 5 h 4 v 9 h -4 V 6 z" />
            </svg>
          </NavLink>
        </li>
        <li>
          <NavLink
            to={isAuth ? '/profile' : '/signin'}
            className={({ isActive }) => (isActive ? styles.active : undefined)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
            </svg>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
