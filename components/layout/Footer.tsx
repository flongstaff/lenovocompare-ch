export const Footer = () => (
  <footer className="mt-auto border-t border-carbon-600 bg-carbon-700/50">
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
      <p className="max-w-2xl text-xs leading-relaxed text-carbon-400">
        Prices are user-input or externally linked. Always verify the final CHF price including VAT and vRG on the
        retailer&apos;s site. Specs sourced from{" "}
        <a
          href="https://psref.lenovo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-light hover:underline"
        >
          Lenovo PSREF
        </a>
        . Not affiliated with Lenovo.
      </p>
      <p className="mt-2 font-mono text-[10px] text-carbon-500">LenovoCompare CH v0.2</p>
    </div>
  </footer>
);
