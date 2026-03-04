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
  descripcion?: string;
  talla?: string[];
  precio?: number;
  ocultarPrecio?: boolean;
  genero?: string;
  activo?: boolean;
}

export default function CatalogoCaballeroPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
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
    } catch (error) {
      console.error('Error cargando catálogo:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProductos = selectedCategoria
    ? productos.filter((p) => p.categoria === selectedCategoria)
    : productos;

  if (loading) return <p className="catalogo-loading">Cargando...</p>;

  return (
    <section className="catalogos-page">
      <div className="catalogos-overlay">

        {/* 🔹 Categorías superiores */}
        <div className="catalogos-top-categorias">
          <Link href="/" className="catalogos-top-item back-item">
            ← VOLVER
          </Link>
          <span
            className={`catalogos-top-item ${
              selectedCategoria === null ? 'active' : ''
            }`}
            onClick={() => setSelectedCategoria(null)}
          >
            TODO
          </span>

          {categorias.map((cat) => (
            <span
              key={cat.id}
              className={`catalogos-top-item ${
                selectedCategoria === cat.id ? 'active' : ''
              }`}
              onClick={() => setSelectedCategoria(cat.id)}
            >
              {cat.nombre}
            </span>
          ))}
        </div>
        {/* 🔹 Galería */}
        <div className="products-gallery">
          {filteredProductos.map((producto) => (
            <article
              key={producto.id}
              className="product-gallery-card"
              onClick={() => {
                setSelectedProducto(producto);
                setCurrentImage(0);
              }}
            >
              <div className="gallery-card-image">
                {producto.imagenes?.[0] ? (
                  <img
                    src={producto.imagenes[0]}
                    alt={producto.titulo || 'Producto'}
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
        {/* 🔹 MODAL */}
        {selectedProducto && (
          <div
            className="product-modal-overlay"
            onClick={() => setSelectedProducto(null)}
          >
            <div
              className="product-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={() => setSelectedProducto(null)}
              >
                ✕
              </button>
              {/* 🔹 Imágenes */}
              <div className="modal-images">
                {selectedProducto.imagenes?.length ? (
                  <>
                    <img
                      src={selectedProducto.imagenes[currentImage]}
                      alt={selectedProducto.titulo}
                    />
                    {selectedProducto.imagenes.length > 1 && (
                      <div className="modal-thumbnails">
                        {selectedProducto.imagenes.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            className={
                              currentImage === index ? 'active-thumb' : ''
                            }
                            onClick={() => setCurrentImage(index)}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="placeholder-img" />
                )}
              </div>
              {/* 🔹 Información */}
              <div className="modal-info">
                <h2>{selectedProducto.titulo}</h2>

                <p className="modal-brand">
                  {selectedProducto.marca}
                </p>

                {selectedProducto.descripcion && (
                  <p className="modal-description">
                    {selectedProducto.descripcion}
                  </p>
                )}
                {selectedProducto?.talla?.length ? (
                  <p className="modal-size">
                    <strong>Tallas:</strong>{' '}
                    {selectedProducto.talla?.join(' - ')}
                  </p>
                ) : null}
                {!selectedProducto.ocultarPrecio && (
                  <p className="modal-price">
                    ${(selectedProducto.precio ?? 0).toFixed(2)}
                  </p>
                )}
                <a
                  className="whatsapp-button"
                  href={`https://wa.me/527221331072?text=${encodeURIComponent(
                    `Hola, me interesa este producto: ${selectedProducto.titulo} - ${window.location.href}`
                  )}`}
                  target="_blank"
                >
                  Contactar para comprar
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}