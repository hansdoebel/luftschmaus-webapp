import { describe, it, expect } from "bun:test";
import { renderToString } from "react-dom/server";
import App from "../src/App.jsx";

describe("App", () => {
  it("renders the heading", () => {
    const html = renderToString(<App />);
    expect(html).toContain("Luftschmaus - Drohnenlieferung für frische Küche");
  });
});
