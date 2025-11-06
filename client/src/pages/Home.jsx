import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projetAPI } from '../services/api';

const Home = () => {
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    fetchProjets(1);
  }, []);

  const fetchProjets = async (page) => {
    try {
      setLoading(true);
      const response = await projetAPI.getAll(page);
      if (response.data.success) {
        setProjets(response.data.projets);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchProjets(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 m-0">Liste des Projets</h1>
      </div>

      {projets.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          Aucun projet disponible
        </div>
      ) : (
        <>
          <div className="row g-4">
            {projets.map((projet) => (
              <div key={projet._id} className="col-12 col-sm-6 col-lg-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body d-flex flex-column">
                    <h2 className="h5 card-title mb-2">{projet.title}</h2>
                    <span className="badge bg-secondary align-self-start mb-2">{projet.category}</span>
                    <p className="card-text text-muted flex-grow-1" style={{whiteSpace: 'pre-line'}}>
                      {projet.description}
                    </p>
                    <p className="text-muted small mb-3">
                      Par: {projet.author?.pseudo || 'Auteur inconnu'}
                    </p>
                    <Link to={`/projet/${projet._id}`} className="btn btn-primary mt-auto">
                      Voir les détails
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <nav className="d-flex justify-content-center mt-4" aria-label="Pagination des projets">
            <ul className="pagination">
              <li className={`page-item ${!pagination.hasPrevPage ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  Précédent
                </button>
              </li>
              <li className="page-item disabled">
                <span className="page-link">
                  Page {pagination.currentPage} sur {pagination.totalPages}
                </span>
              </li>
              <li className={`page-item ${!pagination.hasNextPage ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Suivant
                </button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
  );
};

export default Home;


