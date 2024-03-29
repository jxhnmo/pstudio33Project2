import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Image from "next/image";
import styles from "../src/app/styles/page.module.css";
import DBConnection from "../src/app/DBConnection"; // Adjust the path as necessary
import { GetServerSideProps } from 'next';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(''); // Declaration of loginError state
  const router = useRouter();

  const handleOrderClick = () => {
    router.push('/order');
  };

  const handleMenuClick = () => {
    router.push('/menu');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username === '0' && password === '0') {
      console.log('Logged in!');
      router.push('/staff');
    } else {
      console.error('Invalid login');
      setLoginError('Invalid username or password'); // Setting loginError state on invalid login
    }
  };

  return (
    <main>
      <div>
        <div>
          <h1 className={styles.h1}>Welcome to REVS</h1>
        </div>
        <div className="container">
          <button onClick={handleOrderClick} className={styles.square}>Customer Order</button>
          <button onClick={handleMenuClick} className={styles.square}>Menu</button>
          <div className={styles.square}>
            <form onSubmit={handleSubmit}>
              <h1>Staff</h1>
              {loginError && <p className={styles.errorMessage}>{loginError}</p>} {/* Correct usage of loginError */}
              <label htmlFor="username">Username:</label><br />
              <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} /><br />
              <label htmlFor="password">Password:</label><br />
              <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
