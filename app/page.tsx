import Header from "./components/Header";
import Inicio from "./components/Inicio";
import CatalogoCaballero from "./components/CatalogoCaballero";
import CatalogoDama from "./components/CatalogoDama";
import Contacto from "./components/Contacto";


export default function Home() {
  return (
    <div>
      <p>API Key: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY}</p>
      <p>Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</p>
    </div>
  );
}

/*
export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Inicio />
        <CatalogoCaballero />
        <CatalogoDama />
        <Contacto />
      </main>
    </>
  );
}

*/