'use client';

import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <svg
            width="50"
            height="50"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="10"
              y="10"
              width="180"
              height="180"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
            <text
              x="100"
              y="90"
              fontSize="60"
              fontFamily="cursive"
              fill="white"
              textAnchor="middle"
              fontStyle="italic"
              fontWeight="300"
            >
              GA
            </text>
            <text
              x="100"
              y="130"
              fontSize="30"
              fontFamily="cursive"
              fill="white"
              textAnchor="middle"
              fontStyle="italic"
              fontWeight="300"
            >
              Stilus
            </text>
          </svg>
        </div>

        <button
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`header-nav ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            <li>
              <button onClick={() => handleNavClick('inicio')}>Inicio</button>
            </li>
            <li>
              <button onClick={() => handleNavClick('caballero')}>
                Catálogo de Caballero
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('dama')}>
                Catálogo de Dama
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('contacto')}>
                Contacto
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
