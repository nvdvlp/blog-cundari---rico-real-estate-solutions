'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js'
import './login.css'

const Login = () => {
  const supabaseUrl = 'https://ppxclfscuebswbjhjtcz.supabase.co'  // Replace with your Supabase URL
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBweGNsZnNjdWVic3diamhqdGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg3OTU5MjgsImV4cCI6MjA0NDM3MTkyOH0.WYUHZcJNDf1J9k1VNMpjKP_woxKS5CmHMoDFUPh2GI0'  // Replace with your Supabase anon key
  const router = useRouter();

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  let user;

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    await loginUser(email, password)
    user = await getAuthenticatedUser();
    localStorage.setItem('authID', btoa(user.id))
    router.push('/viewPost');
  };

  async function loginUser(email, password) {
    const { user, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
  
    if (error) {
      console.error('Error logging in:', error);
      return null;
    }
  }

  async function getAuthenticatedUser() {
    const { data: { user }, error } = await supabase.auth.getUser();

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