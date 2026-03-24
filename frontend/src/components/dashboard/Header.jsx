import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import bankLogo from "../../assets/bank-icon.png";

export function Header({ user, currentPage, onPageChange }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  
  const PAGE_ROUTES = {
    "Dashboard": `/dashboard/${id}`,
    "Comptes": `/dashboard/${id}/accounts`,
    "Analyses": `/dashboard/${id}/analyses`,
    // "Paramètres": `/dashboard/${id}/parametres`,
  };

  const handlePageChange = (pageName) => {
    onPageChange(pageName);
    navigate(PAGE_ROUTES[pageName]);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsUserMenuOpen(false);
    navigate("/login");
  };

  const handleGoToSettings = () => {
    setIsUserMenuOpen(false);
    navigate(`/dashboard/${id}/parameters`);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }

    function handleEsc(event) {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 h-[60px] bg-white border-b border-slate-200 flex items-center px-6 gap-4 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <img
            alt="Bank Manager Logo"
            src={bankLogo}
            className="mx-auto h-10 w-auto"
            onClick={() => navigate(`/dashboard/${id}`)}
        />
        <span className="text-[15px] font-extrabold text-slate-900 tracking-tight">
          Bank Manager<span className="text-indigo-500">.</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="hidden md:flex items-center gap-0.5 ml-5">
        {Object.keys(PAGE_ROUTES).map(pageName => (
          <button
            key={pageName}
            onClick={() => handlePageChange(pageName)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              pageName === currentPage
                ? "bg-indigo-50 text-indigo-700 font-semibold"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            {pageName}
          </button>
        ))}
      </nav>

      <div className="flex-1" />

      {/* Bell */}
      {/* <button className="relative w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-colors">
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="absolute top-[7px] right-[7px] w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
      </button> */}

      <div className="w-px h-6 bg-slate-400" />

      {/* User badge */}
      <div className="relative" ref={userMenuRef}>
        <button
          type="button"
          onClick={() => setIsUserMenuOpen((prev) => !prev)}
          className="flex items-center gap-2.5 rounded-xl px-2 py-1 hover:bg-slate-50 transition-colors"
          aria-haspopup="menu"
          aria-expanded={isUserMenuOpen}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-200 to-indigo-800 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 leading-tight">{user.firstName} {user.lastName.toUpperCase()}</p>
          </div>
          <svg
            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isUserMenuOpen && (
          <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
            <button
              type="button"
              onClick={handleGoToSettings}
              className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Paramètres
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
