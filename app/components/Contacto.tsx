export default function Contacto() {
  return (
    <section id="contacto" className="contact-section">
      <div className="contact-container">

        {/* ================= Marca ================= */}
        <div className="contact-brand">
          <h2 className="brand-title">GA Stilus</h2>
          <p className="brand-description">
            Elegancia y estilo en cada detalle.
            Descubre nuestras colecciones y dejate soprender por la experiencia GA Stilus.
          </p>

          {/* ====== Redes Sociales ====== */}
          <div className="social-icons">

            {/* Facebook */}
            <a
              href="https://www.facebook.com/GAstilus/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="social-icon"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 
                5.373-12 12c0 5.99 4.388 10.954 
                10.125 11.854v-8.385H7.078v-3.47h3.047V9.43
                c0-3.007 1.792-4.669 4.533-4.669 
                1.312 0 2.686.235 2.686.235v2.953H15.83
                c-1.491 0-1.956.925-1.956 1.874v2.25h3.328
                l-.532 3.47h-2.796v8.385C19.612 
                23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/527221331072"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="social-icon"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967
                -.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 
                1.164-.173.199-.347.223-.644.075-.297-.15-1.255
                -.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059
                -.173-.297-.018-.458.13-.606.134-.133.298-.347
                .446-.52.149-.174.198-.298.298-.497.099-.198
                .05-.371-.025-.52-.075-.149-.669-1.612-.916
                -2.207-.242-.579-.487-.5-.669-.51-.173-.008
                -.371-.01-.57-.01-.198 0-.52.074-.792.372
                -.272.297-1.04 1.016-1.04 2.479 0 1.462 
                1.065 2.875 1.213 3.074.149.198 
                2.096 3.2 5.077 4.487.709.306 
                1.262.489 1.694.625.712.227 
                1.36.195 1.871.118.571-.085 
                1.758-.719 2.006-1.413.248-.694 
                .248-1.289.173-1.413-.074-.124
                -.272-.198-.57-.347" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/ga_stilus/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="social-icon"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07
                3.252.148 4.771 1.691 4.919 4.919.058 
                1.265.069 1.645.069 4.849 0 3.205
                -.012 3.584-.069 4.849-.149 3.225
                -1.664 4.771-4.919 4.919-1.266.058
                -1.644.07-4.85.07-3.204 0-3.584
                -.012-4.849-.07-3.26-.149-4.771
                -1.699-4.919-4.92-.058-1.265-.07
                -1.644-.07-4.849 0-3.204.013
                -3.583.07-4.849.149-3.227
                1.664-4.771 4.919-4.919 
                1.266-.057 1.645-.069 4.849-.069z" />
              </svg>
            </a>

            {/* Maps */}
            <a
              href="https://www.google.com/maps/search/?api=1&query=Paseo+Fidel+Velázquez+215,+Vértice,+50150+Toluca+de+Lerdo,+Méx."
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ubicación"
              className="social-icon"
            >
              📍
            </a>

          </div>
        </div>

        {/* ===== Contacto =====*/}
        <div>
          <h3 className="contact-subtitle">Contacto</h3>
          <p className="brand-description">📞 WhatsApp: 722 133 1072</p>
          <br />
          <p>Encuentranos en Bazar Pericoapa Toluca en planta baja entrada principal LOCAL 165.</p>
          <br />
          <p>Horario: Lunes a Sábado de 10:30 a 19:15 hrs y Domingos de 12:00 a 18:00 hrs.</p>
        </div>

        {/* ===== Ubicación ===== */}
        <div className="contact-location">
          <h3 className="contact-subtitle">Ubicación</h3>

          {/* Mapa embebido de Google */}
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps?q=Paseo+Fidel+Velázquez+215,+Vértice,+50150+Toluca+de+Lerdo,+Méx.&output=embed"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

      </div>
    </section>
  );
}