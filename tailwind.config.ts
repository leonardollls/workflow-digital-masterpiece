import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Workflow Brand Colors 2.0 - More sophisticated palette
				'workflow': {
					'50': '#faf7ff',
					'100': '#f3edff',
					'200': '#e9deff',
					'300': '#d6c1ff',
					'400': '#b794ff',
					'500': '#9561ff',
					'600': '#8b3dff',
					'700': '#7c2beb',
					'800': '#6924c4',
					'900': '#571f9f',
					'950': '#37106b',
				},
				'workflow-deep': '#1a0d2e',
				'workflow-energy': '#7c3aed',
				'workflow-zen': '#a78bfa',
				'workflow-pure': '#ffffff',
				'workflow-shadow': '#0f0517',
				'workflow-glow': '#f3f0ff',
				'workflow-neon': 'rgba(124,58,237,0.8)',
				'workflow-glass': 'rgba(167,139,250,0.1)',
				'workflow-accent': '#06b6d4',
				'workflow-warning': '#f59e0b',
				// Semantic Colors Enhanced
				'success': {
					'50': '#ecfdf5',
					'500': '#10b981',
					'600': '#059669',
				},
				'warning': {
					'50': '#fffbeb',
					'500': '#f59e0b',
					'600': '#d97706',
				},
				'info': {
					'50': '#f0f9ff',
					'500': '#06b6d4',
					'600': '#0891b2',
				},
				'premium': '#ffd700',
			},
			fontFamily: {
				'sans': ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
				'display': ['Poppins', 'sans-serif'],
				'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
			},
			fontSize: {
				'xs': ['0.75rem', { lineHeight: '1rem' }],
				'sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'base': ['1rem', { lineHeight: '1.5rem' }],
				'lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				'5xl': ['3rem', { lineHeight: '1.16' }],
				'6xl': ['3.75rem', { lineHeight: '1.1' }],
				'7xl': ['4.5rem', { lineHeight: '1.05' }],
				'8xl': ['6rem', { lineHeight: '1' }],
				'9xl': ['8rem', { lineHeight: '1' }],
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'128': '32rem',
				'144': '36rem',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'4xl': '2rem',
				'5xl': '2.5rem',
			},
			boxShadow: {
				'workflow': '0 4px 32px rgba(124, 58, 237, 0.15)',
				'workflow-lg': '0 8px 64px rgba(124, 58, 237, 0.2)',
				'workflow-xl': '0 16px 80px rgba(124, 58, 237, 0.25)',
				'glow': '0 0 20px rgba(124, 58, 237, 0.4)',
				'glow-lg': '0 0 40px rgba(124, 58, 237, 0.3)',
				'inner-glow': 'inset 0 2px 16px rgba(124, 58, 237, 0.1)',
				'neumorphism': '8px 8px 16px rgba(124, 58, 237, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.8)',
				'glass': '0 8px 32px rgba(31, 38, 135, 0.37)',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'gradient-workflow': 'linear-gradient(135deg, #1a0d2e 0%, #7c3aed 50%, #a78bfa 100%)',
				'gradient-workflow-soft': 'linear-gradient(135deg, rgba(124,58,237,0.8) 0%, rgba(167,139,250,0.6) 100%)',
				'gradient-mesh': 'radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(22,100%,77%,1) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%), radial-gradient(at 0% 0%, hsla(343,100%,76%,1) 0px, transparent 50%)',
			},
			backdropBlur: {
				'xs': '2px',
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'fade-in-delayed': 'fade-in 0.8s ease-out 0.2s both',
				'slide-up': 'slide-up 0.8s ease-out',
				'slide-down': 'slide-down 0.8s ease-out',
				'slide-left': 'slide-left 0.8s ease-out',
				'slide-right': 'slide-right 0.8s ease-out',
				'scale-in': 'scale-in 0.5s ease-out',
				'scale-in-delayed': 'scale-in 0.6s ease-out 0.3s both',
				'glow': 'glow 2s ease-in-out infinite',
				'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'float-delayed': 'float 3s ease-in-out infinite 1s',
				'float-slow': 'float 6s ease-in-out infinite',
				'particle': 'particle 2s ease-in-out infinite',
				'rotate-slow': 'rotate-slow 20s linear infinite',
				'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
				'shimmer': 'shimmer 2.5s ease-in-out infinite',
				'gradient-shift': 'gradient-shift 8s ease-in-out infinite',
				'magnetic': 'magnetic 0.3s ease-out',
				'tilt': 'tilt 0.3s ease-out',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'slide-up': {
					'0%': { opacity: '0', transform: 'translateY(40px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'slide-down': {
					'0%': { opacity: '0', transform: 'translateY(-40px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'slide-left': {
					'0%': { opacity: '0', transform: 'translateX(40px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' },
				},
				'slide-right': {
					'0%': { opacity: '0', transform: 'translateX(-40px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' },
				},
				'scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.9)' },
					'100%': { opacity: '1', transform: 'scale(1)' },
				},
				'glow': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' },
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)' },
					'50%': { boxShadow: '0 0 40px rgba(124, 58, 237, 0.8)' },
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'particle': {
					'0%': { opacity: '0', transform: 'scale(0) rotate(0deg)' },
					'50%': { opacity: '1', transform: 'scale(1) rotate(180deg)' },
					'100%': { opacity: '0', transform: 'scale(0) rotate(360deg)' },
				},
				'rotate-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
				'bounce-subtle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-4px)' },
				},
				'shimmer': {
					'0%': { backgroundPosition: '-1000px 0' },
					'100%': { backgroundPosition: '1000px 0' },
				},
				'gradient-shift': {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
				},
				'magnetic': {
					'0%': { transform: 'translate(0, 0) scale(1)' },
					'100%': { transform: 'translate(var(--tw-translate-x), var(--tw-translate-y)) scale(1.05)' },
				},
				'tilt': {
					'0%': { transform: 'rotate(0deg)' },
					'25%': { transform: 'rotate(1deg)' },
					'75%': { transform: 'rotate(-1deg)' },
					'100%': { transform: 'rotate(0deg)' },
				},
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
