export const Footer = () => (
  <footer className="border-carbon-600 bg-carbon-700/50 mt-auto border-t">
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
      <p className="text-carbon-400 max-w-2xl text-xs leading-relaxed">
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
      <p className="text-carbon-500 mt-2 font-mono text-[10px]">LenovoCompare CH v0.2</p>
    </div>
  </footer>
);
