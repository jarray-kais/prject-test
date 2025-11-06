import { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projetAPI } from '../services/api';
import InputField from '../components/InputField';
import { StoreContext } from '../context/StoreContext';


const EditProjet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(StoreContext);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const categories = ['Web Development', 'Mobile Apps', 'Jeux Vidéo', 'Autres'];

  const fetchProjet = useCallback(async () => {
    try {
      setLoading(true);
      const response = await projetAPI.getById(id);
      if (response.data.success) {
        const projet = response.data.projet;
        setFormData({
          title: projet.title,
          category: projet.category,
          description: projet.description,
        });
      }
    } catch (error) {
      setError('Erreur lors du chargement du projet');
      if (error.response?.status === 404) {
        navigate('/404');
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchProjet();
  }, [fetchProjet]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');


    setSaving(true);
    try {
      const response = await projetAPI.update(id, formData);
      if (response.data.success) {
        navigate(`/projet/${id}`);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la modification du projet');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 d-flex justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3 text-muted">Chargement...</p>
        </div>
      </div>
    );
  }

  const isAuthenticated = Boolean(user);
  if (!isAuthenticated) {
    return (
      <div className="container py-5">
        <div className="alert alert-info text-center" role="alert">
          Vous devez être connecté pour modifier un projet.{' '}
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
              <h1 className="h4 mb-3">Modifier le projet</h1>
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
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/projet/${id}`)}
                    className="btn btn-outline-secondary"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProjet;


