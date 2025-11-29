import { Navigate } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>; // pokaż loader dopóki sprawdzamy token
    if (!user) return <Navigate to="/login" />;

    return <>{children}</>;
};

export default ProtectedRoute;
