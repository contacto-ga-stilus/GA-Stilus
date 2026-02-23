"use client";

import { useState, useEffect } from "react";
// firebase logic removed for now; stubbed below

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen?: string;
  categoria?: string;
}

interface Categoria {
  id: string;
  nombre: string;
}

export default function CaballeroProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    // datos de ejemplo sin Firebase
    setCategorias([
      { id: 'sudadera', nombre: 'Sudaderas' },
      { id: 'playera', nombre: 'Playeras' },
      { id: 'chamarra', nombre: 'Chamarras' },
    ]);
    setProductos([]);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImageFile(e.target.files[0]);
  };

  const resetForm = () => {
    setFormData({ nombre: "", descripcion: "", precio: "", categoria: "" });
    setImageFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      'Operación deshabilitada: la lógica de Firebase ha sido removida temporalmente.'
    );
    resetForm();
  };

  const handleDeleteProducto = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return;
    setProductos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEditProducto = (producto: Producto) => {
    setEditingId(producto.id);
    setFormData({
      nombre: producto.nombre || "",
      descripcion: producto.descripcion || "",
      precio: String(producto.precio ?? ""),
      categoria: producto.categoria || "",
    });
    setShowForm(true);
  };

  const displayedProductos = productos.filter((p) => {
    const matchesCategory = categoriaSeleccionada ? p.categoria === categoriaSeleccionada : true;
    const matchesSearch = p.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="admin-products">
      <div className="products-header">
        <div className="categories-row">
          <button
            className={`category-btn ${categoriaSeleccionada === "" ? "active" : ""}`}
            onClick={() => setCategoriaSeleccionada("")}
          >
            Todos
          </button>
          {categorias.map((c) => (
            <button
              key={c.id}
              className={`category-btn ${categoriaSeleccionada === c.id ? "active" : ""}`}
              onClick={() => setCategoriaSeleccionada(c.id)}
            >
              {c.nombre}
            </button>
          ))}
        </div>

        <div className="tools-row">
          <div className="search-wrap">
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button className="btn-nuevo" onClick={() => setShowForm((s) => !s)}>
              Nuevo Producto
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="product-form">
          <h3>{editingId ? "Editar Producto" : "Agregar Nuevo Producto"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <label>Nombre</label>
              <input name="nombre" value={formData.nombre} onChange={handleInputChange} required />
            </div>
            <div className="form-row">
              <label>Descripción</label>
              <textarea name="descripcion" value={formData.descripcion} onChange={handleInputChange} required />
            </div>
            <div className="form-row">
              <label>Precio</label>
              <input name="precio" type="number" step="0.01" value={formData.precio} onChange={handleInputChange} required />
            </div>
            <div className="form-row">
              <label>Categoría</label>
              <select name="categoria" value={formData.categoria} onChange={handleInputChange}>
                <option value="">-- Seleccionar --</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label>Imagen</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Guardando..." : editingId ? "Actualizar" : "Agregar"}</button>
              <button type="button" className="btn-secondary" onClick={resetForm}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <section className="products-list">
        {displayedProductos.length === 0 ? (
          <div className="catalog-empty">No hay productos</div>
        ) : (
          <div className="products-grid">
            {displayedProductos.map((p) => (
              <article key={p.id} className="product-card">
                <div className="card-media">
                  {p.imagen ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imagen} alt={p.nombre} />
                  ) : (
                    <div className="placeholder-img" />
                  )}
                </div>
                <div className="card-body">
                  <h4 className="card-title">{p.nombre}</h4>
                  <p className="card-desc">{p.descripcion}</p>
                  <div className="card-footer">
                    <span className="card-price">${(p.precio ?? 0).toFixed(2)}</span>
                    <div className="card-actions">
                      <button className="icon-btn edit" onClick={() => handleEditProducto(p)} aria-label="Editar">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="#1a3a47"/><path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#1a3a47"/></svg>
                      </button>
                      <button className="icon-btn delete" onClick={() => handleDeleteProducto(p.id)} aria-label="Eliminar">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12z" fill="#a33"/><path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#a33"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
