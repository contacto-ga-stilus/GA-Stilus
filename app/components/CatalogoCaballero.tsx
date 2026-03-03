'use client';

import { useRouter } from 'next/navigation';

export default function CatalogoCaballero() {
  const router = useRouter();

  // Redirige al catálogo al hacer clic
  const handleClick = () => {
    router.push('/CatalogoCaballero');
  };

  return (
    <section id="caballero" className="caballero-section">
      <button 
        className="caballero-button"
        onClick={handleClick}
      >
        Ir al Catálogo de Caballero
      </button>
    </section>
  );
}