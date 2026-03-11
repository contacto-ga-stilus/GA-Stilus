"use client";

import React, { useState, useEffect } from "react";
//Importamos funciones de Firebase para manejar la base de datos
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
//Importamos funcuiones de Storage para manejar las imágenes
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
//Configuración de Firebase
import { db, storage } from "../../../lib/firebase";

//Define la estructura de un producto
interface Producto {
  id: string;
  activo?: boolean;
  categoria?: string;
  createdAt?: number | { _seconds: number; _nanoseconds: number };
  descripcion?: string;
  favoritoDama?: boolean;
  genero?: string;
  imagenes?: string[];
  marca?: string;
  ocultarPrecio?: boolean;
  precio?: number;
  talla?: string[];
  titulo?: string;
}
//Define la estructura de una categoría
interface Categoria {
  id: string;
  nombre: string;
}
//Componente principal para gestionar productos de Dama en el panel de administración
export default function DamaProductos() {
  //Estados para manejar la lista de productos y categorías, así como el estado de carga
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  //Estados para manejar el formulario de creación/edición de productos
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  //Estados para manejar el formulario de creación/edición de productos
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  //Estados para manejar la ventana modal de favoritos
  const [showFavs, setShowFavs] = useState(false);
  // Estado para almacenar la categoría seleccionada en el modal de favoritos
  const [favsCategorySelected, setFavsCategorySelected] = useState<string | null>(null);
  // Estado para controlar la apertura del segundo modal de productos favoritos por categoría
  const [showFavsProductsModal, setShowFavsProductsModal] = useState(false);
  //Datos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    ocultarPrecio: false,
    categoria: "",
    genero: "",
    marca: "",
    talla: "", //separada por comas
    activo: true,
  });
  //Estados para manejar la subida de imágenes
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  //Carga inicial de productos y categorías al montar el componente
  useEffect(() => {
    fetchCategorias();
    fetchProductos();
  }, []);
  //Función para cargar categorías desde Firestore, filtrando solo las activas para dama
  const fetchCategorias = async () => {
    try {
      const q = collection(db, "categorias");
      const snapshot = await getDocs(q);
      const cats: Categoria[] = snapshot.docs
        .filter((d) => {
          const data = d.data() as any;
          //Solo se incluyen categorías que estén activas y tengan "dama" en su género
          return data.activa !== false &&
            Array.isArray(data.genero) &&
            data.genero.includes("dama");
        })
        .map((d) => ({ id: d.id, nombre: d.data().nombre || "" }));
      setCategorias(cats);
    } catch (err) {
      console.error("Error al cargar categorías", err);
    }
  };
  //Función para cargar productos desde Firestore
  const fetchProductos = async () => {
    try {
      const q = collection(db, "productos");
      const snapshot = await getDocs(q);
      const prods: Producto[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...((d.data() as any) || {}),
      }))
      //Solo mostramos productos del género dama en este panel
      .filter((p) => (p.genero || "").toLowerCase() === "dama");
      setProductos(prods as Producto[]);
    } catch (err) {
      console.error("Error al cargar productos", err);
    }
  };
  //Función para manejar cambios en los inputs del formulario
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
  //Función para manejar la selección de imagen en el formulario
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImageFile(e.target.files[0]);
  };
  //Función para resetear el formulario a su estado inicial
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
  //Función para manejar el envío del formulario, tanto para crear como para actualizar productos
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
    //Construcción del payload para Firestore, transformando los datos del formulario al formato esperado
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
    //Si se está editando un producto existente, se actualiza; si no, se crea uno nuevo
    try {
      if (editingId) {
        //actualizar documento existente
        await updateDoc(doc(db, "productos", editingId), payload);
        //Si se seleccionó una nueva imagen, se sube y se actualiza el documento con la nueva URL
        if (imageFile) {
          const url = await uploadImage(editingId, imageFile);
          const updatedImages = [...existingImageUrls, url];
          await updateDoc(doc(db, "productos", editingId), {
            imagenes: updatedImages,
          });
          setExistingImageUrls(updatedImages);
        }
      } else {
        //crear nuevo documento
        const docRef = await addDoc(collection(db, "productos"), {
          ...payload,
          // En productos nuevos el favorito inicia en falso para dama
          favoritoDama: false,
          // Timestamp de creación para soportar orden por recientes en catálogo
          createdAt: Date.now(),
        });
        if (imageFile) {
          const url = await uploadImage(docRef.id, imageFile);
          await updateDoc(doc(db, "productos", docRef.id), {
            imagenes: [url],
          });
        }
      }
      //Después de guardar, se recargan los productos y se resetea el formulario
      await fetchProductos();
      resetForm();
    } catch (err) {
      console.error("Error guardando producto", err);
      alert("No se pudo guardar el producto. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  };
  //Función para subir una imagen a Firebase Storage y obtener su URL
  const uploadImage = async (productId: string, file: File) => {
    const path = `productos/${productId}/${file.name}`;
    const sref = storageRef(storage, path);
    await uploadBytes(sref, file);
    const url = await getDownloadURL(sref);
    return url;
  };
  //Función para eliminar un producto, incluyendo sus imágenes asociadas en Storage
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
  //Función para manejar la edición de un producto, cargando sus datos en el formulario
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
  //Filtrado de productos para mostrar en la lista, combinando filtro por categoría y búsqueda por nombre
  const displayedProductos = productos.filter((p) => {
    const matchesCategory = categoriaSeleccionada ? p.categoria === categoriaSeleccionada : true;
    const name = p.titulo || "";
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  // Filtrado de productos por la categoría seleccionada dentro del flujo de favoritos
  const favsCategoryProducts = productos.filter(
    (p) => (favsCategorySelected ? p.categoria === favsCategorySelected : false)
  );
  // Función para abrir productos de la categoría seleccionada dentro del flujo de favoritos
  const handleSelectFavsCategory = (categoryId: string) => {
    setFavsCategorySelected(categoryId);
    setShowFavs(false);
    setShowFavsProductsModal(true);
  };
  // Función para volver del modal de productos al modal de categorías
  const handleBackToFavsCategories = () => {
    setShowFavsProductsModal(false);
    setShowFavs(true);
  };
  // Función para confirmar la selección de favoritos de la categoría elegida
  const handleConfirmFavsCategory = () => {
    if (!favsCategorySelected) return;
    const selectedCategoryName =
      categorias.find((c) => c.id === favsCategorySelected)?.nombre || "la categoría seleccionada";

    setShowFavs(false);
    alert(`Favoritos de ${selectedCategoryName} confirmados correctamente.`);
  };
  // Función para cerrar el segundo modal de productos favoritos y limpiar la categoría seleccionada
  const handleCloseFavsProductsModal = () => {
    setShowFavsProductsModal(false);
    setFavsCategorySelected(null);
  };
  // Función para alternar el favorito de dama y guardarlo en Firestore
  const handleToggleFavoriteProduct = async (productId: string) => {
    const productoActual = productos.find((p) => p.id === productId);
    if (!productoActual) return;

    const nextFavoriteValue = !Boolean(productoActual.favoritoDama);

    try {
      // Actualizamos en base de datos para que el favorito se refleje en el catálogo de usuarios
      await updateDoc(doc(db, "productos", productId), {
        favoritoDama: nextFavoriteValue,
      });

      // Actualizamos el estado local para reflejar el cambio de inmediato en la UI del admin
      setProductos((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, favoritoDama: nextFavoriteValue }
            : p
        )
      );
    } catch (err) {
      console.error("Error actualizando favorito de dama", err);
      alert("No se pudo actualizar el favorito. Intenta nuevamente.");
    }
  };
  //Renderizado del componente, incluyendo el header con filtros y el formulario modal para crear/editar productos
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
            <button className="btn-dama" onClick={() => setShowForm((s) => !s)}>
              Nuevo Producto
            </button>
            <button className="btn-favoritos" onClick={() => setShowFavs((s) => !s)}>
              Favoritos
            </button>
          </div>
        </div>
      </div>
      {/* MODAL DE FAVORITOS: Muestra una ventana con los botones de categorías de dama */}
      {showFavs && (
        <div className="modal-overlay" onClick={() => setShowFavs(false)}>
          <div className="modal-content modal-favs" onClick={(e) => e.stopPropagation()}>
            {/* Título del modal de favoritos */}
            <h3>Seleccionar Categoría de Favoritos</h3>
            
            {/* Contenedor con los botones de categorías */}
            <div className="favs-categories-grid">
              {/* Se mapean todas las categorías de dama y se crean botones para cada una */}
              {categorias.map((categoria) => (
                <button
                  type="button"
                  key={categoria.id}
                  className={`btn-category-fav ${favsCategorySelected === categoria.id ? 'active' : ''}`}
                  onClick={() => handleSelectFavsCategory(categoria.id)}
                >
                  {/* Nombre de la categoría */}
                  {categoria.nombre}
                </button>
              ))}
            </div>

            {/* Botones de acción: Aceptar y Cancelar */}
            <div className="favs-actions">
              {/* Botón para aceptar la selección final de favoritos y mostrar confirmación */}
              <button 
                type="button"
                className="btn-fav-confirm" 
                onClick={handleConfirmFavsCategory}
                disabled={!favsCategorySelected}
              >
                Aceptar
              </button>
              {/* Botón para cancelar y cerrar el modal */}
              <button 
                type="button"
                className="btn-fav-cancel" 
                onClick={() => {
                  setShowFavs(false);
                  setFavsCategorySelected(null);
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEGUNDO MODAL DE FAVORITOS: Muestra los productos de la categoría elegida en cards alargadas */}
      {showFavsProductsModal && (
        <div className="modal-overlay" onClick={handleCloseFavsProductsModal}>
          <div className="modal-content modal-favs" onClick={(e) => e.stopPropagation()}>
            {/* Título del modal que muestra la categoría seleccionada por nombre */}
            <h3>
              Productos de {categorias.find((c) => c.id === favsCategorySelected)?.nombre || "Categoría"}
            </h3>

            {/* Lista de productos con formato de card alargada y botón de estrella al final */}
            <div className="fav-products-list">
              {favsCategoryProducts.length === 0 ? (
                <div className="catalog-empty">No hay productos en esta categoría</div>
              ) : (
                favsCategoryProducts.map((producto) => {
                  // Determinamos si el producto ya está marcado como favorito desde Firestore
                  const isActiveStar = Boolean(producto.favoritoDama);

                  return (
                    <article key={producto.id} className="fav-product-card">
                      {/* Contenido textual de la card: solo título y marca */}
                      <div className="fav-product-info">
                        <h4 className="fav-product-title">{producto.titulo || "Sin título"}</h4>
                        <p className="fav-product-brand">{producto.marca || "Sin marca"}</p>
                      </div>

                      {/* Botón de estrella: gris por defecto y azul cuando está activa */}
                      <button
                        type="button"
                        className={`fav-star-btn ${isActiveStar ? "active" : ""}`}
                        aria-label={`Marcar ${producto.titulo || "producto"} como favorito`}
                        onClick={() => handleToggleFavoriteProduct(producto.id)}
                      >
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
                          <path d="M12 2l2.98 6.04L21.6 9l-4.8 4.68 1.14 6.63L12 17.27l-5.94 3.04 1.14-6.63L2.4 9l6.62-.96L12 2z" />
                        </svg>
                      </button>
                    </article>
                  );
                })
              )}
            </div>

            {/* Acciones del segundo modal: volver al modal de categorías */}
            <div className="favs-actions">
              <button type="button" className="btn-fav-cancel" onClick={handleBackToFavsCategories}>
                Volver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulario modal para crear o editar productos */ }
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
              {/* Columna derecha del formulario con campos de categoría, marca, género y talla */ }
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
                    <option value="dama">Dama</option>
                  </select>
                </div>
                <div className="form-row">
                  <label>Tallas (separadas por coma)</label>
                  <input name="talla" value={(formData as any).talla} onChange={handleInputChange} />
                </div>
              </div>
              {/* Sección para manejar la subida de imágenes, mostrando previews de las imágenes existentes y permitiendo eliminar o agregar nuevas imágenes */ }
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
      {/* Lista de productos, mostrando solo los que coinciden con el filtro de categoría y búsqueda por nombre */ }
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