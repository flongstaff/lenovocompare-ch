import Link from "next/link";

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
            <li>
              <a
                href="https://psref.lenovo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-carbon-300 transition-colors hover:text-accent-light"
              >
                Lenovo PSREF
              </a>
            </li>
            <li className="text-xs leading-relaxed text-carbon-500">
              Scores derived from public benchmark aggregates. Pricing is user-contributed.
            </li>
          </ul>
        </div>

        {/* About */}
        <div>
          <h3 className="mb-3 font-mono text-[10px] uppercase tracking-wider text-carbon-400">About</h3>
          <p className="text-xs leading-relaxed text-carbon-400">
            Swiss-market Lenovo comparison tool covering ThinkPad, IdeaPad Pro, and Legion lineups.
          </p>
          <p className="mt-2 font-mono text-[10px] text-carbon-500">Built with Next.js · v0.2</p>
        </div>
      </div>

      <div className="mt-6 border-t border-carbon-600/50 pt-4">
        <p className="max-w-2xl text-xs leading-relaxed text-carbon-500">
          Prices are user-input or externally linked. Always verify the final CHF price including VAT and vRG on the
          retailer&apos;s site. Not affiliated with Lenovo.
        </p>
      </div>
    </div>
  </footer>
);
