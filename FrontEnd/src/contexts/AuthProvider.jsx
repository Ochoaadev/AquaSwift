import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    let logoutTimer;

    useEffect(() => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("_id"); // Recupera el _id del localStorage
  
      if (!token || !userId) return;
  
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
                  setUser(data.user);  // Suponiendo que "data.user" contiene el usuario
                  startLogoutTimer();
              } else {
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
        const response = await fetch("http://localhost:4000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials)
        });

        const data = await response.json();

        if (!response.ok) {
          return { status: response.status, data };
        }

        const { token, Rol, _id } = data;

        setUser({ _id, role: Rol });

        localStorage.setItem("token", token);
        localStorage.setItem("role", Rol);
        localStorage.setItem("_id", _id);

        return { status: 200, data };
      } catch (error) {
        console.error("Error en signIn:", error);
        return { status: 500, data: { message: "Error de servidor" } };
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
                localStorage.removeItem("_id");
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