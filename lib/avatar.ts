export const generateUserAvatar = (seed: string) => {
    // Simple hash function
    const hash = Array.from(seed).reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    // 1. Color Palettes (Dark/Premium themes)
    const palettes = [
        { bg: "#1e1b4b", main: "#818cf8", accent: "#c7d2fe" }, // Indigo
        { bg: "#14532d", main: "#4ade80", accent: "#bbf7d0" }, // Green
        { bg: "#450a0a", main: "#f87171", accent: "#fecaca" }, // Red
        { bg: "#172554", main: "#60a5fa", accent: "#dbeafe" }, // Blue
        { bg: "#4c1d95", main: "#a78bfa", accent: "#ddd6fe" }, // Violet
        { bg: "#0f172a", main: "#94a3b8", accent: "#e2e8f0" }, // Slate
        { bg: "#365314", main: "#bef264", accent: "#ecfccb" }, // Lime
        { bg: "#701a75", main: "#e879f9", accent: "#fce7f3" }, // Fuchsia
    ];

    const palette = palettes[Math.abs(hash) % palettes.length];

    // 2. Shapes
    const shapes = ["circle", "square", "squircle", "hex"];
    const shape = shapes[Math.abs(hash >> 2) % shapes.length];

    // 3. Symbols (SVG Paths)
    const symbols = [
        // Lightning
        `<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="${palette.main}" stroke="${palette.accent}" stroke-width="2" stroke-linejoin="round"/>`,
        // Leaf
        `<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" fill="${palette.main}" stroke="${palette.accent}" stroke-width="2" stroke-linejoin="round"/>`,
        // Star
        `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="${palette.main}" stroke="${palette.accent}" stroke-width="2" stroke-linejoin="round"/>`,
        // Triangle (Abstract)
        `<path d="M12 4L4 20h16L12 4z" fill="${palette.main}" stroke="${palette.accent}" stroke-width="2" stroke-linejoin="round"/>`,
        // Circle/Dot
        `<circle cx="12" cy="12" r="6" fill="${palette.main}" stroke="${palette.accent}" stroke-width="2"/>`,
        // Initial (if needed, but using distinct abstract shapes is often better for generic "dynamic" feel, let's stick to abstract + Initials fallback in component if desired, but here we strictly generate an SVG image string)
        // Geometric Diamond
        `<path d="M12 2L2 12l10 10 10-10L12 2z" fill="${palette.main}" stroke="${palette.accent}" stroke-width="2" stroke-linejoin="round"/>`
    ];

    const symbol = symbols[Math.abs(hash >> 4) % symbols.length];

    // Create SVG string
    // Viewbox 0 0 24 24 for standard icons

    // Shape Background
    let bgShape = "";
    if (shape === "circle") {
        bgShape = `<circle cx="12" cy="12" r="12" fill="${palette.bg}"/>`;
    } else if (shape === "square") {
        bgShape = `<rect x="0" y="0" width="24" height="24" rx="4" fill="${palette.bg}"/>`; // Rounded square
    } else if (shape === "squircle") {
        bgShape = `<path d="M12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0Z" fill="${palette.bg}"/>`; // Actually circle is squircle-ish in SVG if we used path, but let's just allow standard square with heavy rounding
        bgShape = `<rect x="0" y="0" width="24" height="24" rx="8" fill="${palette.bg}"/>`;
    } else if (shape === "hex") {
        // Approx hex
        bgShape = `<path d="M12 0L22.3923 6V18L12 24L1.6077 6V18L12 0Z" fill="${palette.bg}"/>`; // Very rough, let's use a simpler polygon
        bgShape = `<polygon points="12 0, 24 6, 24 18, 12 24, 0 18, 0 6" fill="${palette.bg}"/>`;
    }

    const svgString = `
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      ${bgShape}
      <g transform="scale(0.6) translate(8, 8)">
        ${symbol}
      </g>
    </svg>
  `.trim();

    // Encode to data URL
    return `data:image/svg+xml;base64,${Buffer.from(svgString).toString('base64')}`;
};
