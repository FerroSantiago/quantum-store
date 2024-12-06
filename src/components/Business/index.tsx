"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Rocket,
  Eye,
  HandshakeIcon,
  Target,
  BarChart2,
  Truck,
  LucideIcon,
} from "lucide-react";

interface ContentWithList {
  text: string;
  list: string[];
}

type SectionContent = string | string[] | ContentWithList;

interface Section {
  title: string;
  Icon: LucideIcon;
  content?: SectionContent;
  list?: string[];
}

interface BusinessSlide {
  id: number;
  title?: string;
  content?: {
    text: string;
    images: string[];
  };
  sections?: Section[];
}

interface BusinessData {
  slides: BusinessSlide[];
}

function isContentWithList(
  content: SectionContent | undefined
): content is ContentWithList {
  return (
    typeof content === "object" &&
    content !== null &&
    "text" in content &&
    "list" in content
  );
}

function isStringArray(
  content: SectionContent | undefined
): content is string[] {
  return Array.isArray(content);
}

function isString(content: SectionContent | undefined): content is string {
  return typeof content === "string";
}

const BusinessInfo: BusinessData = {
  slides: [
    {
      id: 1,
      title: "NUESTRA EMPRESA",
      content: {
        text: "Fundada en Junio de 1986 por Raúl y Nancy Ferro lleva más de 30 años operando en el mercado de la Distribución Mayorista en el nordeste argentino. Inicialmente en un pequeño depósito, con el correr del tiempo y gracias a la tenacidad y esfuerzo, se fue forjando una empresa seria y sólida. Pasando por varias etapas de crecimiento hoy en día esta dirigida por sus hijos, acompañados de un equipo de trabajadores profesionales inspirados en sus mismos valores e ideales.",
        images: [
          "https://placehold.co/300x300",
          "https://placehold.co/300x300",
          "https://placehold.co/300x300",
        ],
      },
    },
    {
      id: 2,
      sections: [
        {
          title: "MISION",
          Icon: Rocket,
          content:
            "Convertirnos en una empresa socialmente rentable y referente en el mercado a través de un crecimiento planificado y sostenido con creatividad y trabajo, respaldados por el liderazgo de las marcas que representamos.",
        },
        {
          title: "VISION",
          Icon: Eye,
          content:
            "Ser el principal proveedor de los productos que comercializamos dentro de nuestra zona geográfica, brindando a nuestros clientes un servicio de calidad, competitivo y fiable que supere sus expectativas.",
        },
        {
          title: "VALORES",
          Icon: HandshakeIcon,
          content: [
            "Satisfacción del Cliente",
            "Innovación",
            "Honestidad",
            "Lealtad y Trabajo en Equipo",
            "Integridad y civismo",
          ],
        },
      ],
    },
    {
      id: 3,
      sections: [
        {
          title: "COBERTURA",
          Icon: Target,
          content: {
            text: "Provincias: Chaco, Corrientes, Formosa, Misiones. Cerca de 1500 clientes activos.",
            list: [
              "Farmacias",
              "Pañaleras",
              "Supermercados",
              "Autoservicios",
              "Casas de Limpieza",
            ],
          },
        },
        {
          title: "EQUIPO DE VENTA",
          Icon: BarChart2,
          content: {
            text: "Profesionales especializados para la atención personalizada de nuestros clientes.",
            list: ["Supervisores", "Vendedores", "Repositores"],
          },
        },
        {
          title: "LOGISTICA",
          Icon: Truck,
          content: {
            text: "",
            list: [
              "2 Depósitos",
              "1200 m2 Superficie",
              "Oficinas Administrativas",
              "Sistemas de Gestión Certificados",
              "Vehículos acondicionados para la distribución",
            ],
          },
        },
      ],
    },
  ],
};

export default function Business() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
  });
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentSlide(emblaApi.selectedScrollSnap());
    };

    onSelect();
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const renderContent = (section: Section) => {
    const { content, list } = section;

    if (isContentWithList(content)) {
      return (
        <>
          {content.text && <p className="mb-4">{content.text}</p>}
          <ul className="list-disc pl-5">
            {content.list.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </>
      );
    }

    if (isStringArray(content)) {
      return (
        <ul className="list-disc pl-5">
          {content.map((item: string, idx: number) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
    }

    if (isString(content)) {
      return <p>{content}</p>;
    }

    if (list) {
      return (
        <ul className="list-disc pl-5">
          {list.map((item: string, idx: number) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
    }

    return null;
  };

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          <div className="flex-none w-full">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-2xl mb-4">{BusinessInfo.slides[0].title}</h2>
              <p className="mb-6">{BusinessInfo.slides[0].content?.text}</p>
              <div className="grid grid-cols-3 gap-4">
                {BusinessInfo.slides[0].content?.images.map(
                  (_, index: number) => (
                    <div key={index} className="aspect-video relative">
                      <Image
                        src={`https://placehold.co/600x400`}
                        alt={`Company facility ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="flex-none w-full">
            <div className="max-w-4xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {BusinessInfo.slides[1].sections?.map(
                  (section, index: number) => (
                    <div key={index} className="pl-4">
                      <div className="flex items-center mb-4">
                        <section.Icon className="w-6 h-6 mr-2" />
                        <h3 className="text-xl">{section.title}</h3>
                      </div>
                      {renderContent(section)}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="flex-none w-full">
            <div className="max-w-4xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {BusinessInfo.slides[2].sections?.map(
                  (section, index: number) => (
                    <div key={index} className="pl-4">
                      <div className="flex items-center mb-4">
                        <section.Icon className="w-6 h-6 mr-2" />
                        <h3 className="text-xl">{section.title}</h3>
                      </div>
                      {renderContent(section)}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all border ${
              index === currentSlide
                ? "border-primary bg-primary"
                : "border-gray-300 bg-gray-300"
            }`}
            aria-label={`Ir a la diapositiva ${index + 1}`}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>

      <>
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90"
          onClick={() => emblaApi?.scrollPrev()}
          aria-label="Anterior diapositiva"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90"
          onClick={() => emblaApi?.scrollNext()}
          aria-label="Siguiente diapositiva"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </>
    </div>
  );
}
