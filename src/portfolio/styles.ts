// Colors are HSL channels, read in class names as `hsl(var(--token))`.
export const PORTFOLIO_STYLES = `
[data-slot="portfolio"] {
  --bg: 240 4% 9%;
  --surface: 0 0% 8%;
  --text: 0 0% 96%;
  --muted: 0 0% 57%;
  --stroke: 0 0% 12%;
  font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
}
[data-slot="portfolio"] .font-display {
  font-family: var(--font-instrument-serif), ui-serif, Georgia, serif;
}
[data-slot="portfolio"] .pf-gradient {
  background-image: linear-gradient(90deg, color-mix(in oklch, var(--primary) 55%, var(--background)) 0%, var(--primary) 100%);
}
[data-slot="portfolio"] .animate-scroll-down {
  animation: pf-scroll-down 1.5s ease-in-out infinite;
}
[data-slot="portfolio"] .animate-role-fade-in {
  animation: pf-role-fade-in 0.4s ease-out both;
}
@keyframes pf-scroll-down {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(200%); }
}
@keyframes pf-role-fade-in {
  0% { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  [data-slot="portfolio"] .animate-scroll-down,
  [data-slot="portfolio"] .animate-role-fade-in {
    animation: none;
  }
}
`;
