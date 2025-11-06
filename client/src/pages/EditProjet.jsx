import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projetAPI } from '../services/api';
import InputField from '../components/InputField';
import ModalComponent from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

const EditProjet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
  });
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
        setShowModal(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la modification du projet');
    } finally {
      setSaving(false);
      setShowModal(false);
    }
  };

  if (loading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    
    <ModalComponent
      show={showModal}
      onHide={() => navigate(`/projet/${id}`)}
      title="Modifier le projet"
    >
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card shadow-sm">
              <div className="card-body p-4">
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
                  {error && (
                    <div className="alert alert-danger mt-3" role="alert">
                      {error}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalComponent>
  );
};

export default EditProjet;


