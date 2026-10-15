export type Lang = "ca" | "es";
export type Copy = { ca: string; es: string };
export type Source = {
  id: string;
  title: string;
  url: string;
  publisher: string;
  date?: string;
};
export type Place = {
  id: string;
  name: Copy;
  estate: "solei" | "arnus";
  category: "heritage" | "nature" | "school";
  summary: Copy;
  detail: Copy;
  date?: string;
  sources: string[];
  x: number;
  y: number;
  coordinates?: [number, number];
};
export type Milestone = {
  year: string;
  title: Copy;
  text: Copy;
  sources: string[];
  status?: "verified" | "proposal" | "uncertain";
};
export type Media = {
  id: string;
  title: Copy;
  description: Copy;
  url: string;
  kind: "photo" | "video" | "document";
  period?: "historical";
  image?: string;
  credit: string;
  license: Copy;
  source: string;
  licenseUrl?: string;
  width?: number;
  height?: number;
};
export type Corpus = {
  reviewedAt: string;
  sources: Source[];
  places: Place[];
  history: Milestone[];
  curiosities: {
    id: string;
    title: Copy;
    text: Copy;
    sources: string[];
    placeId: string;
  }[];
  schools: { id: string; name: string; intro: Copy; milestones: Milestone[] }[];
  future: Milestone[];
  media: Media[];
  nature: Copy;
  intro: Copy;
  estates: { solei: Copy; arnus: Copy };
};
export type AgendaEvent = {
  id: string;
  title: Copy;
  description?: Copy;
  program?: {
    name: Copy;
    description: Copy;
    url: string;
  };
  start: string;
  end: string | null;
  allDay: boolean;
  timeZone: string;
  status: string;
  url: string;
  location: string;
  category: string;
};
export type Agenda = {
  checkedAt: string | null;
  mode: string;
  events: AgendaEvent[];
};
