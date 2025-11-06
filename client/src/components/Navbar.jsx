import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";
import { authAPI } from "../services/api";
import NavToggler from "./NavToggler";

const Header = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(StoreContext);

  const signOuthandler = () => {
    authAPI
      .logout()
      .then(() => {
        localStorage.removeItem("userInfo");
        setUser(null);
        navigate("/login");
      })
      .catch((error) => console.log(error));
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Welcome
          </Link>

          <NavToggler targetId="mainNavbar" />

          <div className="collapse navbar-collapse justify-content-end" id="mainNavbar">
            <ul className="navbar-nav mb-2 mb-lg-0 align-items-lg-center gap-2">
              {user && (
                <li className="nav-item">
                  <Link to="/projet/create" className="btn btn-success">
                    Créer projet
                  </Link>
                </li>
              )}
              {user ? (
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle btn btn-link"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fa-solid fa-user me-2"></i>
                    {user?.pseudo || 'Utilisateur'}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li>
                      <button className="dropdown-item" onClick={signOuthandler}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;