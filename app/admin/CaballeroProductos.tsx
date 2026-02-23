"use client";

import { useState, useEffect } from "react";
import { uploadFile, addDocument, getDocuments, deleteDocument } from "@/lib/firebaseUtils";

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
}

export default function CaballeroProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProductos();
  }, []);

  // Obtener productos de Firestore
  const loadProductos = async () => {
    try {
      const docs = await getDocuments("productos_caballero");
      setProductos(docs as Producto[]);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  // Manejar cambios en el formulario
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar selección de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Agregar nuevo producto
  const handleAddProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imagenURL = "";

      // Si hay una imagen, subirla a Storage
      if (imageFile) {
        const timestamp = Date.now();
        const path = `productos_caballero/${timestamp}_${imageFile.name}`;
        imagenURL = await uploadFile(imageFile, path);
      }

      // Agregar producto a Firestore
      const docId = await addDocument("productos_caballero", {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        imagen: imagenURL,
      });

      // Actualizar la lista local
      const newProducto: Producto = {
        id: docId,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        imagen: imagenURL,
      };

      setProductos((prev) => [...prev, newProducto]);

      // Limpiar formulario
      setFormData({ nombre: "", descripcion: "", precio: "" });
      setImageFile(null);

      alert("Producto agregado exitosamente");
    } catch (error) {
      console.error("Error agregando producto:", error);
      alert("Error al agregar el producto");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar producto
  const handleDeleteProducto = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      return;
    }

    try {
      await deleteDocument("productos_caballero", id);
      setProductos((prev) => prev.filter((p) => p.id !== id));
      alert("Producto eliminado exitosamente");
    } catch (error) {
      console.error("Error eliminando producto:", error);
      alert("Error al eliminar el producto");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Productos Caballero</h1>

      {/* Formulario para agregar productos */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Agregar Nuevo Producto</h2>
        <form onSubmit={handleAddProducto} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre del producto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción del producto"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Precio</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleInputChange}
              required
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Precio"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Agregando..." : "Agregar Producto"}
          </button>
        </form>
      </div>

      {/* Lista de productos */}
      <div>
        <h2 className="text-xl font-bold mb-4">Lista de Productos</h2>
        {productos.length === 0 ? (
          <p className="text-gray-500">No hay productos registrados</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {producto.imagen && (
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-bold">{producto.nombre}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {producto.descripcion}
                  </p>
                  <p className="text-xl font-bold text-blue-500 mb-4">
                    ${producto.precio.toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleDeleteProducto(producto.id)}
                    className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
