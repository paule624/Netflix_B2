import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export const signup = async (name, email, password) => {
  try {
    console.log("Tentative d'inscription:", { email, name });
    console.log("API_URL:", API_URL);

    // Validate input
    if (!email || !password || !name) {
      throw new Error("Tous les champs sont requis");
    }

    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ name, email, password }),
      credentials: "include",
    });

    console.log("Status:", response.status);
    const contentType = response.headers.get("content-type");
    console.log("Content-Type:", contentType);

    // Get the response text first for debugging
    const text = await response.text();
    console.log("Response text:", text);

    // Try to parse the response as JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse response as JSON:", e);
      throw new Error("Réponse invalide du serveur");
    }

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de l'inscription");
    }

    localStorage.setItem("user", JSON.stringify(data.user));
    toast.success("Inscription réussie!");
    return data;
  } catch (error) {
    console.error("Signup error:", error);
    toast.error(error.message || "Erreur lors de l'inscription");
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    console.log("Tentative de connexion avec:", { email });
    console.log("API_URL:", API_URL);

    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
      mode: "cors",
    });

    console.log("Status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: "Erreur de connexion au serveur",
      }));
      throw new Error(errorData.message || "Email ou mot de passe incorrect");
    }

    const data = await response.json();
    localStorage.setItem("user", JSON.stringify(data.user));
    toast.success("Connexion réussie !");
    return data;
  } catch (error) {
    console.error("Erreur de connexion:", error);
    toast.error(error.message);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    localStorage.removeItem("user");

    if (!response.ok) {
      console.warn(
        "Déconnexion côté serveur a échoué, mais l'utilisateur a été déconnecté localement"
      );
    }

    toast.success("Déconnexion réussie");
    window.location.href = "/login";
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    localStorage.removeItem("user");
    toast.info("Déconnexion effectuée localement");
    window.location.href = "/login";
  }
};

export const checkAuthWithServer = async () => {
  try {
    const response = await fetch(`${API_URL}/api/auth/check`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.ok;
  } catch (error) {
    console.error("Error checking auth with server:", error);
    return false;
  }
};

export const fetchWithAuth = async (url, options = {}) => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const authOptions = {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
    },
  };

  if (user && user.uid) {
    authOptions.headers = {
      ...authOptions.headers,
      "X-User-ID": user.uid,
    };
  }

  const response = await fetch(url, authOptions);
  return response;
};

export const auth = {
  async isAuthenticated() {
    const user = localStorage.getItem("user");

    if (!user) {
      return false;
    }

    try {
      const isValid = await checkAuthWithServer();
      return isValid;
    } catch (error) {
      console.error("Error verifying authentication:", error);
      return false;
    }
  },

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      return null;
    }
  },
};
