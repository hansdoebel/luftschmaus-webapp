import { useState, useEffect } from "react";
import Confetti from "./Confetti.jsx";

// Um die Pipeline zu testen, einfach false zu true ändern:
const showConfetti = false;

export default function App() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then(setItems)
      .catch(() => setError("Menü konnte nicht geladen werden."));
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20, fontFamily: "system-ui" }}>
      {showConfetti && <Confetti />}
      <h1>Luftschmaus - Drohnenlieferung für frische Küche</h1>
      {error && <p style={{ color: "#c00" }}>{error}</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
        {items.map((item) => (
          <div key={item.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
            <h3 style={{ margin: "0 0 8px" }}>{item.name}</h3>
            <p style={{ margin: "0 0 8px", color: "#666" }}>{item.description}</p>
            <strong>{(item.price ?? 0).toFixed(2)} EUR</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
