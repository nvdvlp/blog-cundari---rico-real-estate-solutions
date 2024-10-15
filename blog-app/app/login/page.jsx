'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './login.css'
import Supabase from '../lib/supabaseClient';
import { useEffect } from 'react';

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  let user;
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
      const token = localStorage.getItem('authID'); // O sessionStorage, según tu autenticación
      if (token) {
          router.push('/viewPost'); // Redirige a login si no está autenticado
      } else {
          setIsAuthenticated(true);
      }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    await loginUser(email, password)
    user = await getAuthenticatedUser();
    console.log("user")
    console.log(user)
    localStorage.setItem('authID', btoa(user.id))
    router.push('/viewPost');
  };

  async function loginUser(email, password) {
    const { user, error } = await Supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
  
    if (error) {
      console.error('Error logging in:', error);
      return null;
    }

    return user
  }

  async function getAuthenticatedUser() {
    const { data: { user }, error } = await Supabase.auth.getUser();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    if (!user) {
      console.log('No user is logged in');
      return null;
    }

    console.log('Authenticated User ID:', user.id);
    return user;
  }
  

  return (
    <div className="login-container">
      <section className="subContainer">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </section>
    </div>
  );
}

export default Login;