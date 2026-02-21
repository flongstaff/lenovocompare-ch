"use client";

import { ExternalLink, BookOpen } from "lucide-react";
import type { Laptop } from "@/lib/types";
import { getNotebookCheckUrl, getLaptopMediaUrl } from "@/lib/retailers";

interface DeepDiveProps {
  readonly model: Laptop;
}

const links = (model: Laptop) => [
  {
    name: "NotebookCheck",
    url: getNotebookCheckUrl(model),
    guidance: "Detailed battery benchmarks, display measurements, thermals",
  },
  {
    name: "LaptopMedia",
    url: getLaptopMediaUrl(model),
    guidance: "Internal motherboard layout, disassembly guide, upgrade options",
  },
  {
    name: "YouTube",
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(model.name + " review")}`,
    guidance: "Video reviews, real-world usage, keyboard feel",
  },
  {
    name: "Reddit",
    url:
      model.lineup === "ThinkPad"
        ? `https://www.reddit.com/r/thinkpad/search/?q=${encodeURIComponent(model.name)}&restrict_sr=1`
        : `https://www.reddit.com/r/Lenovo/search/?q=${encodeURIComponent(model.name)}&restrict_sr=1`,
    guidance: "Owner experiences, known issues, community fixes",
  },
  {
    name: "LaptopMag",
    url: `https://www.laptopmag.com/search?searchTerm=${encodeURIComponent(model.name)}`,
    guidance: "US-focused reviews, productivity benchmarks, comparisons",
  },
  {
    name: "Lenovo Forums",
    url: `https://forums.lenovo.com/search?q=${encodeURIComponent(model.name)}&search_type=thread`,
    guidance: "Official support threads, driver updates, BIOS advisories",
  },
];

export const DeepDive = ({ model }: DeepDiveProps) => {
  return (
    <div className="space-y-2">
      <p className="text-carbon-200 text-[10px] font-bold uppercase tracking-widest">
        <BookOpen size={10} className="mr-1 inline" />
        Deep Dive
      </p>
      <div className="flex flex-wrap gap-2">
        {links(model).map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="carbon-btn-ghost inline-flex items-center gap-1 !px-3 !py-1.5 !text-xs"
            title={link.guidance}
          >
            {link.name} <ExternalLink size={10} />
          </a>
        ))}
      </div>
    </div>
  );
};
