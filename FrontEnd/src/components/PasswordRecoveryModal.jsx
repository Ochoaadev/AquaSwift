import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { ModalCustom } from "./ModalCustom";
import toast from "react-hot-toast";

const PasswordRecoveryModal = () => {
  const {
    resetPasswordModal,
    setResetPasswordModal,
    reenviarToken,
    verificarToken,
    cambiarContrasena,
    cerrarModalRecuperacion,
  } = useContext(AuthContext);

  const [countdown, setCountdown] = useState(60);
  const [showToken, setShowToken] = useState(false); // [NUEVO] Estado para mostrar/ocultar token

  // Efecto para el contador de reenvío
  useEffect(() => {
    let timer;
    if (resetPasswordModal.open && resetPasswordModal.step === 1 && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCountdown(60);
    }
    return () => clearTimeout(timer);
  }, [countdown, resetPasswordModal.open, resetPasswordModal.step]);

  if (!resetPasswordModal.open) return null;

  return (
    <ModalCustom
      title={
        resetPasswordModal.step === 1
          ? "Ingresa el código de verificación"
          : "Establece tu nueva contraseña"
      }
      type="recovery"
      onClose={cerrarModalRecuperacion}
      cancelText="Cancelar"
      confirmText={
        resetPasswordModal.step === 1 ? "Verificar" : "Cambiar contraseña"
      }
      onConfirm={
        resetPasswordModal.step === 1 ? verificarToken : cambiarContrasena
      }
    >
      {resetPasswordModal.step === 1 ? (
        <div className="space-y-4">
          <p>
            Hemos enviado un código de verificación a{" "}
            <span className="font-semibold">{resetPasswordModal.email}</span>.
            Por favor, ingrésalo a continuación.
          </p>
          <div className="relative">
            <input
              type={showToken ? "text" : "password"} // [MODIFICADO] Cambiado a type password
              value={resetPasswordModal.token}
              onChange={(e) =>
                setResetPasswordModal({
                  ...resetPasswordModal,
                  token: e.target.value,
                })
              }
              placeholder="Código de verificación"
              className="w-full p-2 border rounded-md pr-10" // [MODIFICADO] Añadido pr-10 para el botón
            />
            {/* [NUEVO] Botón para mostrar/ocultar token */}
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowToken(!showToken)}
            >
              {showToken ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              )}
            </button>
          </div>
          <div className="text-center">
            {countdown < 60 ? (
              <p className="text-gray-500">
                Podrás reenviar el código en {countdown} segundos
              </p>
            ) : (
              <button
                onClick={reenviarToken}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Reenviar código
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p>Por favor, ingresa tu nueva contraseña.</p>
          <input
            type="password"
            value={resetPasswordModal.newPassword}
            onChange={(e) =>
              setResetPasswordModal({
                ...resetPasswordModal,
                newPassword: e.target.value,
              })
            }
            placeholder="Nueva contraseña"
            className="w-full p-2 border rounded-md"
          />
          <input
            type="password"
            value={resetPasswordModal.confirmPassword}
            onChange={(e) =>
              setResetPasswordModal({
                ...resetPasswordModal,
                confirmPassword: e.target.value,
              })
            }
            placeholder="Confirmar contraseña"
            className="w-full p-2 border rounded-md"
          />
          {resetPasswordModal.newPassword !==
            resetPasswordModal.confirmPassword && (
            <p className="text-red-500 text-sm">
              Las contraseñas no coinciden
            </p>
          )}
        </div>
      )}
    </ModalCustom>
  );
};

export default PasswordRecoveryModal;