import { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminAPI.getAllUsers();
      setUsers(res.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    try {
      await adminAPI.deleteUser(userId);
      await fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="container py-4">
      <h1 className="h3 mb-3">Tableau de bord administrateur</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <LoadingSpinner loading={loading} />
      {!loading && (
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 m-0">Utilisateurs</h2>
            </div>
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>Pseudo</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th style={{ width: 120 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-muted">Aucun utilisateur</td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id}>
                        <td>{u.pseudo}</td>
                        <td>{u.email}</td>
                        <td><span className="badge bg-secondary">{u.role}</span></td>
                        <td>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(u._id)}
                            disabled={u.role === 'admin'}
                            title={u.role === 'admin' ? 'Impossible de supprimer un admin' : ''}
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;


