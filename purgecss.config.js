module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  css: ['./src/index.css'],
  safelist: [
    // Tailwind CSS classes that should never be purged
    /^animate-/,
    /^transition-/,
    /^duration-/,
    /^ease-/,
    /^delay-/,
    /^group-/,
    /^hover:/,
    /^focus:/,
    /^active:/,
    /^disabled:/,
    /^sm:/,
    /^md:/,
    /^lg:/,
    /^xl:/,
    /^2xl:/,
    // Workflow specific classes
    /^workflow-/,
    /^text-gradient/,
    /^bg-gradient/,
    /^shadow-/,
    // Dynamic classes
    'opacity-0',
    'opacity-100',
    'scale-0',
    'scale-100',
    'scale-105',
    'scale-110',
    'rotate-0',
    'rotate-180',
    'rotate-360',
    // Layout shift prevention
    'min-h-screen',
    'h-64',
    'aspect-square',
    'aspect-video'
  ],
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
};
