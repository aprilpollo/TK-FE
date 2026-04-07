import { useContext } from "react";
import FuseLayoutSettingsContext from "../context/LayoutSettingsContext";

const useLayoutSettings = () => {
  const context = useContext(FuseLayoutSettingsContext);

  if (context === undefined) {
    throw new Error(
      "useLayoutSettings must be used within a SettingsProvider"
    );
  }

  return context;
};

export default useLayoutSettings;
