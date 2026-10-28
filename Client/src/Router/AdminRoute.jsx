import { Navigate, useLocation } from "react-router";
import { useContext } from "react";
import useAdmin from "../Components/Hooks/useAdmin";
import { AuthContext } from "../Provider/AuthProvider";
import Loader from "../Components/Design/LoadingSpinner/LoadingSpinner";


const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext)
    const [isAdmin, isAdminLoading] = useAdmin();
    const location = useLocation();

    if(loading || isAdminLoading){
        return <Loader progress={45} />
    }

    if (user && isAdmin) {
        return children;
    }
    return <Navigate to="/" state={{from: location}} replace></Navigate>
};

export default AdminRoute;