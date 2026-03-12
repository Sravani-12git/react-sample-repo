import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'registeredUsers';

function getStoredUsers() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function setStoredUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    contact: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validate = (values) => {
    if (!values.name.trim()) return 'Name is required.';
    if (!values.email.trim()) return 'Email is required.';
    if (!values.email.includes('@')) return 'Email is invalid.';
    if (!values.password) return 'Password is required.';
    if (values.password.length < 6) return 'Password must be at least 6 characters.';
    if (!values.gender) return 'Please select a gender.';
    if (!values.contact.trim()) return 'Contact number is required.';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validation = validate(form);
    if (validation) {
      setError(validation);
      return;
    }

    const existing = getStoredUsers();
    const next = [...existing, { ...form, id: Date.now().toString() }];
    setStoredUsers(next);

    setSuccess('Registration successful!');
    setForm({ name: '', email: '', password: '', gender: '', contact: '' });
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>User Registration</h1>
        <button className="link-button" onClick={() => navigate('/admin')}>
          Go to Admin Login
        </button>
      </header>

      <form className="card" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
        </div>

        <div className="form-row">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>

        <div className="form-row">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a password"
          />
        </div>

        <div className="form-row">
          <label htmlFor="gender">Gender</label>
          <select id="gender" name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Select gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="contact">Contact No.</label>
          <input
            id="contact"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="Enter contact number"
          />
        </div>

        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        <div className="form-actions">
          <button type="submit" className="primary">
            Register
          </button>
          <button type="button" className="secondary" onClick={() => navigate('/admin')}>
            Admin Login
          </button>
        </div>
      </form>
    </div>
  );
}