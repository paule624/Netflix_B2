// Inscription
export const signup = async (name, email, password) => {
  try {
    const response = await fetch("http://localhost:5001/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
      credentials: "include", // Added to handle cookies
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de l'inscription");
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Connexion
export const login = async (email, password) => {
  try {
    const response = await fetch("http://localhost:5001/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include", // Added to handle cookies
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Email ou mot de passe incorrect");
    }

    // No need to store token in localStorage anymore
    // The token is now stored in an HTTP-only cookie

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
