import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { projetAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPageChanging, setIsPageChanging] = useState(false);
  const requestIdRef = useRef(0);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    fetchProjets(1, true);
  }, []);

  const fetchProjets = async (page, isInitial = false) => {
    try {
      const requestId = ++requestIdRef.current;
      if (isInitial) {
        setLoading(true);
      } else {
        setIsPageChanging(true);
      }
      const response = await projetAPI.getAll(page);
      if (response.data.success && requestId === requestIdRef.current) {
        setProjets(response.data.projets);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    } finally {
      if (isInitial) {
        setLoading(false);
      } else {
        setIsPageChanging(false);
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchProjets(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="container py-4">
      <LoadingSpinner loading={loading} />
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 m-0">Liste des Projets</h1>
      </div>

      {!loading && projets.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          Aucun projet disponible
        </div>
      ) : !loading ? (
        <>
          
          <div className="row g-4">
            {projets.map((projet) => (
              <div key={projet._id} className="col-12 col-sm-6 col-lg-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body d-flex flex-column">
                    <h2 className="h5 card-title mb-2">{projet.title}</h2>
                    <span className="badge bg-secondary align-self-start mb-2">{projet?.category_id?.name}</span>
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
              <li className={`page-item ${!pagination.hasPrevPage || isPageChanging ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage || isPageChanging}
                >
                  Précédent
                </button>
              </li>
              {/* afficher uniquement la page précédente, actuelle et suivante */}
              {pagination.totalPages > 1 && (
                <>
                  {(() => {
                    const items = [];
                    const current = pagination.currentPage;
                    const total = pagination.totalPages;
                    const candidates = [current - 1, current, current + 1];

                    candidates.forEach((p) => {
                      if (p >= 1 && p <= total) {
                        items.push(
                          <li key={p} className={`page-item ${p === current ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(p)} disabled={isPageChanging}>{p}</button>
                          </li>
                        );
                      }
                    });

                    return items;
                  })()}
                </>
              )}
              <li className={`page-item ${!pagination.hasNextPage || isPageChanging ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage || isPageChanging}
                >
                  Suivant
                </button>
              </li>
            </ul>
          </nav>
        </>
      ) : null}
    </div>
  );
};

export default Home;


