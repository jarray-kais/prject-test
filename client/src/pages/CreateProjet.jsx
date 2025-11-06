import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { projetAPI } from '../services/api';
import InputField from '../components/InputField';
import { StoreContext } from '../context/StoreContext';

const CreateProjet = () => {
  const navigate = useNavigate();
  const { user } = useContext(StoreContext);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = ['Web Development', 'Mobile Apps', 'Jeux Vidéo', 'Autres'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');


    setLoading(true);
    try {
      const response = await projetAPI.create(formData);
      if (response.data.success) {
        navigate(`/projet/${response.data.projet._id}`);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la création du projet');
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = Boolean(user);
  if (!isAuthenticated) {
    return (
      <div className="container py-5">
        <div className="alert alert-info text-center" role="alert">
          Vous devez être connecté pour créer un projet.{' '}
          <Link to="/login" className="alert-link">Se connecter</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h1 className="h4 mb-3">Créer un nouveau projet</h1>
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
              <form onSubmit={handleSubmit}>
                <InputField
                  id="title"
                  name="title"
                  label="Titre"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">Catégorie</label>
                  <select
                    id="category"
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Création...' : 'Créer le projet'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjet;


