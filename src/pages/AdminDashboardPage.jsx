import { useEffect, useMemo, useState } from 'react';
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

function clearAdminSession() {
  localStorage.removeItem('adminLoggedIn');
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    setUsers(getStoredUsers());
  }, []);

  const fetchApi = async () => {
    setLoading(true);
    setFetchError('');
    setApiData(null);

    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setApiData(json);
    } catch (err) {
      setFetchError('Unable to load data. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'api' && apiData === null && !loading) {
      fetchApi();
    }
  }, [activeTab]);

  const handleLogout = () => {
    clearAdminSession();
    navigate('/');
  };

  const usersTable = useMemo(() => {
    if (users.length === 0) {
      return <p>No registered users found in local storage.</p>;
    }

    return (
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id ?? u.email}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.gender}</td>
                <td>{u.contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }, [users]);

  const apiTable = useMemo(() => {
    if (loading) return <p>Loading data...</p>;
    if (fetchError) return <p className="alert error">{fetchError}</p>;
    if (!apiData) return null;

    return (
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>City</th>
            </tr>
          </thead>
          <tbody>
            {apiData.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.company?.name}</td>
                <td>{u.address?.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }, [apiData, fetchError, loading]);

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Admin Dashboard</h1>

        <div className="header-actions">
          <button className="secondary" onClick={() => navigate('/')}>
            Go to Register
          </button>
          <button className="secondary" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>

      <div className="card">
        <div className="tabs">
          <button
            className={activeTab === 'users' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('users')}
          >
            Registered Users
          </button>
          <button
            className={activeTab === 'api' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('api')}
          >
            Fetch Public JSON
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'users' ? usersTable : apiTable}
        </div>
      </div>
    </div>
  );
}
