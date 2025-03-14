import { toast } from "react-toastify";

export const signup = async (name, email, password) => {
  try {
    const response = await fetch("http://localhost:5001/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
      credentials: "include", // Important: allows cookies to be sent and received
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message || "Erreur lors de l'inscription");
      throw new Error(data.message || "Erreur lors de l'inscription");
    }

    // Store user info in localStorage
    localStorage.setItem("user", JSON.stringify(data.user));

    toast.success("Inscription réussie!");
    return data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    console.log("Tentative de connexion avec:", { email });

    const response = await fetch("http://localhost:5001/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include", // Important: allows cookies to be sent and received
    });

    const data = await response.json();
    console.log("Réponse du serveur:", data);

    if (!response.ok) {
      throw new Error(data.message || "Email ou mot de passe incorrect");
    }

    // Only store user info, token is in the cookie
    localStorage.setItem("user", JSON.stringify(data.user));

    console.log("Authentification réussie, données stockées:", {
      user: data.user,
    });

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
    await fetch("http://localhost:5001/api/auth/logout", {
      method: "POST",
      credentials: "include", // Important: allows cookies to be sent and received
    });

    // Clear local storage
    localStorage.removeItem("user");

    toast.success("Déconnexion réussie");
    window.location.href = "/login";
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    toast.error("Erreur lors de la déconnexion");
  }
};

// Mise à jour de la méthode isAuthenticated
// Add this function to check authentication with the server
export const checkAuthWithServer = async () => {
  try {
    const response = await fetch("http://localhost:5001/api/auth/check", {
      method: "GET",
      credentials: "include", // Important for sending cookies
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error checking auth with server:", error);
    return false;
  }
};

// Add a helper function to make authenticated requests
export const fetchWithAuth = async (url, options = {}) => {
  // Get user from localStorage
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  // Ensure credentials are included
  const authOptions = {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
    },
  };

  // If we have a user, add their UID to the request headers
  if (user && user.uid) {
    authOptions.headers = {
      ...authOptions.headers,
      "X-User-ID": user.uid,
    };
  }

  return fetch(url, authOptions);
};

export const auth = {
  async isAuthenticated() {
    // First check if we have a user in localStorage
    const user = localStorage.getItem("user");

    if (!user) {
      return false;
    }

    // Then verify with the server that our cookie is still valid
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
