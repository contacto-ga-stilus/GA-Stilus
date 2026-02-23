'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
// Firebase removed: categories will be hardcoded for demo

interface Category {
  id: string;
  nombre: string;
  [key: string]: any;
}

const CATEGORY_ORDER = ['sudadera', 'playera', 'chamarra', 'accesorio'];

export default function CatalogoCaballero() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    // hardcoded categories for offline/demo mode
    setCategories([
      { id: 'sudadera', nombre: 'Sudaderas', imageName: 'sudaderaCaballero' },
      { id: 'playera', nombre: 'Playeras', imageName: 'playeraCaballero' },
      { id: 'chamarra', nombre: 'Chamarras', imageName: 'chamarraCaballero' },
    ]);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const carousel = carouselRef.current;
    if (carousel) {
      const scrollAmount = 350;
      carousel.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const checkScroll = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const { scrollLeft, scrollWidth, clientWidth } = carousel;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
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
  }, [categories]);

  return (
    <section id="caballero" className="catalog-section">
      <div className="catalog-content">
        <h2 className="catalog-title">Catálogo de Caballero</h2>

        {loading && (
          <div className="catalog-loading">
            <p>Cargando categorías...</p>
          </div>
        )}

        {error && (
          <div className="catalog-error">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="carousel-container">
            {canScrollLeft && (
            <button
              className="carousel-arrow carousel-arrow-left"
              onClick={() => scroll('left')}
              aria-label="Anterior"
            >
              ‹
            </button>
            )}
            <div className="catalog-carousel" ref={carouselRef}>
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="catalog-card"
                  style={{
                    opacity:
                      hoveredCard === null || hoveredCard === category.id ? 1 : 0.3,
                  }}
                  onMouseEnter={() => setHoveredCard(category.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="catalog-card-image">
                    <Image
                      src={`/images/${category.imageName}.jpg`}
                      alt={category.nombre}
                      fill
                      style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                      }}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="catalog-card-content">
                    <h3 className="catalog-card-title">{category.nombre}</h3>
                  </div>
                </div>
              ))}
            </div>
            {canScrollRight && (
            <button
              className="carousel-arrow carousel-arrow-right"
              onClick={() => scroll('right')}
              aria-label="Siguiente"
            >
              ›
            </button>
            )}
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <div className="catalog-empty">
            <p>No hay categorías disponibles</p>
          </div>
        )}
      </div>
    </section>
  );
}
