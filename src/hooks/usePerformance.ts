import { useEffect, useState, useRef, useCallback } from 'react';

// Hook para detectar se o usuário está em uma conexão lenta
export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState({
    isOnline: navigator.onLine,
    isSlowConnection: false,
    connectionType: 'unknown' as string,
  });

  useEffect(() => {
    const updateNetworkStatus = () => {
      setNetworkStatus(prev => ({
        ...prev,
        isOnline: navigator.onLine,
      }));
    };

    // Detectar conexão lenta
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      const updateConnectionInfo = () => {
        setNetworkStatus(prev => ({
          ...prev,
          isSlowConnection: connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g',
          connectionType: connection.effectiveType || 'unknown',
        }));
      };

      connection.addEventListener('change', updateConnectionInfo);
      updateConnectionInfo();

      return () => {
        connection.removeEventListener('change', updateConnectionInfo);
      };
    }

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, []);

  return networkStatus;
};

// Hook para lazy loading otimizado
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isCurrentlyIntersecting = entry.isIntersecting;
        setIsIntersecting(isCurrentlyIntersecting);
        
        if (isCurrentlyIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasIntersected, options]);

  return { targetRef, isIntersecting, hasIntersected };
};

// Hook para preload de recursos críticos
export const useResourcePreloader = () => {
  const preloadedResources = useRef(new Set<string>());

  const preloadImage = useCallback((src: string, priority: 'high' | 'low' = 'low') => {
    if (preloadedResources.current.has(src)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    if (priority === 'high') {
      link.setAttribute('fetchpriority', 'high');
    }
    
    document.head.appendChild(link);
    preloadedResources.current.add(src);
  }, []);

  const preloadFont = useCallback((href: string) => {
    if (preloadedResources.current.has(href)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.href = href;
    link.crossOrigin = 'anonymous';
    
    document.head.appendChild(link);
    preloadedResources.current.add(href);
  }, []);

  return { preloadImage, preloadFont };
};

// Hook para detectar dispositivo e ajustar performance
export const useDeviceOptimization = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isLowEndDevice: false,
    prefersReducedMotion: false,
  });

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
    const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);
    
    // Detectar dispositivos de baixo desempenho
    const hardwareConcurrency = navigator.hardwareConcurrency || 1;
    const deviceMemory = (navigator as any).deviceMemory || 1;
    const isLowEndDevice = hardwareConcurrency <= 2 || deviceMemory <= 1;

    // Detectar preferência por movimento reduzido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setDeviceInfo({
      isMobile,
      isTablet,
      isLowEndDevice,
      prefersReducedMotion,
    });
  }, []);

  return deviceInfo;
};

// Hook para otimizar animações baseado na performance
export const useAnimationOptimization = () => {
  const deviceInfo = useDeviceOptimization();
  const networkStatus = useNetworkStatus();

  const shouldReduceAnimations = deviceInfo.isLowEndDevice || 
                                networkStatus.isSlowConnection || 
                                deviceInfo.prefersReducedMotion;

  const getAnimationClass = useCallback((normalClass: string, reducedClass?: string) => {
    return shouldReduceAnimations ? (reducedClass || '') : normalClass;
  }, [shouldReduceAnimations]);

  return {
    shouldReduceAnimations,
    getAnimationClass,
    ...deviceInfo,
    ...networkStatus,
  };
};

// Hook para debounce (otimizar eventos de scroll, resize, etc.)
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook para throttle (otimizar eventos frequentes)
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
};

export default {
  useNetworkStatus,
  useIntersectionObserver,
  useResourcePreloader,
  useDeviceOptimization,
  useAnimationOptimization,
  useDebounce,
  useThrottle,
};
