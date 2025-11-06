import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import InputField from '../components/InputField';
import { authAPI } from '../services/api';
import { StoreContext } from '../context/StoreContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login({
        email,
        password,
      });

      if (response.data.user) {
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
        setUser(response.data.user);
        navigate('/');
      } else {
        setError(response.data.message || 'Erreur de connexion');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center min-vh-100">
      <div className="w-100" style={{maxWidth: 420}}>
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="h4 mb-3 text-center">Connexion </h2>
            {error && (
              <div className="alert alert-danger" role="alert">{error}</div>
            )}
            <form onSubmit={handleSubmit}>
              <InputField
                id="email"
                name="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <InputField
                id="password"
                name="password"
                label="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Connexion...' : 'login'}
              </button>
            </form>
            <p className="mt-3 text-center text-muted">
            Don&#39;t have an account?{" "} ? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


