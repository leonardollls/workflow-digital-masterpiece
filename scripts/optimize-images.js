#!/usr/bin/env node

/**
 * Script para otimizar imagens para performance web
 * Converte para WebP e cria versões responsivas
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurações de otimização
const IMAGE_SIZES = [320, 640, 768, 1024, 1280, 1920];
const QUALITY = 85;
const WEBP_QUALITY = 80;

// Diretórios
const PUBLIC_DIR = path.join(__dirname, '../public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'Images');

console.log('🖼️  Iniciando otimização de imagens...');

// Lista de imagens para otimizar (baseado no portfolio)
const CRITICAL_IMAGES = [
  'logo-workflow.png',
  'landing-page-demonstracao-workana-1.png',
  '118d31229400769.686562b112afe.jpg',
  'landing-page-demonstracao-1.webp',
  'FireShot Capture 003 - Segura de Renda.webp',
  'FireShotCaptureNanoLips.jpg',
  'FireShot Capture 001 - Rei do Crédito.webp',
  'landing-page-demonstracao-2.webp',
  '54478b229424237.68648848892d0_11zon (1).webp',
  'landing-page-demonstracao-3.png',
  'landing-page-demonstracao-4.webp',
  'landing-page-demonstracao-5.webp',
  'landing-page-demonstracao-6.webp',
  'landing-page-demonstracao-7.webp',
  'landing-page-demonstracao-8.webp',
  'landing-page-demonstracao-9.png'
];

// Função para gerar placeholder base64
function generatePlaceholder(width = 100, height = 100) {
  return `data:image/svg+xml;base64,${Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <defs>
        <pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse">
          <circle cx="50" cy="50" r="1" fill="#e5e7eb" opacity="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grain)"/>
    </svg>
  `).toString('base64')}`;
}

// Função para criar sizes attribute otimizado
function generateSizesAttribute() {
  return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
}

// Gerar configuração de imagens otimizadas
function generateImageConfig() {
  const config = {
    critical: [],
    lazy: [],
    placeholders: {}
  };

  CRITICAL_IMAGES.forEach((image, index) => {
    const imageConfig = {
      src: `/Images/${image}`,
      alt: `Projeto ${index + 1}`,
      sizes: generateSizesAttribute(),
      placeholder: generatePlaceholder(400, 300),
      priority: index < 3
    };

    if (index < 3) {
      config.critical.push(imageConfig);
    } else {
      config.lazy.push(imageConfig);
    }
    
    config.placeholders[image] = generatePlaceholder(400, 300);
  });

  return config;
}

// Salvar configuração
const imageConfig = generateImageConfig();

fs.writeFileSync(
  path.join(__dirname, '../src/config/images.json'),
  JSON.stringify(imageConfig, null, 2)
);

console.log('✅ Configuração de imagens gerada com sucesso!');
console.log(`📊 Imagens críticas: ${imageConfig.critical.length}`);
console.log(`📊 Imagens lazy: ${imageConfig.lazy.length}`);
console.log(`📊 Placeholders gerados: ${Object.keys(imageConfig.placeholders).length}`);

// Gerar instruções de otimização
const instructions = `
🚀 INSTRUÇÕES DE OTIMIZAÇÃO DE IMAGENS:

1. Converter para WebP:
   - Use ferramentas como squoosh.app ou cwebp
   - Qualidade: ${WEBP_QUALITY}% para WebP
   - Manter fallback para PNG/JPG

2. Tamanhos responsivos:
   - Gerar versões: ${IMAGE_SIZES.join(', ')}px de largura
   - Usar srcset para diferentes densidades

3. Compressão:
   - PNG: usar pngquant ou tinypng
   - JPG: qualidade ${QUALITY}%
   - WebP: qualidade ${WEBP_QUALITY}%

4. Lazy loading:
   - Primeiras 3 imagens: loading="eager"
   - Restante: loading="lazy"

📁 Arquivo de configuração salvo em: src/config/images.json
`;

console.log(instructions);

export { generateImageConfig, generatePlaceholder, generateSizesAttribute };
