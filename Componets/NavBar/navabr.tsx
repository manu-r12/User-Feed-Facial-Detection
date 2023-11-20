import React from 'react'
import styles from './navbar.module.css'

const NavBar = () => {
  return (
    <div className={styles.container}>
        <div>Logo</div>
        <div className={styles.fakeLinks}>
            <p>About</p>
            <p>Products</p>
            <p>Contact</p>
        </div>
    </div>
  )
}

export default NavBar