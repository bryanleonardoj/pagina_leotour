import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [usuarioActual, setUsuarioActual] = useState(null);

  return (
    <AppContext.Provider value={{ usuarioActual, setUsuarioActual }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
