// Cache para armazenar imagens já carregadas
class ImageCache {
  private cache = new Map<string, HTMLImageElement>();
  private loadingPromises = new Map<string, Promise<HTMLImageElement>>();

  async preloadImage(src: string): Promise<HTMLImageElement> {
    // Se já está em cache, retorna imediatamente
    if (this.cache.has(src)) {
      return this.cache.get(src)!;
    }

    // Se já está sendo carregada, retorna a promise existente
    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src)!;
    }

    // Cria nova promise de carregamento
    const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.cache.set(src, img);
        this.loadingPromises.delete(src);
        resolve(img);
      };
      
      img.onerror = () => {
        this.loadingPromises.delete(src);
        reject(new Error(`Failed to load image: ${src}`));
      };
      
      img.src = src;
    });

    this.loadingPromises.set(src, loadPromise);
    return loadPromise;
  }

  isImageCached(src: string): boolean {
    return this.cache.has(src);
  }

  getCachedImage(src: string): HTMLImageElement | null {
    return this.cache.get(src) || null;
  }

  // Precarrega uma lista de imagens em background
  async preloadImages(sources: string[]): Promise<void> {
    const promises = sources.map(src => 
      this.preloadImage(src).catch(() => null) // Ignora erros individuais
    );
    
    await Promise.all(promises);
  }

  // Limpa o cache se necessário
  clearCache(): void {
    this.cache.clear();
    this.loadingPromises.clear();
  }

  // Obtém estatísticas do cache
  getCacheStats() {
    return {
      cachedImages: this.cache.size,
      loadingImages: this.loadingPromises.size,
      totalMemoryUsage: this.cache.size * 0.1 // Estimativa em MB
    };
  }
}

// Instância singleton do cache
export const imageCache = new ImageCache();

// Hook para usar o cache em componentes React
export const useImagePreloader = () => {
  return {
    preloadImage: imageCache.preloadImage.bind(imageCache),
    preloadImages: imageCache.preloadImages.bind(imageCache),
    isImageCached: imageCache.isImageCached.bind(imageCache),
    getCachedImage: imageCache.getCachedImage.bind(imageCache),
    getCacheStats: imageCache.getCacheStats.bind(imageCache)
  };
};
