import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/", label: "Trang chủ" },
  { path: "/sang-tac", label: "Sáng tác" },
  { path: "/lich-su", label: "Lịch sử" },
  { path: "/cach-hoat-dong", label: "Cách hoạt động" },
  { path: "/ve-du-an", label: "Về dự án" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#e4e1da]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] rounded-lg"
            aria-label="Thi Vận AI - Trang chủ"
          >
            <div className="w-8 h-8 rounded-lg bg-[#3f4a6b] flex items-center justify-center flex-shrink-0">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"
                  fill="#d6b98c"
                />
                <path d="M7 8h2v8H7V8zm8 0h2v8h-2V8z" fill="none" />
                <text
                  x="6"
                  y="16"
                  fill="#d6b98c"
                  fontSize="12"
                  fontFamily="serif"
                >
                  詩
                </text>
              </svg>
            </div>
            <span className="font-bold text-[#252932] text-lg tracking-tight">
              Thi Vận AI
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            aria-label="Điều hướng chính"
            className="hidden md:flex items-center gap-1"
          >
            {navItems.map((item) => {
              const active =
                location.pathname === item.path ||
                (item.path !== "/" && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#e4e7ef] text-[#3f4a6b]"
                      : "text-[#5f6673] hover:bg-[#f4f2ed] hover:text-[#252932]"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#596789]`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {/* Research mode link */}
            <Link
              to="/nghien-cuu"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#d5d2ca] text-[#5f6673] hover:border-[#a5aec7] hover:text-[#3f4a6b] hover:bg-[#f2f4f8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#596789]"
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#4f7a68]"
                aria-hidden="true"
              />
              Nghiên cứu
            </Link>

            {/* Mobile menu button */}
            <button
              aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[#5f6673] hover:bg-[#f4f2ed] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#596789]"
            >
              {menuOpen ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#e4e1da] bg-white px-4 py-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const active =
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#e4e7ef] text-[#3f4a6b]"
                    : "text-[#5f6673] hover:bg-[#f4f2ed] hover:text-[#252932]"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            to="/nghien-cuu"
            onClick={() => setMenuOpen(false)}
            className="px-3 py-2.5 rounded-lg text-sm font-medium text-[#4f7a68] hover:bg-[#f1f6f3] transition-colors flex items-center gap-2"
          >
            <span
              className="w-2 h-2 rounded-full bg-[#4f7a68]"
              aria-hidden="true"
            />
            Chế độ nghiên cứu
          </Link>
        </div>
      )}
    </header>
  );
}
