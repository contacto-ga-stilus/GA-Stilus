import Header from "./components/Header";
import Inicio from "./components/Inicio";
import CatalogoCaballero from "./components/CatalogoCaballero";
import CatalogoDama from "./components/CatalogoDama";
import Contacto from "./components/Contacto";


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