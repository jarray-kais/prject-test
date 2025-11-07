import { useState, useEffect, useCallback } from 'react';
import { projetAPI } from '../services/api';
import InputField from './InputField';
import ModalComponent from './Modal';
import LoadingSpinner from './LoadingSpinner';

const EditProjetModal = ({ id, show, onHide, onSubmit }) => {
  const [error, setError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
  });
  const [categories, setCategories] = useState([]);

  const fetchCategories = useCallback(async () => {
    try {
      setCategoryError('');
      const response = await projetAPI.getCategories();
      if (response.data.success) {
        setCategories(Array.isArray(response.data.categories) ? response.data.categories : []);
      } else {
        setCategories([]);
        setCategoryError('Impossible de charger les catégories, veuillez réessayer plus tard.');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      setCategories([]);
      setCategoryError('Impossible de charger les catégories, veuillez réessayer plus tard.');
    }
  }, []);

  const fetchProjet = useCallback(async () => {
    if (!id) {
      return;
    }
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
      console.error('Erreur lors du chargement du projet:', error);
      setError('Erreur lors du chargement du projet');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (show) {
      setError('');
      setCategoryError('');
      fetchCategories();
      fetchProjet();
    }
  }, [show, fetchCategories, fetchProjet]);
  
  useEffect(() => {
    if (formData.category) {
      setCategories((prev) => {
        if (prev.includes(formData.category)) {
          return prev;
        }
        return [...prev, formData.category];
      });
    }
  }, [formData.category]);

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
        onSubmit?.(response.data.projet);
        onHide?.();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la modification du projet');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalComponent
      show={show}
      onHide={onHide}
      title="Modifier le projet"
    >
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
              <div className="card shadow-sm">
              <div className="card-body p-4">
                <LoadingSpinner loading={loading} />
                {!loading && (
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
                        disabled={!categories.length}
                      >
                        <option value="">Sélectionner une catégorie</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      {categoryError && (
                        <div className="text-warning small mt-1">
                          {categoryError}
                        </div>
                      )}
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
                        onClick={onHide}
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalComponent>
  );
};

export default EditProjetModal;

