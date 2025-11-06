import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import InputField from '../components/InputField';
import { authAPI } from '../services/api';
import { StoreContext } from '../context/StoreContext';

const Register = () => {
  const [formData, setFormData] = useState({
    pseudo: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.register({
        pseudo: formData.pseudo,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response.data.success) {
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
        setUser(response.data.user);
        navigate('/login');
      } else {
        setError(response.data.message || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center min-vh-100">
      <div className="w-100" style={{maxWidth: 480}}>
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="h4 mb-3 text-center">Inscription</h2>
            {error && (
              <div className="alert alert-danger" role="alert">{error}</div>
            )}
            <form onSubmit={handleSubmit}>
              <InputField
                id="pseudo"
                name="pseudo"
                label="Pseudo"
                type="text"
                value={formData.pseudo}
                onChange={handleChange}
                required
              />
              <InputField
                id="email"
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <InputField
                id="password"
                name="password"
                label="Mot de passe"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <InputField
                id="confirmPassword"
                name="confirmPassword"
                label="Confirmer le mot de passe"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Inscription...' : "S'inscrire"}
              </button>
            </form>
            <p className="mt-3 text-center text-muted">
              Already have account ? <Link to="/login">login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

