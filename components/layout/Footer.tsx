import Link from "next/link";
import { ExternalLink } from "lucide-react";

export const Footer = () => (
  <footer className="mt-auto border-t border-carbon-600 bg-carbon-700/50">
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Navigate */}
        <div>
          <h3 className="mb-3 font-mono text-[10px] uppercase tracking-wider text-carbon-400">Navigate</h3>
          <ul className="space-y-1.5">
            {[
              { href: "/", label: "Models" },
              { href: "/compare", label: "Compare" },
              { href: "/hardware", label: "Hardware" },
              { href: "/pricing", label: "Pricing" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-carbon-300 transition-colors hover:text-accent-light">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Data Sources */}
        <div>
          <h3 className="mb-3 font-mono text-[10px] uppercase tracking-wider text-carbon-400">Data Sources</h3>
          <ul className="space-y-1.5">
            {[
              { href: "https://psref.lenovo.com", label: "Lenovo PSREF", desc: "Specifications" },
              { href: "https://www.maxon.net/en/cinebench", label: "Cinebench 2024", desc: "CPU benchmarks" },
              { href: "https://www.geekbench.com", label: "Geekbench 6", desc: "CPU benchmarks" },
              { href: "https://www.3dmark.com", label: "3DMark Time Spy", desc: "GPU benchmarks" },
              { href: "https://www.notebookcheck.net", label: "NotebookCheck", desc: "Chassis benchmarks" },
              { href: "https://www.pugetsystems.com/pugetbench/", label: "PugetBench", desc: "Content creation" },
            ].map((src) => (
              <li key={src.href}>
                <a
                  href={src.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-carbon-300 transition-colors hover:text-accent-light"
                >
                  {src.label} <ExternalLink size={10} className="opacity-50" />
                </a>
                <span className="ml-1 text-[10px] text-carbon-500">— {src.desc}</span>
              </li>
            ))}
            <li className="mt-1 text-[10px] leading-relaxed text-carbon-500">
              Benchmark scores derived from publicly available data. FPS estimates approximate. Pricing is
              user-contributed. Linux compatibility based on Lenovo certification lists and community reports.
            </li>
          </ul>
        </div>

        {/* About & Links */}
        <div>
          <h3 className="mb-3 font-mono text-[10px] uppercase tracking-wider text-carbon-400">About</h3>
          <p className="text-xs leading-relaxed text-carbon-400">
            Swiss-market Lenovo comparison tool covering ThinkPad, IdeaPad Pro, and Legion lineups.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="https://github.com/flongstaff/thinkcompare-ch"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 border border-carbon-500 px-2 py-1 text-[10px] font-medium text-carbon-300 transition-colors hover:border-accent hover:text-accent-light"
            >
              GitHub <ExternalLink size={9} className="opacity-50" />
            </a>
            <a
              href="https://github.com/flongstaff/thinkcompare-ch/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 border border-carbon-500 px-2 py-1 text-[10px] font-medium text-carbon-300 transition-colors hover:border-accent hover:text-accent-light"
            >
              Report Bug <ExternalLink size={9} className="opacity-50" />
            </a>
          </div>
          <p className="mt-3 font-mono text-[10px] text-carbon-500">Built with Next.js · v0.2 · 98+ models</p>
        </div>
      </div>

      <div className="mt-6 space-y-2 border-t border-carbon-600/50 pt-4">
        <p className="max-w-2xl text-xs leading-relaxed text-carbon-500">
          Prices are user-input or externally linked. Always verify the final CHF price including VAT and vRG on the
          retailer&apos;s site. Not affiliated with Lenovo.
        </p>
        <p className="max-w-2xl text-[10px] leading-relaxed text-carbon-600">
          ThinkPad, IdeaPad, and Legion are trademarks of Lenovo. Cinebench is a trademark of Maxon. Geekbench is a
          trademark of Primate Labs. 3DMark is a trademark of UL. PugetBench is a trademark of Puget Systems. Game
          titles are trademarks of their respective publishers.
        </p>
      </div>
    </div>
  </footer>
);
