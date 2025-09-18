import { useEffect, useState, useCallback } from 'react';

interface ImageOptimizationConfig {
  enableWebP: boolean;
  enableLazyLoading: boolean;
  enablePlaceholders: boolean;
  connectionSpeed: 'slow' | 'fast' | 'unknown';
  deviceMemory: number;
}

/**
 * Hook para otimização inteligente de imagens baseada nas capacidades do dispositivo
 */
export const useImageOptimization = (): ImageOptimizationConfig => {
  const [config, setConfig] = useState<ImageOptimizationConfig>({
    enableWebP: true,
    enableLazyLoading: true,
    enablePlaceholders: true,
    connectionSpeed: 'unknown',
    deviceMemory: 4
  });

  const detectCapabilities = useCallback(() => {
    const newConfig: ImageOptimizationConfig = {
      enableWebP: true,
      enableLazyLoading: true,
      enablePlaceholders: true,
      connectionSpeed: 'unknown',
      deviceMemory: 4
    };

    // Detectar suporte a WebP
    const webpSupport = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };

    newConfig.enableWebP = webpSupport();

    // Detectar velocidade da conexão
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        const effectiveType = connection.effectiveType;
        newConfig.connectionSpeed = effectiveType === '4g' ? 'fast' : 'slow';
        
        // Desabilitar lazy loading em conexões muito lentas
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          newConfig.enableLazyLoading = false;
        }
      }
    }

    // Detectar memória do dispositivo
    if ('deviceMemory' in navigator) {
      newConfig.deviceMemory = (navigator as any).deviceMemory || 4;
      
      // Em dispositivos com pouca memória, usar placeholders mais simples
      if (newConfig.deviceMemory < 2) {
        newConfig.enablePlaceholders = false;
      }
    }

    // Detectar se é um dispositivo de baixo desempenho
    if ('hardwareConcurrency' in navigator) {
      const cores = navigator.hardwareConcurrency;
      if (cores <= 2) {
        // Dispositivo de baixo desempenho, otimizar agressivamente
        newConfig.enablePlaceholders = false;
      }
    }

    setConfig(newConfig);
  }, []);

  useEffect(() => {
    detectCapabilities();
  }, [detectCapabilities]);

  return config;
};

/**
 * Hook para preload inteligente de imagens críticas
 */
export const useImagePreloader = (images: string[], priority: boolean = false) => {
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  const optimization = useImageOptimization();

  const preloadImage = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (preloadedImages.has(src)) {
        resolve();
        return;
      }

      const img = new Image();
      img.onload = () => {
        setPreloadedImages(prev => new Set([...prev, src]));
        resolve();
      };
      img.onerror = reject;
      
      // Usar WebP se suportado
      if (optimization.enableWebP && src.includes('.jpg')) {
        img.src = src.replace('.jpg', '.webp');
      } else {
        img.src = src;
      }
    });
  }, [preloadedImages, optimization.enableWebP]);

  useEffect(() => {
    if (!images.length) return;

    // Preload apenas em conexões rápidas ou imagens prioritárias
    if (optimization.connectionSpeed === 'fast' || priority) {
      const preloadPromises = images.slice(0, priority ? images.length : 3).map(preloadImage);
      
      Promise.allSettled(preloadPromises).then(results => {
        const successCount = results.filter(r => r.status === 'fulfilled').length;
        console.log(`✅ Preloaded ${successCount}/${results.length} images`);
      });
    }
  }, [images, preloadImage, optimization.connectionSpeed, priority]);

  return { preloadedImages, preloadImage };
};

/**
 * Hook para otimizar dimensões de imagem baseado no viewport
 */
export const useResponsiveImageSizes = () => {
  const [sizes, setSizes] = useState('(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw');

  useEffect(() => {
    const updateSizes = () => {
      const width = window.innerWidth;
      
      if (width <= 640) {
        setSizes('100vw');
      } else if (width <= 1024) {
        setSizes('(max-width: 640px) 100vw, 50vw');
      } else if (width <= 1440) {
        setSizes('(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw');
      } else {
        setSizes('(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw');
      }
    };

    updateSizes();
    window.addEventListener('resize', updateSizes);
    
    return () => window.removeEventListener('resize', updateSizes);
  }, []);

  return sizes;
};
