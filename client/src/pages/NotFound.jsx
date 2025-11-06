import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <h1 className="display-1 fw-bold text-primary">404</h1>
        <p className="lead mb-4">Page non trouvée</p>
        <Link to="/" className="btn btn-primary">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default NotFound;


