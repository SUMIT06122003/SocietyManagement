import React, { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const AuthContext = createContext();

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const adminCredentials = [
  { email: "harshpandey1@admin.com", password: "Harsh@1234" },
  { email: "harshpandey@admin.co", password: "Hash@0612" },
  { email: "sumit@admin.com", password: "Admin@123" },
];

const getUserRole = async (email) => {
  if (!email) return null;

  const normalizedEmail = normalizeEmail(email);
  const userDoc = await getDoc(doc(db, "users", normalizedEmail));

  if (userDoc.exists()) {
    return userDoc.data().role || null;
  }

  if (adminCredentials.some((admin) => normalizeEmail(admin.email) === normalizedEmail)) {
    return "admin";
  }

  return null;
};

const ensureAdminAccount = async (email, password) => {
  const normalizedEmail = normalizeEmail(email);
  const candidate = adminCredentials.find(
    (admin) => normalizeEmail(admin.email) === normalizedEmail
  );

  if (!candidate) return null;

  const adminRef = doc(db, "users", normalizedEmail);
  const adminDoc = await getDoc(adminRef);

  if (!adminDoc.exists()) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        candidate.email,
        candidate.password
      );

      await updateProfile(userCredential.user, { displayName: "Admin" });
      await setDoc(adminRef, {
        email: normalizedEmail,
        name: "Admin",
        role: "admin",
        createdAt: new Date(),
      });

      return "admin";
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        await setDoc(
          adminRef,
          {
            email: normalizedEmail,
            name: "Admin",
            role: "admin",
            createdAt: new Date(),
          },
          { merge: true }
        );
        return "admin";
      }

      throw err;
    }
  }

  return adminDoc.data().role || "admin";
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const normalizedEmail = normalizeEmail(email);
      const matchedAdmin = adminCredentials.find(
        (admin) => normalizeEmail(admin.email) === normalizedEmail
      );

      if (matchedAdmin) {
        await ensureAdminAccount(matchedAdmin.email, matchedAdmin.password);
      }

      const res = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      const nextRole = matchedAdmin ? "admin" : await getUserRole(normalizedEmail);

      setCurrentUser(res.user);
      setRole(nextRole);

      return { ...res, role: nextRole };
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setRole(null);
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  const registerResident = async (name, email, password, flatNumber) => {
    const normalizedEmail = normalizeEmail(email);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      normalizedEmail,
      password
    );
    await updateProfile(userCredential.user, { displayName: name });

    await setDoc(doc(db, "users", normalizedEmail), {
      email: normalizedEmail,
      name,
      flatNumber,
      role: "resident",
      createdAt: new Date(),
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        try {
          const matchedAdmin = adminCredentials.find(
            (admin) => normalizeEmail(admin.email) === normalizeEmail(user.email || "")
          );

          const nextRole = matchedAdmin ? "admin" : await getUserRole(user.email);
          setRole(nextRole);
        } catch (err) {
          console.error("Error fetching user role:", err.message);
          setRole(null);
        }
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
    logout,
    registerResident,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
