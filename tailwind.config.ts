
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
			padding: '1rem',
			screens: {
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Nunito', 'system-ui', 'sans-serif'],
				heading: ['Poppins', 'Nunito', 'system-ui', 'sans-serif'],
			},
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
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Soft color palette for reduced glare
				soft: {
					blue: {
						50: '#F0F4FF',
						100: '#E0EAFF', 
						200: '#C7D9FF',
						300: '#A3C2FF',
						400: '#6E8CDC', // Primary soft blue
						500: '#3741B4', // Primary
						600: '#2D3399',
						700: '#242A7F',
						800: '#1C2066',
						900: '#151954'
					},
					gray: {
						50: '#FAFBFC',  // Background
						100: '#F0F3F6', // Muted
						200: '#E1E6EB', // Border
						300: '#C5CDD6',
						400: '#9AA4B2',
						500: '#6B7685',
						600: '#4B5569', // Muted foreground
						700: '#3A424E',
						800: '#2A323C',
						900: '#1E2332'  // Foreground
					},
					green: {
						400: '#46B48C',
						500: '#32966E', // Success
						600: '#2A7A5A'
					},
					amber: {
						400: '#DCB450',
						500: '#C8A03C', // Warning
						600: '#B08A2F'
					},
					red: {
						400: '#C85A64',
						500: '#B44650', // Destructive
						600: '#9F3A44'
					}
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			spacing: {
				'safe-top': 'env(safe-area-inset-top)',
				'safe-bottom': 'env(safe-area-inset-bottom)',
				'safe-left': 'env(safe-area-inset-left)',
				'safe-right': 'env(safe-area-inset-right)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-15px)' }
				},
				'gentle-bounce': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'float': 'float 8s ease-in-out infinite',
				'gentle-bounce': 'gentle-bounce 2s ease-in-out infinite'
			},
			boxShadow: {
				'soft': '0 2px 8px rgba(30, 35, 50, 0.04)',
				'soft-lg': '0 4px 24px rgba(30, 35, 50, 0.08)',
				'soft-xl': '0 8px 32px rgba(30, 35, 50, 0.12)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
