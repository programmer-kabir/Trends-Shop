import React, { createContext, useEffect, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
} from "firebase/auth";
import app from "../Firebase/Firebase.config";
import axios from "axios";
const auth = getAuth(app);
export const AuthContext = createContext(null);
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //   User Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const apiBase = import.meta.env.VITE_LOCALHOST_KEY || "http://localhost:5000";
        try {
          const res = await axios.post(`${apiBase}/jwt`, {
            email: currentUser.email,
          });
          if (res?.data?.token) {
            localStorage.setItem("access-token", res.data.token);
          }
        } catch (err) {
          console.error("JWT fetch error:", err);
        } finally {
          setLoading(false);
        }
      } else {
        localStorage.removeItem("access-token");
        setLoading(false);
      }
    });
    return () => {
      return unsubscribe();
    };
  }, []);

  // New User
  const RegisterUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // exiting user sing in
  const SingInUser = async (email, password) => {
    setLoading(true);
    const result = await signInWithEmailAndPassword(auth, email, password);
    if (result?.user) {
      setUser(result.user);
      const apiBase = import.meta.env.VITE_LOCALHOST_KEY || "http://localhost:5000";
      try {
        const res = await axios.post(`${apiBase}/jwt`, {
          email: result.user.email,
        });
        if (res?.data?.token) {
          localStorage.setItem("access-token", res.data.token);
        }
      } catch (err) {
        console.error("Error setting JWT on login:", err);
      }
    }
    setLoading(false);
    return result;
  };
  // User Logout
  const logOut = () => {
    localStorage.removeItem("access-token");
    setLoading(true);
    return signOut(auth);
  };
  // User name and photo
  const updateUserProfile = (name, photo = null) => {
    const profileData = {
      displayName: name,
    };

    if (photo !== null) {
      profileData.photoURL = photo;
    }

    return updateProfile(auth.currentUser, profileData);
  };
  const authValue = {
    RegisterUser,
    user,
    SingInUser,
    logOut,
    updateUserProfile,
    setLoading,
    loading,
  };
  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
