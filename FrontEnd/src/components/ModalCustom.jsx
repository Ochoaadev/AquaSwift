

export function ModalCustom({
    title,
    message,
    type = "info",
    confirmText = "Aceptar",
    cancelText = "Cancelar",
    onClose,
    onConfirm,
}) {

  // Colores para el tipo de modal
  const headerColors = {
    warning: "bg-[#6b4c8f] text-white",
    error: "bg-red-500 text-white", // Rojo claro
    info: "bg-[#6b4c8f] text-white",
    form: "bg-red-500 text-white", // Rojo claro
    password: "bg-red-500 text-white", // Rojo claro
  }
  
  const buttonColors = {
    warning: "bg-[#6b4c8f] hover:bg-[#6b4c8f]/80 text-white",
    error: "bg-red-500 hover:bg-[#f0706f] text-white", // Rojo claro
    info: "bg-[#4e7ac7] hover:bg-[#3d69b6] text-white",
    form: "bg-red-500 hover:bg-[#f0706f] text-white", // Rojo claro
    password: "bg-red-500 hover:bg-[#f0706f] text-white", // Rojo claro
  }
  

  // Mensajes predefinidos según el tipo
  let displayMessage = message
  if (type === "form" && !message) {
    displayMessage = "Asegúrate que todos los campos estén llenos."
  } else if (type === "password" && !message) {
    displayMessage = "Las contraseñas no coinciden."
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity`}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md rounded-lg bg-white text-black shadow-lg transition-all`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex items-center p-4 border-b ${headerColors[type]} rounded-t-lg`}>
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="ml-auto text-2xl font-bold text-slate-200 hover:text-slate-400" aria-label="Cerrar">
            &times;
          </button>
        </div>
        <div className="p-4">
          <div className="mb-6">{displayMessage}</div>
          <div className="flex justify-end gap-2">
            {onConfirm && (
              <button className="px-4 py-2 border rounded-md hover:bg-gray-100" onClick={onClose}>
                {cancelText}
              </button>
            )}
            <button
              className={`px-4 py-2 rounded-md ${buttonColors[type]}`}
              onClick={() => {
                if (onConfirm) onConfirm()
                else onClose()
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

