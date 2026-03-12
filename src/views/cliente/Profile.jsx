import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import BackButton from "../../components/BackButton";
import "./Profile.css";

import AdminProfileContent from "../../components/profile/AdminProfileContent";
import SellerProfileContent from "../../components/profile/SellerProfileContent";
import UserProfileContent from "../../components/profile/UserProfileContent";

import { fetchGetUsersMe } from "../../redux/slices/userSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (token) {
      dispatch(fetchGetUsersMe());
    }
  }, [token, dispatch]);

  if (loading) {
    return <div className="profile-page-container">Cargando perfil...</div>;
  }

  if (!token) {
    return <div className="profile-page-container">Debes iniciar sesión.</div>;
  }

  if (error) {
    return (
      <div className="profile-page-container" style={{ color: "red" }}>
        Error: {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page-container">
        No se pudo cargar la información del usuario.
      </div>
    );
  }

  const role = user.role?.toLowerCase();

  let ContentComponent = UserProfileContent;

  if (role === "admin") {
    ContentComponent = AdminProfileContent;
  } else if (role === "seller") {
    ContentComponent = SellerProfileContent;
  }

  const displayedRole =
    role === "admin"
      ? "ADMIN"
      : role === "seller"
      ? "SELLER"
      : "USUARIO-CLIENTE";

  return (
    <div className="profile-page-container">
      <div className="profile-header">
        <BackButton destino="/" texto="Volver al home" />
        <h1>Perfil de {displayedRole}</h1>
      </div>

      <main className="profile-content">
        <ContentComponent profileData={user} />
      </main>
    </div>
  );
};

export default Profile;
