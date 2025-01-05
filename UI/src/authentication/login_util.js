const API_URL = "http://localhost:8000";

export const login = async (username, password) => {
    const response = await fetch(`${API_URL}/api/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.access);
    }
    return data;
  };
  
  export const logout = () => {
    localStorage.removeItem('token');
  };
  
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  


  export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return token && token !== "undefined"; 
};

export const redirectToLogin = () => {
    if (!isAuthenticated()) {
        window.location.href = "http://localhost:3000/login";  
    }
};
  