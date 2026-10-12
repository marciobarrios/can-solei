import Link from "next/link";
import { GardenArt } from "@/components/garden-art";
export const metadata = {
  title: "Can Solei i Ca l’Arnús",
  robots: { index: false, follow: true },
};
export default function Entry() {
  return (
    <main className="entry-page">
      <div>
        <p>Badalona</p>
        <h1>
          Can Solei
          <br />i Ca l’Arnús
        </h1>
        <p>
          Un parc, moltes històries.
          <br />
          <span lang="es">Un parque, muchas historias.</span>
        </p>
        <div className="entry-links">
          <Link className="primary-link" href="/ca/" lang="ca">
            Explora en català
          </Link>
          <Link className="primary-link" href="/es/" lang="es">
            Explora en castellano
          </Link>
        </div>
      </div>
      <GardenArt />
    </main>
  );
}
