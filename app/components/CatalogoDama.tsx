'use client';

import { useRouter } from 'next/navigation';

export default function CatalogoDama() {
  const router = useRouter();
  
  const handleClick = () => {
    router.push('/CatalogoDama');
  };

  return (
    <section id="dama" className="dama-section">
      <button 
        className="caballero-button"
        onClick={handleClick}
      >
        Ir al Catálogo para Dama
      </button>
    </section>
  );
}