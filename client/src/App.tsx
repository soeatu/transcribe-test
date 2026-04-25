import { Outlet, Link } from "react-router-dom";

export function App() {
  return (
    <>
      <header className="header">
        <Link to="/" className="header__logo">
          🎙️ TranscribeApp
        </Link>
        <nav className="header__nav">
          <Link to="/" className="btn btn--secondary" style={{ fontSize: "0.8125rem" }}>
            ダッシュボード
          </Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
