import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: [".next/**", ".open-next/**", "out/**", "env.d.ts", "open-next.config.ts", "next-sitemap.config.js", "public/sitemap*.xml", "public/robots.txt"],
  },
];

export default eslintConfig;
