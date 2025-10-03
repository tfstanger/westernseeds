import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail } from "lucide-react";

/*****************
 * ASSETS (logos & imagery)
 *****************/
const LOGO_1X =
  "https://img1.wsimg.com/isteam/ip/ebc3b35b-2daf-491e-abf9-74774e8f47b7/Western%20Seeds%20Logo%20transparent%20background.png/:/rs=h:540,cg:true,m/qt=q:100";
const LOGO_2X =
  "https://img1.wsimg.com/isteam/ip/ebc3b35b-2daf-491e-abf9-74774e8f47b7/Western%20Seeds%20Logo%20transparent%20background.png/:/rs=h:1080,cg:true,m/qt=q:100";
const LOGO_3X =
  "https://img1.wsimg.com/isteam/ip/ebc3b35b-2daf-491e-abf9-74774e8f47b7/Western%20Seeds%20Logo%20transparent%20background.png/:/rs=h:1620,cg:true,m/qt=q:100";
// Home hero background (uploaded image + fallback)
const HERO_IMGS = [
  "/mnt/data/4fd2d11f-6d69-4d3e-8e66-4cc5d00de162.png", // wheat field (new upload)
  "/mnt/data/7e81c68c-0054-413c-8a8a-eddbcd4c688c.png", // earlier wheat field upload
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1920&auto=format&fit=crop" // public fallback
];

/*****************
 * BRAND THEME (single, valid CSS block)
 *****************/
function BrandStyles() {
  return (
    <style>{`
      :root { --brand: #0e5a2a; }

      /* Global type scale */
      html { font-size: 18px; }
      @media (min-width: 768px) { html { font-size: 19px; } }
      @media (min-width: 1280px) { html { font-size: 20px; } }

      .brand-text { color: var(--brand); }
      .brand-bg { background-color: var(--brand); }
      .brand-border { border-color: var(--brand); }
      .brand-link { color: var(--brand); text-decoration: none; }
      .brand-link:hover { text-decoration: underline; }

      /* Improve logo sharpness on HiDPI */
      img[data-testid="logo-img"] {
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
      }

      /* Home hero background helpers */
      .home-hero { position: relative; overflow: hidden; }
      .home-hero .bg-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
      .home-hero .shade { position:absolute; inset:0; background:linear-gradient(to bottom, rgba(255,255,255,0.85), rgba(255,255,255,0.65)); }

      .home-hero .content-card {
        background: rgba(255,255,255,0.88);
        backdrop-filter: blur(2px);
        border-radius: 1rem;
      }
    `}</style>
  );
}

/*****************
 * LOGO (HiDPI, crisp)
 *****************/
function LogoImg({ className = "h-36 md:h-44 w-auto" }: { className?: string }) {
  return (
    <img
      src={LOGO_1X}
      srcSet={`${LOGO_1X} 1x, ${LOGO_2X} 2x, ${LOGO_3X} 3x`}
      alt="Western Seeds logo"
      className={className}
      decoding="async"
      loading="eager"
      fetchPriority="high"
      sizes="(min-width: 768px) 560px, 400px"
      data-testid="logo-img"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";
      }}
    />
  );
}

function HeroBackground() {
  const [idx, setIdx] = React.useState(0);
  const src = HERO_IMGS[idx];
  return (
    <img
      key={src}
      src={src}
      alt="Wheat field with mountains"
      className="bg-img"
      onError={() => setIdx((i) => (i + 1 < HERO_IMGS.length ? i + 1 : i))}
    />
  );
}

/*****************
 * ROUTER (hash)
 *****************/
