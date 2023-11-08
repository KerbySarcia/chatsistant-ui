import useSession from "../../hooks/useSession";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
  const { session } = useSession();

  if (!role?.includes(session?.role)) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
