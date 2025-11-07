import { useEffect, useState } from 'react';
import { authAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await authAPI.getMeWithProjectsReviews();
        setData(res.data?.projects || []);
        setLoading(false);
      } catch (e) {
        setError(e.response?.data?.message || 'Erreur lors du chargement du profil');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="mb-3">Mes Projets</h2>
          {error && <div className="alert alert-danger">{error}</div>}
        </div>
      </div>

      <LoadingSpinner loading={loading} />

      {!loading && Array.isArray(data) && data.length > 0 ? (
        <div className="row g-4">
          {data.map((projet) => (
            <div key={projet._id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title mb-0">{projet.title}</h5>
                    <span className="badge bg-primary">{projet.category}</span>
                  </div>
                  
                  {projet.description && (
                    <p className="card-text text-muted mb-3">
                      {projet.description}
                    </p>
                  )}

                  <div className="border-top pt-3 mt-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="mb-0">
                        <i className="fas fa-comments me-2"></i>
                        Avis ({projet.reviews?.length || 0})
                      </h6>
                    </div>
                    
                    {projet.reviews && projet.reviews.length > 0 ? (
                      <div className="reviews-container" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {projet.reviews.map((review) => (
                          <div key={review._id} className="review-item mb-3 p-2 bg-light rounded">
                            <div className="d-flex align-items-start">
                              <div className="flex-grow-1">
                                <p className="mb-1 small text-dark">
                                  {review.content}
                                </p>
                                {review.author && (
                                  <small className="text-muted">
                                    <i className="fas fa-user me-1"></i>
                                    {review.author.pseudo || review.author.email}
                                  </small>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted py-3">
                        <i className="fas fa-inbox fs-4 d-block mb-2"></i>
                        <small>Aucun avis pour ce projet</small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !loading ? (
        <div className="text-center py-5">
          <i className="fas fa-folder-open fs-1 text-muted d-block mb-3"></i>
          <p className="text-muted">Aucun projet trouvé</p>
        </div>
      ) : null}
    </div>
  );
};

export default Profile;




