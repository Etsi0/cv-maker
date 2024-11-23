import type { Config } from "tailwindcss";

export default {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				border: 'oklch(var(--border-color) / <alpha-value>)',
				body: {
					50: 'oklch(var(--body-color-50) / <alpha-value>)',
					100: 'oklch(var(--body-color-100) / <alpha-value>)',
					200: 'oklch(var(--body-color-200) / <alpha-value>)',
					300: 'oklch(var(--body-color-300) / <alpha-value>)',
					400: 'oklch(var(--body-color-400) / <alpha-value>)',
					500: 'oklch(var(--body-color-500) / <alpha-value>)',
				},
				primary: {
					50: 'oklch(var(--primary-color-50) / <alpha-value>)',
					100: 'oklch(var(--primary-color-100) / <alpha-value>)',
					200: 'oklch(var(--primary-color-200) / <alpha-value>)',
					300: 'oklch(var(--primary-color-300) / <alpha-value>)',
					400: 'oklch(var(--primary-color-400) / <alpha-value>)',
					500: 'oklch(var(--primary-color-500) / <alpha-value>)',
					600: 'oklch(var(--primary-color-600) / <alpha-value>)',
					700: 'oklch(var(--primary-color-700) / <alpha-value>)',
					800: 'oklch(var(--primary-color-800) / <alpha-value>)',
					900: 'oklch(var(--primary-color-900) / <alpha-value>)',
					950: 'oklch(var(--primary-color-950) / <alpha-value>)',
				},
				input: 'var(--input-color)',
				text: {
					300: 'oklch(var(--text-color-300) / <alpha-value>)',
					400: 'oklch(var(--text-color-400) / <alpha-value>)',
					500: 'oklch(var(--text-color-500) / <alpha-value>)',
					600: 'oklch(var(--text-color-600) / <alpha-value>)',
					700: 'oklch(var(--text-color-700) / <alpha-value>)',
				},
			},
		},
	},
	plugins: [],
} satisfies Config;
