import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

const AdminRoute = ({ children }) => {
    const navigate = useNavigate();
  const { user } = useContext(StoreContext);
  if (!user || user.role !== 'admin') {
    return navigate("/");
  }
  return children;
};

export default AdminRoute;


