import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Dummy admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password123';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const isValid =
      credentials.username.trim() === ADMIN_USERNAME &&
      credentials.password === ADMIN_PASSWORD;

    if (!isValid) {
      setError('Invalid username or password.');
      return;
    }

    localStorage.setItem('adminLoggedIn', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Admin Login</h1>
      </header>

      <form className="card" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            placeholder="admin"
            autoComplete="username"
          />
        </div>
        <div className="form-row">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="password123"
            autoComplete="current-password"
          />
        </div>

        {error && <div className="alert error">{error}</div>}

        <div className="form-actions">
          <button type="submit" className="primary">
            Login
          </button>
          <button type="button" className="secondary" onClick={() => navigate('/')}> 
            Back to Register
          </button>
        </div>

        <div className="note">
          <strong>Dummy credentials:</strong>
          <div>Username: <code>{ADMIN_USERNAME}</code></div>
          <div>Password: <code>{ADMIN_PASSWORD}</code></div>
        </div>
      </form>
    </div>
  );
}