function useHashRoute(): string {
  const getHash = () => (typeof window !== "undefined" ? window.location.hash.slice(1) || "/" : "/");
  const [route, setRoute] = useState<string>(getHash());

  useEffect(() => {
    const onHash = () => setRoute(getHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Ensure we always open on Home when no hash is present
  useEffect(() => {
    if (typeof window !== "undefined" && (!window.location.hash || window.location.hash === "#")) {
      window.location.hash = "#/";
      setRoute("/");
    }
  }, []);

  return route;
}

/*****************
 * DATA TYPES & HELPERS
 *****************/
 type Variety = {
  name: string;           // display name
  orgNote?: string;       // small italic line under title (contents of parentheses)
  agronomic: string[];    // bullets
  disease: string[];      // bullets
  slug?: string;          // url slug
};
 type VarietyMap = Record<string, Variety[]>; // key = group slug

 function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
 }
 function withSlugs(list: Variety[]): Variety[] { return list.map((v) => ({ ...v, slug: v.slug || slugify(v.name) })); }

// Extract note in parentheses for display under a title
function TitleWithNote({ label }: { label: string }) {
  const m = label.match(/^(.*?)\s*\((.+)\)\s*$/);
  const title = m ? m[1] : label;
  const note = m ? m[2] : "";
  return (
    <div>
      <div>{title}</div>
      {note && <div className="text-xs italic text-neutral-600">({note})</div>}
    </div>
  );
}

/*****************
 * GROUP TITLES (clean names only)
 *****************/
const WINTER_TITLES: Record<string, string> = {
  "hard-red-winter-wheat": "Hard Red Winter Wheat",
  "soft-white-winter-wheat": "Soft White Winter Wheat",
  triticale: "Triticale",
  "winter-barley": "Winter Barley",
};

const SPRING_TITLES: Record<string, string> = {
  "hard-red-spring-wheat": "Hard Red Spring Wheat",
  "hard-white-spring-wheat": "Hard White Spring Wheat",
  "soft-white-spring-wheat": "Soft White Spring Wheat",
  triticale: "Triticale",
  "malt-barley": "Malt Barley",
  "feed-barley": "Feed Barley",
  "forage-barley": "Forage Barley",
  oats: "Oats",
};

/*****************
 * WINTER DATA (uniform: Agronomic Characteristics + Disease Resistance)
 *****************/
const WINTER_DATA: VarietyMap = {
  "hard-red-winter-wheat": withSlugs([
    {
      name: "LCS Jet",
      orgNote: "(Limagrain)",
      agronomic: [
        "Medium Maturity; Short–Medium Height; Strong Straw",
        "Broadly Adapted In Dryland & Irrigated; Good Test Weight",
      ],
      disease: ["Resistant To Strawbreaker Foot Rot", "Moderately Susceptible To Stripe Rust; Monitor"],
    },
    {
      name: "Keldin",
      orgNote: "(WestBred)",
      agronomic: ["Medium Maturity; Strong Standability", "High Test Weight; Broad Adaptation In Northern Intermountain"],
      disease: ["Very Good Tolerance To Stripe Rust, Leaf Rust, Powdery Mildew", "Hollow‑Stem; Assess Sawfly Risk"],
    },
    {
      name: "CS Bridger CLP",
      orgNote: "(Circle S / Clearfield® Plus)",
      agronomic: ["Early Heading; Semi‑Dwarf; Good Test Weight", "Hollow Stem; Suited To Montana/Intermountain Zones"],
      disease: ["Moderate Resistance To Stripe Rust", "Moderate Susceptibility To Stem Rust"],
    },
  ]),

  "soft-white-winter-wheat": withSlugs([
    {
      name: "WB1783",
      orgNote: "(WestBred)",
      agronomic: ["Medium‑Late; Medium‑Tall; Very Good Standability", "High Test Weight And Protein"],
      disease: ["Excellent Stripe Rust Tolerance", "Moderate FHB Tolerance"],
    },
    {
      name: "WB1529",
      orgNote: "(WestBred)",
      agronomic: [
        "Medium Maturity; Excellent Tillering & Standability",
        "High Test Weight And Milling/Baking Quality",
      ],
      disease: ["Very Good Stripe Rust Tolerance", "Resistant To Dwarf Bunt"],
    },
    {
      name: "WB1621",
      orgNote: "(WestBred)",
      agronomic: [
        "Medium‑Late; Awnless (Dual‑Purpose Forage/Grain)",
        "Excellent Standability And Test Weight",
      ],
      disease: ["Very Good Stripe Rust Tolerance", "Susceptible To Hessian Fly"],
    },
    {
      name: "SY Ovation",
      orgNote: "(Syngenta AgriPro)",
      agronomic: ["Medium Maturity; Medium‑Short; Good Emergence & Straw Strength", "Very Good Test Weight"],
      disease: ["Good Stripe Rust Tolerance", "Resistant To Soil‑Borne Mosaic Virus"],
    },
    {
      name: "VI Shock",
      orgNote: "(Limagrain / University Of Idaho)",
      agronomic: ["Medium Maturity; ~34–35 In; Excellent Straw Strength", "~60 Lb/Bu Test Weight; ~10% Protein"],
      disease: [
        "Excellent Stripe Rust Tolerance",
        "Resistant To Soil‑Borne Mosaic; Moderate Cephalosporium Stripe",
      ],
    },
    {
      name: "AP Exceed",
      orgNote: "(Syngenta AgriPro)",
      agronomic: ["Very Early; Medium‑Short; Very Good Straw Strength", "Very Good–Excellent Winter Hardiness & Test Weight"],
      disease: ["Strong Stripe Rust Tolerance", "Very Good Septoria Tolerance"],
    },
    {
      name: "Piranha CL+",
      orgNote: "(Washington State University / Clearfield® Plus)",
      agronomic: ["Medium Maturity; Medium‑Tall; Very Good Emergence", "High Test Weight; Very Good Winter Hardiness"],
      disease: ["Excellent Adult‑Plant Stripe Rust Resistance", "Tolerance To Snow Mold; Ceph Stripe; Strawbreaker"],
    },
    {
      name: "Sockeye CL+",
      orgNote: "(Washington State University / Clearfield® Plus)",
      agronomic: ["Medium Maturity; Medium‑Tall; Good Emergence", "High Test Weight; Very Good Winter Hardiness"],
      disease: ["Excellent Stripe Rust Resistance", "Tolerance To Snow Mold, Ceph Stripe, Strawbreaker"],
    },
    {
      name: "Nova AX",
      orgNote: "(Washington State University / CoAXium®)",
      agronomic: ["Medium Maturity; Good Emergence; Broadly Adapted", "Good End‑Use Quality"],
      disease: ["Adult‑Plant Stripe Rust Resistance", "Slightly Better Snow Mold Tolerance Vs Some AX Lines"],
    },
    {
      name: "LCS Kraken AX",
      orgNote: "(Limagrain CoAXium®)",
      agronomic: ["Medium‑Early; Medium‑Tall; Good Straw Strength", "Very Good Winter Survival; Moderate Test Weight"],
      disease: ["Monitor Stripe Rust (Lower Resistance)", "Good Overall Stress Tolerance"],
    },
  ]),

  triticale: withSlugs([
    {
      name: "Forerunner",
      orgNote: "(Oregon State University)",
      agronomic: [
        "Awnless Heads; Tall (50–60 In) With High Leaf:Stem Ratio",
        "Facultative Growth; Fall Or Early Spring Planting; Excellent For Hay/Silage/Grazing",
      ],
      disease: [
        "Reported Resistance To Current Stem & Leaf Rust Races",
        "Susceptible In Some Reports To Tilletia Caries / Septoria Nodorum",
      ],
    },
  ]),

  "winter-barley": withSlugs([
    {
      name: "UT‑10201",
      orgNote: "(Utah State University)",
      agronomic: [
        "6‑Row, Hulled, Awned Feed Barley; Early Heading; Medium Height",
        "Very Good Winter Hardiness; Average Test Weight",
      ],
      disease: [
        "Good Resistance To Common Barley Diseases",
        "Moderate Lodging Resistance — Monitor Under High Irrigation",
      ],
    },
  ]),
};

/*****************
 * SPRING DATA (uniform)
 *****************/
const SPRING_DATA: VarietyMap = {
  "hard-red-spring-wheat": withSlugs([
    {
      name: "WB9668",
      orgNote: "(WestBred)",
      agronomic: [
        "Medium‑Late; ~23 In Plant Height; Excellent Standability & Tillering",
        "High Protein (~16.5%); Excellent Milling/Baking; Strong Falling Number",
      ],
      disease: [
        "Excellent Stripe Rust Resistance; Very Good Scab Tolerance",
        "Resistant To Hessian Fly",
      ],
    },
  ]),

  "hard-white-spring-wheat": withSlugs([
    {
      name: "UI Gold",
      orgNote: "(University Of Idaho)",
      agronomic: ["High Yield Potential (Irrigated); ~68 Lb/Bu Test Weight", "Medium Height; Strong Straw"],
      disease: ["Resistant To Key Stripe Rust Races", "Limited FHB Resistance"],
    },
    {
      name: "Dayn",
      orgNote: "(Washington State University/Syngenta)",
      agronomic: [
        "Medium‑Early; Medium Height; Good–Excellent Straw Strength",
        "Very Good Test Weight; High Yield Under Irrigation",
      ],
      disease: [
        "Excellent Stripe Rust Resistance",
        "Moderate FHB Tolerance; Susceptible To Hessian Fly",
      ],
    },
    {
      name: "WB7202CLP",
      orgNote: "(WestBred / Clearfield® Plus)",
      agronomic: [
        "Medium‑Early; Strong Emergence (WB Rating ‘1’); Type‑A Standability",
        "High Yield Potential With Strong Dryland Performance; Positioned For PNW Dryland & Irrigated",
      ],
      disease: [
        "Rated Resistant To Stripe Rust In Washington State University Tables",
        "Two‑Gene Clearfield® Plus Tolerance (Use Beyond®/Beyond Xtra® Only Per Label)",
      ],
    },
  ]),

  "soft-white-spring-wheat": withSlugs([
    {
      name: "WB6430",
      orgNote: "(WestBred)",
      agronomic: ["Medium Maturity; ~32–33 In; Excellent Standability", "High Test Weight; Top Trial Yields (Irrigated)"] ,
      disease: ["Excellent Stripe & Leaf Rust Tolerance", "Moderate FHB Resistance"],
    },
    {
      name: "UI Stone",
      orgNote: "(University Of Idaho)",
      agronomic: ["Medium Height; Early‑Leaning Maturity; Strong End‑Use Quality", "Good Fit Irrigated & Dryland"],
      disease: ["Good FHB Resistance (Fhb1 + Second Gene)", "Solid Overall Disease Package"],
    },
  ]),

  triticale: withSlugs([
    {
      name: "Forerunner",
      orgNote: "(Oregon State University)",
      agronomic: ["Awnless; Tall Forage Type; Flexible Fall Or Spring Planting", "High Forage Yield; Palatable Stems; High Leaf:Stem Ratio"],
      disease: ["Resistance Noted To Stem & Leaf Rust Races", "Susceptibility Reported To Some Seed‑Borne/Leaf Diseases"],
    },
  ]),

  "malt-barley": withSlugs([
    {
      name: "LCS Odyssey",
      orgNote: "(Limagrain)",
      agronomic: ["Two‑Row Malting; Medium Height; Excellent Standability", "High Plumpness; Adapted Across ID/PNW"],
      disease: ["Excellent Cereal Cyst Nematode Resistance", "Solid Overall Disease Package"],
    },
  ]),

  // Combined feed barley group with individual variety cards
  "feed-barley": withSlugs([
    {
      name: "Altorado",
      orgNote: "(Highland Specialty Grains) — Two‑Row",
      agronomic: ["Early–Medium; ~36 In; Strong Standability", "High Grain & Forage Yield Potential"],
      disease: ["Leaf Disease Tolerance Noted", "FHB Tolerance Referenced In Materials"],
    },
    {
      name: "Millennium",
      orgNote: "(University Of Idaho) — Six‑Row",
      agronomic: ["Early–Mid Heading (~Late June In Trials); ~36 In", "Good Standability; Favorable Test Weight For Feed"],
      disease: ["Resistance To Common Barley Diseases", "Low Lodging Observed In Trials"],
    },
  ]),

  "forage-barley": withSlugs([
    {
      name: "Vaquero",
      orgNote: "(WestBred)",
      agronomic: ["Two‑Row Hooded Forage Barley; ~45 In; High Tillering", "Heads ~81.5 Days; Excellent Standability; High RFV/TDN"],
      disease: ["Tolerance To BYDV Reported", "Good Overall Field Tolerance"],
    },
  ]),

  oats: withSlugs([
    {
      name: "Monida",
      orgNote: "(USDA‑ARS)",
      agronomic: ["Medium Height (≈2.5–3.5 Ft); Mid‑Season Maturity", "Plump, Short, White Kernels; Widely Adapted; Strong Forage Option"],
      disease: ["Susceptible To Crown Rust And Some Stem Rust Races", "Intermediate Test Weight Vs Peers"],
    },
  ]),
};

/*****************
 * SMALL UI HELPERS
 *****************/
function Pill({ children }: { children: React.ReactNode }) {
  return <span className="inline-block rounded-full border px-2 py-0.5 text-xs mr-2 mb-1">{children}</span>;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1">
      {items.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );
}

/*****************
 * CATEGORY DROPDOWN (click‑only)
 *****************/
function CategoryDropdown({ title, groups }: { title: string; groups: Record<string, string> }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="border brand-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{title}</span>
          <Button type="button" className="brand-bg" onClick={() => setOpen((v) => !v)}>
            {open ? "Hide" : "Choose a product"}
          </Button>
        </CardTitle>
      </CardHeader>
      {open && (
        <CardContent className="grid grid-cols-1 gap-2">
          {Object.entries(groups).map(([key, label]) => (
            <Button
              key={key}
              variant="outline"
              className="justify-start"
              onClick={() => (window.location.hash = `#/products/${key}`)}
              data-testid={`group-${key}`}
            >
              {label}
            </Button>
          ))}
        </CardContent>
      )}
    </Card>
  );
}

/*****************
 * VARIETY RENDERERS
 *****************/
function VarietyCard({ v }: { v: Variety }) {
  return (
    <Card className="border brand-border">
      <CardHeader className="pb-1">
        <CardTitle className="text-lg">
          <TitleWithNote label={v.name + (v.orgNote ? ` ${v.orgNote}` : "")} />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <div className="font-medium mb-1">Agronomic Characteristics</div>
          <BulletList items={v.agronomic} />
        </div>
        <div>
          <div className="font-medium mb-1">Disease Resistance</div>
          <BulletList items={v.disease} />
        </div>
      </CardContent>
    </Card>
  );
}

function GroupGrid({ list }: { list: Variety[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {list.map((v) => (
        <a key={v.slug} href={`#/products/${currentGroupFromVariety(v)}/${v.slug}`} className="block">
          <VarietyCard v={v} />
        </a>
      ))}
    </div>
  );
}

function currentGroupFromVariety(v: Variety): string {
  // Find the first group in our data that contains this slug
  const pools: Array<[string, Variety[]]> = [
    ...Object.entries(WINTER_DATA),
    ...Object.entries(SPRING_DATA),
  ];
  for (const [k, arr] of pools) {
    if (arr.some((x) => x.slug === v.slug)) return k;
  }
  return "";
}

/*****************
 * PAGES
 *****************/
function HomePage() {
  return (
    <section className="home-hero relative min-h-[calc(100vh-140px)] w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      {/* Background image with graceful fallbacks */}
      <HeroBackground />
      <div className="shade" />
      {/* Top-right logo overlay (smaller) */}
      <LogoImg className="absolute top-4 right-4 h-16 md:h-20 w-auto drop-shadow" />
    </section>
  );
}

function ProductsPage() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold brand-text">Products</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div data-testid="winter-groups">
          <CategoryDropdown title="Winter Cereals" groups={WINTER_TITLES} />
        </div>
        <div data-testid="spring-groups">
          <CategoryDropdown title="Spring Cereals" groups={SPRING_TITLES} />
        </div>
      </div>
    </section>
  );
}

