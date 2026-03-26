import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function Confetti() {
  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div
      style={{
        background: "#4caf50",
        color: "white",
        padding: "16px",
        borderRadius: 8,
        textAlign: "center",
        marginBottom: 20,
        fontSize: "1.2em",
        fontWeight: "bold",
      }}
    >
      Pipeline erfolgreich aktualisiert!
    </div>
  );
}
