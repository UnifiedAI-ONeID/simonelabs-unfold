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
				// SimoneLabs specific colors - Updated
				simonelabs: {
					primary: '#3446C7', // Indigo Blue
					accent: '#29379A', // Darker Blue (was coral)
					secondary: '#46B1F1', // Fresh Sky
					success: '#3EC490', // Emerald Green
					warning: '#FFD166', // Saffron
					error: '#EB5160', // Cherry Red
					background: '#F8F9FC', // Softer off-white
					surface: '#FCFDFE', // Very light grey
					'text-primary': '#23243C', // Graphite
					'text-secondary': '#50546B', // Gray 600
					border: '#E0E2E8', // Softer border
					// Dark mode variants
					'dark-primary': '#7EA2FF', // Light Blue
					'dark-accent': '#6079FF', // Darker blue (was coral)
					'dark-secondary': '#5DD1F2', // Cyan
					'dark-success': '#4DE1C1', // Aquamarine
					'dark-warning': '#FFC266', // Amber
					'dark-error': '#FF5C7A', // Soft Red
					'dark-background': '#10141C', // Deeper Navy
					'dark-surface': '#1C212A', // Dark Slate
					'dark-text-primary': '#F8F9FC', // Soft White
					'dark-text-secondary': '#C3CAD8', // Light Gray
					'dark-border': '#282D36', // Gray 700
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'float': 'float 6s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