function ProductsGroupPage({ group }: { group: string }) {
  const dataMap: Record<string, Variety[]> = { ...WINTER_DATA, ...SPRING_DATA };
  const entries = dataMap[group as keyof typeof dataMap] || [];
  const title = WINTER_TITLES[group] || SPRING_TITLES[group] || group;
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold brand-text">{title}</h2>
      <GroupGrid list={entries} />
    </section>
  );
}

function VarietyDetailPage({ group, slug }: { group: string; slug: string }) {
  const dataMap: Record<string, Variety[]> = { ...WINTER_DATA, ...SPRING_DATA };
  const entries = dataMap[group as keyof typeof dataMap] || [];
  const v = entries.find((x) => x.slug === slug);
  if (!v) return <section><p>Variety not found.</p></section>;
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold brand-text">{(WINTER_TITLES[group] || SPRING_TITLES[group]) ?? group}</h2>
      <VarietyCard v={v} />
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => (window.location.hash = `#/products/${group}`)}>← Back to group</Button>
        <Button variant="outline" onClick={() => (window.location.hash = "#/products")}>↩ Return to products</Button>
      </div>
    </section>
  );
}

function ContactPage() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold brand-text">Contacts</h2>

      <Card className="rounded-2xl">
        <CardHeader className="pb-2"><CardTitle className="text-lg">Address</CardTitle></CardHeader>
        <CardContent className="text-sm text-neutral-700">
          <address className="not-italic leading-tight">
            <div className="font-medium">Western Seeds</div>
            <div>1631 Highway 30</div>
            <div>Heyburn, ID 83336</div>
          </address>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Trenton */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-2"><CardTitle className="text-lg">Trenton Stanger</CardTitle></CardHeader>
          <CardContent className="text-sm text-neutral-700 space-y-3">
            <div>Technical Seed Sales Agronomist</div>
            <div className="space-y-2">
              <a href="tel:12082602071" className="block brand-link"><Phone className="inline h-4 w-4 mr-2" /> 208‑260‑2071 <span className="opacity-70">(cell)</span></a>
              <a href="tel:12086782268" className="block brand-link"><Phone className="inline h-4 w-4 mr-2" /> 208‑678‑2268 <span className="opacity-70">(office)</span></a>
              <a href="mailto:tstanger@evansgrain.com" className="block brand-link"><Mail className="inline h-4 w-4 mr-2" /> tstanger@evansgrain.com</a>
            </div>
          </CardContent>
        </Card>

        {/* Casey */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-2"><CardTitle className="text-lg">Casey Larson</CardTitle></CardHeader>
          <CardContent className="text-sm text-neutral-700 space-y-3">
            <div>General Manager</div>
            <div className="space-y-2">
              <a href="tel:12082600722" className="block brand-link"><Phone className="inline h-4 w-4 mr-2" /> 208‑260‑0722 <span className="opacity-70">(cell)</span></a>
              <a href="tel:12086782268" className="block brand-link"><Phone className="inline h-4 w-4 mr-2" /> 208‑678‑2268 <span className="opacity-70">(office)</span></a>
              <a href="mailto:clarson@evansgrain.com" className="block brand-link"><Mail className="inline h-4 w-4 mr-2" /> clarson@evansgrain.com</a>
            </div>
          </CardContent>
        </Card>

        {/* Amy */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-2"><CardTitle className="text-lg">Amy Pool</CardTitle></CardHeader>
          <CardContent className="text-sm text-neutral-700 space-y-3">
            <div>Office Manager</div>
            <div className="space-y-2">
              <a href="tel:12086782268" className="block brand-link"><Phone className="inline h-4 w-4 mr-2" /> 208‑678‑2268 <span className="opacity-70">(office)</span></a>
              <a href="mailto:alpool@evansgrain.com" className="block brand-link"><Mail className="inline h-4 w-4 mr-2" /> alpool@evansgrain.com</a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Simple request‑a‑quote form */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-2"><CardTitle>Request A Quote</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = e.currentTarget as HTMLFormElement;
              const name = (f.elements.namedItem("name") as HTMLInputElement | null)?.value || "";
              const email = (f.elements.namedItem("email") as HTMLInputElement | null)?.value || "";
              const phone = (f.elements.namedItem("phone") as HTMLInputElement | null)?.value || "";
              const details = (f.elements.namedItem("details") as HTMLTextAreaElement | null)?.value || "";
              const body = [
                `Name: ${name}`,
                `Email: ${email}`,
                `Phone: ${phone}`,
                "",
                details,
              ].join("%0A");
              window.location.href = `mailto:tstanger@evansgrain.com?subject=Quote%20Request&body=${body}`;
            }}
            className="grid md:grid-cols-2 gap-3"
          >
            <Input name="name" placeholder="Name" />
            <Input name="email" type="email" placeholder="Email" />
            <Input name="phone" type="tel" placeholder="Phone" />
            <div className="md:col-span-2">
              <Textarea name="details" placeholder="Tell us about acres, crop, timing…" />
            </div>
            <div className="md:col-span-2"><Button className="brand-bg">Send</Button></div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

