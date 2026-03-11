import CaballeroProductos from './CaballeroProductos';
import '../admin.css';
//Componente principal del panel de administración
export default function CaballeroPage() {
  return (
    //Contenedor principal del dashboard con header y contenido
    <div className="admin-dashboard">
      {/* Header del dashboard con logo, título y enlace para ver el sitio */ }
      <header className="admin-header">
        <div className="header-left">
          <div className="header-logo" aria-hidden>
            <svg
              width="60"
              height="60"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Marco cuadrado del logo GA Stilus */ }
              <rect x="10" y="10" width="180" height="180" stroke="white" strokeWidth="2" fill="none" />
              <text x="100" y="90" fontSize="60" fontFamily="cursive" fill="white" textAnchor="middle" fontStyle="italic" fontWeight="300">GA</text>
              <text x="100" y="130" fontSize="30" fontFamily="cursive" fill="white" textAnchor="middle" fontStyle="italic" fontWeight="300">Stilus</text>
            </svg>
          </div>
          {/* Título del panel */}
          <div>
            <h1>GA Stilus — Admin</h1>
            <p>Gestión de contenido del sitio</p>
          </div>
        </div>
        {/* Lado derecho del header */}
        <div className="header-right">
          <a href="/" className="btn-ver-sitio">← VER SITIO</a>
        </div>
      </header>
      {/* Aquí se renderiza el componente que gestiona
      todo el CRUD de productos de Caballero */}
      <main className="dashboard-content">
        <CaballeroProductos />
      </main>
    </div>
  );
}