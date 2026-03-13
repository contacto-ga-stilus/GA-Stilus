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
                <path d="M13.601 2.326A9.887 9.887 0 0 0 3.417 17.28L2 22l4.848-1.272a9.887 9.887 0 0 0 4.722 1.2h.004c5.46 0 9.897-4.438 9.897-9.898A9.86 9.86 0 0 0 13.6 2.326zM11.574 20.25h-.003a8.21 8.21 0 0 1-4.188-1.147l-.3-.178-2.876.754.768-2.805-.195-.289a8.214 8.214 0 0 1-1.326-4.438c0-4.532 3.688-8.22 8.222-8.22a8.18 8.18 0 0 1 5.812 2.406 8.182 8.182 0 0 1 2.41 5.813c0 4.532-3.69 8.221-8.224 8.221zm4.51-6.126c-.246-.123-1.457-.719-1.684-.801-.225-.082-.39-.123-.554.124-.164.246-.636.8-.78.965-.144.164-.288.185-.533.062-.246-.123-1.038-.383-1.978-1.22-.731-.651-1.225-1.455-1.368-1.701-.143-.246-.015-.379.108-.502.11-.109.246-.287.369-.43.123-.143.164-.246.246-.41.082-.164.041-.307-.02-.43-.062-.123-.554-1.336-.758-1.83-.2-.48-.403-.416-.553-.423l-.472-.008c-.164 0-.43.062-.656.307-.225.246-.86.84-.86 2.05 0 1.21.881 2.379 1.004 2.543.123.164 1.734 2.648 4.2 3.715.587.254 1.044.406 1.401.52.59.188 1.126.161 1.55.098.472-.07 1.457-.596 1.663-1.172.205-.575.205-1.068.143-1.172-.062-.102-.225-.164-.472-.287z" />
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
                <path d="M8 3C5.243 3 3 5.243 3 8v8c0 2.757 2.243 5 5 5h8c2.757 0 5-2.243 5-5V8c0-2.757-2.243-5-5-5H8zm8 1.5A3.5 3.5 0 0 1 19.5 8v8a3.5 3.5 0 0 1-3.5 3.5H8A3.5 3.5 0 0 1 4.5 16V8A3.5 3.5 0 0 1 8 4.5h8zm-4 2.75A4.75 4.75 0 1 0 12 16.75 4.75 4.75 0 0 0 12 7.25zm0 1.5A3.25 3.25 0 1 1 8.75 12 3.254 3.254 0 0 1 12 8.75zm5.25-1.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z" />
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