/*****************
 * NAVBAR
 *****************/
function NavBar() {
  return (
    <header className="border-b sticky top-0 z-40 bg-white/80 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-4 justify-between">
        <a id="nav-home" href="#/" className="flex items-center gap-3">
          <LogoImg className="h-20 md:h-28 w-auto" />
          <span className="sr-only">Western Seeds – Home</span>
        </a>
        
        <nav className="flex items-center gap-4">
          <a id="nav-home-link" className="brand-link" href="#/">Home</a>
          <a id="nav-products" className="brand-link" href="#/products">Products</a>
          <a id="nav-contacts" className="brand-link" href="#/contacts">Contacts</a>
        </nav>
      </div>
    </header>
  );
}

/*****************
 * ROUTE PARSER
 *****************/
function parseProductRoute(route: string): { group: string | null; slug: string | null } {
  const m = route.match(/^\/products\/([^/]+)(?:\/([^/]+))?$/);
  return { group: m?.[1] ?? null, slug: m?.[2] ?? null };
}

/*****************
 * APP SHELL
 *****************/
export default function WesternSeedsSite() {
  const route = useHashRoute();

  // Minimal smoke tests (do not throw)
  useEffect(() => {
    try {
      const home = document.getElementById("nav-home");
      const prod = document.getElementById("nav-products");
      const contacts = document.getElementById("nav-contacts");
      const logo = document.querySelector('img[data-testid="logo-img"]');
      console.assert(!!home && !!prod && !!contacts, "[TEST] Nav items render");
      console.assert(!!logo, "[TEST] Logo image present");

      // Route-targeted checks
      if (route === "/") {
        const heroImg = document.querySelector("section.home-hero img");
        console.assert(!!heroImg, "[TEST] Home hero bg renders");
      }

      if (route === "/products") {
        const btn = Array.from(document.querySelectorAll("button")).find((b) => b.textContent?.includes("Choose a product"));
        console.assert(!!btn, "[TEST] Products page dropdown toggle present");
      }

      if (route.startsWith("/products/")) {
        const { group, slug } = parseProductRoute(route);
        if (group === "hard-white-spring-wheat" && !slug) {
          const hasDayn = document.body.textContent?.toLowerCase().includes("dayn");
          console.assert(!!hasDayn, "[TEST] Dayn listed in HWS group");
        }
        if (slug) {
          const ret = Array.from(document.querySelectorAll("button")).some((b) => b.textContent?.includes("Return to products"));
          console.assert(ret, "[TEST] Return to products link present");
        }
      }
      
      if (route === "/contacts") {
        const names = ["Trenton Stanger", "Casey Larson", "Amy Pool"];
        const ok = names.every((n) => document.body.textContent?.includes(n));
        console.assert(ok, "[TEST] Contacts names render");
        const addr = Array.from(document.querySelectorAll("address")).find((a) => a.textContent?.includes("Highway 30"));
        console.assert(!!addr, "[TEST] Contacts address present");
      }
    } catch (_) {}
  }, [route]);

  let page: React.ReactNode = null;
  if (route === "/") {
    page = <HomePage />;
  } else if (route === "/products") {
    page = (
      <div className="grid gap-6">
        <ProductsPage />
      </div>
    );
  } else if (route.startsWith("/products/")) {
    const { group, slug } = parseProductRoute(route);
    if (group && !slug) page = <ProductsGroupPage group={group} />;
    if (group && slug) page = <VarietyDetailPage group={group} slug={slug} />;
  } else if (route === "/contacts") {
    page = <ContactPage />;
  } else {
    page = <HomePage />;
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <BrandStyles />
      <NavBar />
      <main className="max-w-5xl mx-auto px-4 py-6">{page}</main>
      {/* Mobile call FAB */}
      <a
        href="tel:12082602071"
        aria-label="Call Trenton Stanger"
        data-testid="fab-call-trenton"
        className="fixed md:hidden bottom-6 right-4 z-50 inline-flex items-center gap-2 rounded-full px-4 py-3 shadow-lg border brand-border brand-bg text-white"
      >
        <Phone className="h-4 w-4" /> Call
      </a>
    </div>
  );
}
