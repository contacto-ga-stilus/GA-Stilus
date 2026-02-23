'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Categoria {
  id: string;
  nombre: string;
}

interface Producto {
  id: string;
  categoria?: string;
  titulo?: string;
  imagenes?: string[];
  marca?: string;
  precio?: number;
  ocultarPrecio?: boolean;
  genero?: string;
  activo?: boolean;
}

export default function CatalogoCaballeroPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const catSnap = await getDocs(collection(db, 'categorias'));
    const prodSnap = await getDocs(collection(db, 'productos'));

    const cats = catSnap.docs
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

    const prods = prodSnap.docs
      .map((d) => ({ id: d.id, ...(d.data() as any) }))
      .filter(
        (p) => p.activo !== false && p.genero === 'caballero'
      );

    setCategorias(cats);
    setProductos(prods);
    setLoading(false);
  };

  const filteredProductos = selectedCategoria
    ? productos.filter((p) => p.categoria === selectedCategoria)
    : productos;

  if (loading) return <p>Cargando...</p>;

  return (
    <section
      className="catalogo-caballero-page"
      style={{
        backgroundImage: "url('/Caballero.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh'
      }}
    >
      <div className="catalogo-overlay">
        
        <div className="caballero-top-categorias">
          <Link href="/" className="caballero-top-item back-item">
            ← Volver
          </Link>
            <span
                className={`caballero-top-item ${selectedCategoria === null ? 'active' : ''}`}
                onClick={() => setSelectedCategoria(null)}
            >
                TODO
            </span>

            {categorias.map((cat) => (
                <span
                key={cat.id}
                className={`caballero-top-item ${
                    selectedCategoria === cat.id ? 'active' : ''
                }`}
                onClick={() => setSelectedCategoria(cat.id)}
                >
                {cat.nombre}
                </span>
            ))}
        </div>

        {/* 🔹 Productos usando tus clases */}
        <div className="products-gallery">
          {filteredProductos.map((producto) => (
            <article
              key={producto.id}
              className="product-gallery-card"
            >
              <div className="gallery-card-image">
                {producto.imagenes?.[0] ? (
                  <img
                    src={producto.imagenes[0]}
                    alt={producto.titulo}
                  />
                ) : (
                  <div className="placeholder-img" />
                )}
              </div>

              <div className="gallery-card-body">
                <h3 className="gallery-card-title">
                  {producto.titulo}
                </h3>
                <p className="gallery-card-brand">
                  {producto.marca}
                </p>
                {!producto.ocultarPrecio && (
                  <span className="gallery-card-price">
                    ${(producto.precio ?? 0).toFixed(2)}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}