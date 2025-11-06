import { useEffect, useState } from "react";
import { StoreContext } from "./StoreContext";


export const StoreProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [setUser]);
  return (
    <StoreContext.Provider value={{ user, setUser }}>
      {children}
    </StoreContext.Provider>
  );
};