import { useState, useEffect, useContext, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { projetAPI, reviewAPI } from "../services/api";
import { StoreContext } from "../context/StoreContext";
import LoadingSpinner from "../components/LoadingSpinner";
import EditProjetModal from "../components/EditProjetModal";

const ProjetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(StoreContext);
  const [projet, setProjet] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewContent, setReviewContent] = useState("");
  const [error, setError] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchProjet = useCallback(async () => {
    try {
      setLoading(true);
      const response = await projetAPI.getById(id);
      if (response.data.success) {
        setProjet(response.data.projet);
        setReviews(response.data.reviews || []);
      }
    } catch (error) {
      console.error("Erreur:", error);
      if (error.response?.status === 404) {
        navigate("/404");
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchProjet();
  }, [fetchProjet]);

  // Ajouter une review
  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      const response = await reviewAPI.add(id, {
        content: reviewContent,
      });
      if (response.data.success) {
        setReviews([...reviews, response.data.review]);
        setReviewContent("");
        setError("");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Erreur lors de l'ajout de la review"
      );
    }
  };

  // Modifier une review
  const handleUpdateReview = async (reviewId) => {
    try {
      const response = await reviewAPI.update(reviewId, {
        content: editContent,
      });
      if (response.data.success) {
        setReviews(
          reviews.map((r) => (r._id === reviewId ? response.data.review : r))
        );
        setEditingReview(null);
        setEditContent("");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Erreur lors de la modification"
      );
    }
  };
 // Supprimer une review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette review ?")) {
      return;
    }

    try {
      const response = await reviewAPI.delete(reviewId);
      if (response.data.success) {
        setReviews(reviews.filter((r) => r._id !== reviewId));
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Erreur lors de la suppression"
      );
    }
  };

  // Modifier une review
  const startEdit = (review) => {
    setEditingReview(review._id);
    setEditContent(review.content);
  };

  // Annuler la modification d'une review
  const cancelEdit = () => {
    setEditingReview(null);
    setEditContent("");
  };

  // Supprimer un projet
  const handleDeleteProjet = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      return;
    }
    try {
      await projetAPI.delete(id);
      navigate("/");
    } catch {
      setError("Erreur lors de la suppression");
    }
  };

  // ouvrir le modal de modification du projet
  const handleEditOpen = () => {
    setShowEditModal(true);
  };

  // Fermer le modal de modification du projet
  const handleEditClose = () => {
    setShowEditModal(false);
  };

  const handleEditSubmit = (updatedProjet) => {
    if (updatedProjet) {
      setProjet(updatedProjet);
    }
    setShowEditModal(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!projet) {
    return null;
  }

  const isAuthenticated = Boolean(user);
  const isAuthor =
    projet.author?._id === user?._id || projet.author?.toString() === user?._id;
  const isAdmin = user?.role === "admin";

  return (
    <div className="container py-4">
      <div className="mb-3">
        <Link to="/" className="btn btn-link p-0">
          {" "}
          ←Retour à la liste{" "}
        </Link>{" "}
      </div>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h1 className="h3"> {projet.title} </h1>{" "}
          <span className="badge bg-secondary me-2"> {projet.category} </span>{" "}
          <p
            className="text-muted mt-3"
            style={{
              whiteSpace: "pre-line",
            }}
          >
            {" "}
            {projet.description}{" "}
          </p>{" "}
          <p className="text-muted small">
            Par: {projet.author?.pseudo || "Auteur inconnu"}{" "}
          </p>
          {(isAuthor || isAdmin) && (
            <div className="d-flex gap-2 mt-3">
              {" "}
              {isAuthor && (
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={handleEditOpen}
                >
                  Modifier le projet{" "}
                </button>
              )}{" "}
              {(isAuthor || isAdmin) && (
                <button
                  onClick={handleDeleteProjet}
                  className="btn btn-danger btn-sm"
                >
                  Supprimer{" "}
                </button>
              )}{" "}
            </div>
          )}{" "}
        </div>{" "}
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="h5"> Reviews({reviews.length}) </h2>
          {error && (
            <div className="alert alert-danger" role="alert">
              {" "}
              {error}{" "}
            </div>
          )}
          {isAuthenticated && (
            <form onSubmit={handleAddReview} className="mb-4">
              <div className="mb-3">
                <textarea
                  className="form-control"
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="Ajouter une review..."
                  rows={3}
                  required
                />
              </div>{" "}
              <button type="submit" className="btn btn-primary">
                Ajouter une review{" "}
              </button>{" "}
            </form>
          )}
          {!isAuthenticated && (
            <div className="alert alert-info" role="alert">
              <Link to="/login"> Connectez - vous </Link> pour ajouter une
              review{" "}
            </div>
          )}
          <div className="vstack gap-3">
            {" "}
            {reviews.length === 0 ? (
              <p className="text-muted"> Aucune review pour ce projet </p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="border rounded p-3">
                  {" "}
                  {editingReview === review._id ? (
                    <div>
                      <textarea
                        className="form-control mb-2"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                      />{" "}
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleUpdateReview(review._id)}
                        >
                          Enregistrer{" "}
                        </button>{" "}
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={cancelEdit}
                        >
                          Annuler{" "}
                        </button>{" "}
                      </div>{" "}
                    </div>
                  ) : (
                    <>
                      <p className="mb-1"> {review.content} </p>{" "}
                      <p className="text-muted small mb-2">
                        Par: {review.author?.pseudo || "Auteur inconnu"}{" "}
                      </p>{" "}
                      {(review.author?._id === user?._id ||
                        review.author?.toString() === user?._id) && (
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => startEdit(review)}
                          >
                            Modifier{" "}
                          </button>{" "}
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteReview(review._id)}
                          >
                            Supprimer{" "}
                          </button>{" "}
                        </div>
                      )}{" "}
                    </>
                  )}{" "}
                </div>
              ))
            )}{" "}
          </div>{" "}
        </div>{" "}
      </div>
      <EditProjetModal
        id={id}
        show={showEditModal}
        onHide={handleEditClose}
        onSubmit={handleEditSubmit}
      />{" "}
    </div>
  );
};

export default ProjetDetails;
