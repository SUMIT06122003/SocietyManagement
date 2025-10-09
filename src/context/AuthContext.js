import React, { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Auto-create default Admin if not exists
  const createDefaultAdmin = async () => {
    try {
      const adminRef = doc(db, "users", "Sumit@admin.com");
      const docSnap = await getDoc(adminRef);

      if (!docSnap.exists()) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          "Sumit@admin.com",
          "Sumit@0612"
        );
        await updateProfile(userCredential.user, { displayName: "Admin" });

        await setDoc(adminRef, {
          email: "Sumit@admin.com",
          role: "admin",
          name: "Admin",
        });
        console.log("✅ Default admin created.");
      }
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        console.log("✅ Admin already exists.");
      } else {
        console.error("Error creating admin:", err.message);
      }
    }
  };

  // ✅ Handle login
  const login = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const docSnap = await getDoc(doc(db, "users", email));
    if (docSnap.exists()) setRole(docSnap.data().role);
    return res;
  };

  // ✅ Handle resident registration
  const registerResident = async (name, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(userCredential.user, { displayName: name });

    await setDoc(doc(db, "users", email), {
      email,
      name,
      role: "resident",
    });
  };

  // ✅ Auth state listener
  useEffect(() => {
    createDefaultAdmin();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const userDoc = await getDoc(doc(db, "users", user.email));
        setRole(userDoc.exists() ? userDoc.data().role : null);
      } else {
        setCurrentUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    role,
    loading,
    login,
    registerResident,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
