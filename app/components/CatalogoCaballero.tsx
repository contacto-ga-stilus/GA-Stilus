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

  // TODO: card click currently navigates to catalog page; keep handler if we need
  const handleCategoryClick = (categoria: Categoria) => {
    router.push('/CatalogoCaballero');
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

  // while we are fetching categories show a skeleton carousel to avoid jarring empty state
  if (loading) {
    return (
      <section id="caballero" className="catalog-section">
        <div className="catalog-content">
          <h2 className="catalog-title">Catálogo de Caballero</h2>
          <div className="catalog-carousel" ref={carouselRef}>
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="catalog-card placeholder">
                <div className="catalog-card-image">
                  <div className="placeholder-img" />
                </div>
                <div className="catalog-card-content">
                  <h3 className="catalog-card-title">&nbsp;</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
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
                {/* use a background image based on category name */}
                <div
                  className="catalog-card-image"
                  style={{
                    backgroundImage: `url('/images/${category.nombre}Caballero.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* fallback placeholder for when image fails to load */}
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