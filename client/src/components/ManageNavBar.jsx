import React from 'react';
import { NavLink } from 'react-router-dom';

const ManageNavBar = () => {
  return (
    <nav style={styles.navbar}>
      <ul style={styles.navList}>
        <li style={styles.navItem}>
          <NavLink
            to="/manage/expenses"
            style={({ isActive }) => ({
              color: isActive ? 'gold' : 'white',
            })}
          >
            Expenses
          </NavLink>
        </li>
        <li style={styles.navItem}>
          <NavLink
            to="/manage/balances"
            style={({ isActive }) => ({
              color: isActive ? 'gold' : 'white',
            })}
          >
            Balances
          </NavLink>
        </li>
        <li style={styles.navItem}>
          <NavLink
            to="/manage/more"
            style={({ isActive }) => ({
              color: isActive ? 'gold' : 'white',
            })}
          >
            More
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'center',
    background: '#333',
    padding: '1rem',
  },
  navList: {
    listStyleType: 'none',
    display: 'flex',
    gap: '2rem',
    padding: 0,
    margin: 0,
  },
  navItem: {
    color: '#fff',
    textDecoration: 'none',
  },
};

export default ManageNavBar;
