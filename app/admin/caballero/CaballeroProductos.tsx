"use client";

import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../../../lib/firebase";

// firebase logic implemented below

interface Producto {
  id: string;
  activo?: boolean;
  categoria?: string;
  descripcion?: string;
  genero?: string;
  imagenes?: string[];
  marca?: string;
  ocultarPrecio?: boolean;
  precio?: number;
  talla?: string[];
  titulo?: string;
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
    ocultarPrecio: false,
    categoria: "",
    genero: "",
    marca: "",
    talla: "", // comma-separated
    activo: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);

  useEffect(() => {
    fetchCategorias();
    fetchProductos();
  }, []);

  const fetchCategorias = async () => {
    try {
      const q = collection(db, "categorias");
      const snapshot = await getDocs(q);
      const cats: Categoria[] = snapshot.docs
        .filter((d) => {
          const data = d.data() as any;
          // only include active categories that have caballero in genero
          return data.activa !== false &&
            Array.isArray(data.genero) &&
            data.genero.includes("caballero");
        })
        .map((d) => ({ id: d.id, nombre: d.data().nombre || "" }));
      setCategorias(cats);
    } catch (err) {
      console.error("Error al cargar categorías", err);
    }
  };

  const fetchProductos = async () => {
    try {
      const q = collection(db, "productos");
      const snapshot = await getDocs(q);
      const prods: Producto[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...((d.data() as any) || {}),
      }));
      setProductos(prods as Producto[]);
    } catch (err) {
      console.error("Error al cargar productos", err);
    }
  };


  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImageFile(e.target.files[0]);
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      ocultarPrecio: false,
      categoria: "",
      genero: "",
      marca: "",
      talla: "",
      activo: true,
    });
    setImageFile(null);
    setExistingImageUrls([]);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validación: solo nombre, genero y categoría son requeridos
    if (!((formData as any).nombre?.trim())) {
      alert("El título del producto es requerido.");
      setLoading(false);
      return;
    }
    if (!((formData as any).genero?.trim())) {
      alert("El género es requerido.");
      setLoading(false);
      return;
    }
    if (!((formData as any).categoria?.trim())) {
      alert("La categoría es requerida.");
      setLoading(false);
      return;
    }

    // build payload matching schema
    const payload: any = {
      activo: (formData as any).activo,
      categoria: (formData as any).categoria,
      descripcion: (formData as any).descripcion || "",
      genero: (formData as any).genero,
      imagenes: existingImageUrls,
      marca: (formData as any).marca || "",
      ocultarPrecio: (formData as any).ocultarPrecio,
      precio: (formData as any).precio ? parseFloat((formData as any).precio) : 0,
      talla: ((formData as any).talla || "")
        .split(",")
        .map((t: string) => t.trim())
        .filter((t: string) => t !== ""),
      titulo: (formData as any).nombre,
    };

    try {
      if (editingId) {
        // actualizar documento existente
        await updateDoc(doc(db, "productos", editingId), payload);

        if (imageFile) {
          const url = await uploadImage(editingId, imageFile);
          const updatedImages = [...existingImageUrls, url];
          await updateDoc(doc(db, "productos", editingId), {
            imagenes: updatedImages,
          });
          setExistingImageUrls(updatedImages);
        }
      } else {
        // crear nuevo documento
        const docRef = await addDoc(collection(db, "productos"), payload);
        if (imageFile) {
          const url = await uploadImage(docRef.id, imageFile);
          await updateDoc(doc(db, "productos", docRef.id), {
            imagenes: [url],
          });
        }
      }
      await fetchProductos();
      resetForm();
    } catch (err) {
      console.error("Error guardando producto", err);
      alert("No se pudo guardar el producto. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (productId: string, file: File) => {
    const path = `productos/${productId}/${file.name}`;
    const sref = storageRef(storage, path);
    await uploadBytes(sref, file);
    const url = await getDownloadURL(sref);
    return url;
  };


  const handleDeleteProducto = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return;
    try {
      await deleteDoc(doc(db, "productos", id));
      setProductos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error eliminando producto", err);
      alert("No se pudo eliminar el producto.");
    }
  };

  const handleEditProducto = (producto: Producto) => {
    setEditingId(producto.id);
    setFormData({
      nombre: producto.titulo || "",
      descripcion: producto.descripcion || "",
      precio: String(producto.precio ?? ""),
      ocultarPrecio: producto.ocultarPrecio || false,
      categoria: producto.categoria || "",
      genero: producto.genero || "",
      marca: producto.marca || "",
      talla: (producto.talla || []).join(", "),
      activo: producto.activo !== false,
    });
    setImageFile(null);
    setExistingImageUrls(producto.imagenes || []);
    setShowForm(true);
  };

  const displayedProductos = productos.filter((p) => {
    const matchesCategory = categoriaSeleccionada ? p.categoria === categoriaSeleccionada : true;
    const name = p.titulo || "";
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="admin-products">
      <div className="products-header">
        <div className="tools-row">
          <div className="search-wrap">
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <label style={{ fontSize: '14px', color: '#1a3a47' }}>
              Filtrar por categoría:
            </label>
            <select
              className="category-select"
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
            <button className="btn-nuevo" onClick={() => setShowForm((s) => !s)}>
              Nuevo Producto
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? "Editar Producto" : "Agregar Nuevo Producto"}</h3>
            <form onSubmit={handleSubmit} className="product-form-grid">
              <div className="form-col">
                <div className="form-row">
                  <label>Nombre <span className="required">*</span></label>
                  <input name="nombre" value={(formData as any).nombre} onChange={handleInputChange} />
                </div>
                <div className="form-row">
                  <label>Descripción</label>
                  <textarea name="descripcion" value={(formData as any).descripcion} onChange={handleInputChange} />
                </div>
                <div className="form-row-double">
                  <div className="form-row">
                    <label>Precio</label>
                    <input name="precio" type="number" step="0.01" value={(formData as any).precio} onChange={handleInputChange} />
                  </div>
                  <div className="form-row checkbox-price">
                    <label>
                      <input
                        type="checkbox"
                        name="ocultarPrecio"
                        checked={(formData as any).ocultarPrecio}
                        onChange={handleInputChange}
                      /> No mostrar precio
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-col">
                <div className="form-row">
                  <label>Categoría <span className="required">*</span></label>
                  <select name="categoria" value={(formData as any).categoria} onChange={handleInputChange}>
                    <option value="">-- Seleccionar --</option>
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <label>Marca</label>
                  <input name="marca" value={(formData as any).marca} onChange={handleInputChange} />
                </div>
                <div className="form-row">
                  <label>Género <span className="required">*</span></label>
                  <select name="genero" value={(formData as any).genero} onChange={handleInputChange}>
                    <option value="">-- Seleccionar --</option>
                    <option value="caballero">Caballero</option>
                    <option value="dama">Dama</option>
                  </select>
                </div>
                <div className="form-row">
                  <label>Tallas (separadas por coma)</label>
                  <input name="talla" value={(formData as any).talla} onChange={handleInputChange} />
                </div>
              </div>

              <div className="form-full">
                <div className="form-row">
                  <label>Imágenes del Producto</label>
                  {existingImageUrls.length > 0 && (
                    <div className="images-preview-grid">
                      {existingImageUrls.map((url, idx) => (
                        <div key={idx} className="image-preview-container">
                          <img src={url} alt={`Preview ${idx + 1}`} className="image-preview" />
                          <button
                            type="button"
                            className="btn-delete-image"
                            onClick={() => {
                              setExistingImageUrls((prev) => prev.filter((_, i) => i !== idx));
                            }}
                            title="Eliminar imagen"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="file-upload-container">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="file-input" id="uploader" />
                    <label htmlFor="uploader" className="file-upload-label">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      <span className="file-upload-text">
                        {imageFile ? imageFile.name : 'Selecciona una imagen'}
                      </span>
                    </label>
                  </div>
                </div>
                <div className="form-row">
                  <label>
                    <input
                      type="checkbox"
                      name="activo"
                      checked={(formData as any).activo}
                      onChange={handleInputChange}
                    /> Producto Activo
                  </label>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? "Guardando..." : editingId ? "Actualizar" : "Agregar"}
                  </button>
                  <button type="button" className="btn-secondary" onClick={resetForm}>Cancelar</button>
                </div>
              </div>
            </form>
          </div>
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
                  {p.imagenes && p.imagenes.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imagenes[0]} alt={p.titulo} />
                  ) : (
                    <div className="placeholder-img" />
                  )}
                </div>
                <div className="card-body">
                  <h4 className="card-title">{p.titulo}</h4>
                  <p className="card-brand">{p.marca}</p>
                  {!p.ocultarPrecio && (
                    <span className="card-price">${(p.precio ?? 0).toFixed(2)}</span>
                  )}
                  <div className="card-actions">
                    <button className="icon-btn edit" onClick={() => handleEditProducto(p)} aria-label="Editar">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="#1a3a47"/><path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#1a3a47"/></svg>
                    </button>
                    <button className="icon-btn delete" onClick={() => handleDeleteProducto(p.id)} aria-label="Eliminar">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12z" fill="#a33"/><path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#a33"/></svg>
                    </button>
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
