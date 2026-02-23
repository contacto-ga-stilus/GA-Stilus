'use client';

import { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';

interface Categoria {
  id: string;
  nombre: string;
}

export default function CatalogoCaballero() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'categorias'));

      const cats: Categoria[] = snapshot.docs
        .filter((d) => {
          const data = d.data() as any;
          return (
            data.activa !== false &&
            Array.isArray(data.genero) &&
            data.genero.includes('caballero')
          );
        })
        .map((d) => ({
          id: d.id,
          nombre: d.data().nombre || '',
          
        }));

      setCategorias(cats);
    } catch (err) {
      console.error('Error al cargar categorías', err);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.scrollBy({
      left: direction === 'left' ? -350 : 350,
      behavior: 'smooth',
    });
  };

  const checkScroll = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const { scrollLeft, scrollWidth, clientWidth } = carousel;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  const handleCategoryClick = (categoria: Categoria) => {
  setSelectedCategoria(categoria);
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    checkScroll();
    carousel.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      carousel.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [categorias]);

  if (loading) {
    return <section className="catalog-section"><p>Cargando...</p></section>;
  }

  if (selectedCategoria) {
    return <></>; // página completamente en blanco
  }

  return (
    <section id="caballero" className="catalog-section">
      <div className="catalog-content">
        <h2 className="catalog-title">Catálogo de Caballero</h2>

        <div className="carousel-container">
          {canScrollLeft && (
            <button
              className="carousel-arrow carousel-arrow-left"
              onClick={() => scroll('left')}
            >
              ‹
            </button>
          )}

          <div className="catalog-carousel" ref={carouselRef}>
            {categorias.map((category) => (
              <div
                key={category.id}
                className="catalog-card"
                style={{
                  opacity:
                    hoveredCard === null || hoveredCard === category.id ? 1 : 0.3,
                }}
                onMouseEnter={() => setHoveredCard(category.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => router.push('/CatalogoCaballero')}
              >
                <div className="catalog-card-image">
                  <div
                    className="placeholder-img"
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
                <div className="catalog-card-content">
                  <h3 className="catalog-card-title">
                    {category.nombre}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {canScrollRight && (
            <button
              className="carousel-arrow carousel-arrow-right"
              onClick={() => scroll('right')}
            >
              ›
            </button>
          )}
        </div>

        {categorias.length === 0 && (
          <div className="catalog-empty">
            <p>No hay categorías disponibles</p>
          </div>
        )}
      </div>
    </section>
  );
}