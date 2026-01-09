import WasteLayout from "../../layouts/WasteLayout";
import History from "./components/History";
import { useState } from "react";
export default function WasteHome() {
  const [view, setView] = useState("history");
  return (
    <div>
      {view === "home" && <WasteLayout onSwitch={setView} />}
      {view === "history" && <History onSwitch={setView} />}
    </div>
  );
}
