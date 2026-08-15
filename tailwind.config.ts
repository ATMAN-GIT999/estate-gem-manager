import type { Config } from "tailwindcss";

export default {
  // The site is light-only and never sets the `dark` class (see src/index.css).
  // Keep the class strategy anyway — it renders any stray `dark:` utility inert.
  // Dropping this line would revert Tailwind to the `media` strategy and let
  // those utilities fire based on the visitor's OS setting.
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    // Kept only for the pages not yet on the <Container> primitive (admin,
    // /about, /projects, the booking flow). Widened from 1400px to match
    // --container-max in index.css, so a visitor moving between a migrated
    // and an unmigrated page does not see the content edge jump.
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      // The vertical ladder from index.css, exposed to p-/py-/gap-/space-y-
      // utilities. Six names, no numbers: a section that wants "a bit more
      // than lg" has to pick xl, which is the whole point — `py-24` next to
      // `py-28` next to `py-36` is how the old spacing drifted.
      spacing: {
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          /* text-accent-strong: gold text/icons on light surfaces */
          strong: "hsl(var(--accent-strong))",
          /* text-accent-on-primary: gold text/icons on the green primary surfaces */
          "on-primary": "hsl(var(--accent-on-primary))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        beige: {
          DEFAULT: "hsl(32, 26%, 92%)", /* #efe6d9 */
          dark: "hsl(32, 26%, 85%)",
        },
        sage: {
          DEFAULT: "hsl(133, 11%, 36%)", /* #546458 */
          light: "hsl(133, 11%, 50%)",
          dark: "hsl(100, 10%, 38%)", /* #5a6959 */
        },
        gold: {
          DEFAULT: "hsl(40 42% 52%)",
          light: "hsl(42 48% 62%)",
          dark: "hsl(38 42% 44%)",
        },
        /* Darkening layer for text over photography — `from-scrim/55` and so
           on. Not a new colour: it is --foreground (133 14% 22%) taken
           further down, the same family as --overlay-media in index.css.
           Neutral black over this palette reads grey and drains the warmth
           out of the photos, which is what §10 is about. */
        scrim: "hsl(133 16% 13% / <alpha-value>)",
        white: "hsl(0, 0%, 100%)", /* #ffffff */
        black: "hsl(0, 0%, 0%)", /* #000000 */
      },
      backgroundImage: {
        "gradient-hero": "var(--gradient-hero)",
        "gradient-sage": "var(--gradient-sage)",
        "gradient-gold": "var(--gradient-gold)",
      },
      boxShadow: {
        elegant: "var(--shadow-elegant)",
        soft: "var(--shadow-soft)",
        gold: "var(--shadow-gold)",
      },
      fontFamily: {
        playfair: ["Playfair Display Variable", "Playfair Display", "serif"],
        lato: ["Lato", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
