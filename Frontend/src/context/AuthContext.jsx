import { createContext, useEffect, useMemo, useState } from 'react';
import { fetchProfile, loginUser, logoutUser, registerUser } from '../api/auth';

const AuthContext = createContext(null);

function getStoredUser() {
  const value = localStorage.getItem('user');
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function persistSession(user, token) {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }

  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [isLoading, setIsLoading] = useState(Boolean(localStorage.getItem('token')));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    let ignore = false;

    async function loadProfile() {
      try {
        const data = await fetchProfile();
        if (!ignore) {
          setUser(data.data);
          persistSession(data.data, token);
        }
      } catch {
        if (!ignore) {
          setUser(null);
          persistSession(null, null);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      ignore = true;
    };
  }, []);

  async function signIn(email, password) {
    const data = await loginUser(email, password);
    setUser(data.user);
    persistSession(data.user, data.token);
    return data.user;
  }

  async function signUp(formData) {
    const data = await registerUser(formData);
    const nextUser = data.data
      ? {
          id: data.data.id,
          name: data.data.name,
          email: data.data.email,
          role: data.data.role,
          phone: data.data.phone,
          address: data.data.address,
        }
      : null;

    setUser(nextUser);
    persistSession(nextUser, data.data?.token || null);
    return nextUser;
  }

  async function signOut() {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      persistSession(null, null);
    }
  }

  function updateLocalUser(nextUser) {
    setUser(nextUser);
    persistSession(nextUser, localStorage.getItem('token'));
  }

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(user),
      isLoading,
      signIn,
      signOut,
      signUp,
      updateLocalUser,
      user,
    }),
    [isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
