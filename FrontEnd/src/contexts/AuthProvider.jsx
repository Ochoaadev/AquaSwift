import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    let logoutTimer;

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) return;

        const checkAuth = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/VerifySession", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                const data = await res.json();
                if (res.ok) {
                    setUser(data.user);
                    startLogoutTimer(); // Iniciar contador de inactividad
                } else {
                    if (res.status === 401) {
                        console.warn("Token expirado, cerrando sesión...");
                    }
                    logout();
                }
            } catch (error) {
                console.error("Error verificando sesión:", error);
                logout();
            }
        };

        checkAuth();

        return () => clearTimeout(logoutTimer);
    }, []);

    const startLogoutTimer = () => {
        clearTimeout(logoutTimer);
        logoutTimer = setTimeout(() => {
            console.warn("Sesión cerrada por inactividad.");
            logout();
        }, 30 * 60 * 1000); // 30 minutos de inactividad
    };

    const signUp = async (userData) => {
      try {
        const response = await fetch('http://localhost:4000/api/registro', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setUser(data.user);
          return { status: response.status, data };
        } else {
          return { status: response.status, data };
        }
      } catch (error) {
        console.error('Error al registrar:', error);
        return { status: 500, data: { message: 'Error de servidor' } };
      }
    };

    const signIn = async (credentials) => {
      try {
        const response = await fetch('http://localhost:4000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setUser(data.user);
          return { status: response.status, data };
        } else {
          return { status: response.status, data };
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return { status: 500, data: { message: 'Error de servidor' } };
      }
    };

    const logout = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                setUser(null);
                localStorage.removeItem("token");
                clearTimeout(logoutTimer);
                console.log("Sesión cerrada correctamente.");
            } else {
                console.error("Error al cerrar sesión.");
            }
        } catch (error) {
            console.error("Error en la solicitud de logout:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, signUp, signIn, logout }}>
            {children}
        </AuthContext.Provider>
    );
};