import ParkPage, { generateMetadata as generateParkMetadata } from "../[lang]/page";

export function generateMetadata() {
  return generateParkMetadata({ params: Promise.resolve({ lang: "ca" }) });
}

export default function Entry() {
  return <ParkPage params={Promise.resolve({ lang: "ca" })} />;
}
