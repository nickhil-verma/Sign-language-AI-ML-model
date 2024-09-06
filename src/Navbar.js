import React from 'react';

const Navbar = () => {
  return (
    <div style={styles.navbar}>
      <div style={styles.logo}>Zephyr</div>
      <ul style={styles.navItems}>
        <li style={styles.navItem}>About</li>
      </ul>
    </div>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    width: '90%',
    top: 0,
    left: 0,
    position: 'fixed',
    backgroundColor: 'black',
    color: 'white',
    zIndex: 1000,
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    textShadow: '0 0 10px #00f, 0 0 20px #00f, 0 0 30px #00f, 0 0 40px #00f, 0 0 50px #00f, 0 0 60px #00f, 0 0 70px #00f', 
    animation: 'pulse 2s infinite', // Pulsating animation
  },
  navItems: {
    listStyleType: 'none',
    display: 'flex',
    margin: 0,
    padding: 0,
  },
  navItem: {
    marginLeft: '20px',
    cursor: 'pointer',
  },
  '@keyframes pulse': {
    '0%': {
      textShadow: '0 0 10px #00f, 0 0 20px #00f, 0 0 30px #00f, 0 0 40px #00f, 0 0 50px #00f, 0 0 60px #00f, 0 0 70px #00f',
    },
    '50%': {
      textShadow: '0 0 20px #00f, 0 0 40px #00f, 0 0 60px #00f, 0 0 80px #00f, 0 0 100px #00f, 0 0 120px #00f, 0 0 140px #00f',
    },
    '100%': {
      textShadow: '0 0 10px #00f, 0 0 20px #00f, 0 0 30px #00f, 0 0 40px #00f, 0 0 50px #00f, 0 0 60px #00f, 0 0 70px #00f',
    },
  },
};

export default Navbar;
