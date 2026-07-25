---
name: Technical Schematic
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#3b4b37'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#6b7c65'
  outline-variant: '#b9ccb2'
  surface-tint: '#006e16'
  primary: '#006e16'
  on-primary: '#ffffff'
  primary-container: '#00ff41'
  on-primary-container: '#007117'
  inverse-primary: '#00e639'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2e2e2'
  on-secondary-container: '#646464'
  tertiary: '#775839'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffd5ae'
  on-tertiary-container: '#7a5b3c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#72ff70'
  primary-fixed-dim: '#00e639'
  on-primary-fixed: '#002203'
  on-primary-fixed-variant: '#00530e'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c6'
  on-secondary-fixed: '#1b1b1b'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#ffdcbd'
  tertiary-fixed-dim: '#e7bf99'
  on-tertiary-fixed: '#2c1701'
  on-tertiary-fixed-variant: '#5d4124'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 80px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  mono-label:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.5'
    letterSpacing: 0.05em
  mono-code:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  baseline-indicator: 4px
---

## Brand & Style
The design system is built for a high-end software engineering portfolio, prioritizing technical precision and systematic clarity. The aesthetic merges **Modern Minimalism** with **Industrial Brutalism**, creating an environment that feels like a sophisticated terminal or a blueprint. 

The target audience is technical leadership and recruiters who value logic, performance, and structural integrity. The UI should evoke a sense of "engineered intentionality"—where every pixel serves a purpose. Visual interest is generated through asymmetric layouts and generous negative space, balanced by rigid alignment to a systematic grid. Hard shadows and offset layers provide a tactile, "layered hardware" feel without sacrificing the cleanliness of a modern software interface.

## Colors
This design system utilizes a high-contrast monochrome foundation with a single, precise technical accent. 

- **Primary Background**: A crisp white (#FFFFFF) or slightly industrial off-white (#F5F5F5) to maintain a clean "documentation" feel.
- **Primary Text**: Pure black (#000000) for maximum legibility and authority.
- **System Accent**: A technical "Matrix Green" (#00FF41) or "Terminal Blue" (#0055FF) used exclusively for interactive states, status indicators, and monospace metadata.
- **Structural Lines**: Low-opacity blacks or light greys are used for grid lines and baseline indicators to reinforce the systematic aesthetic.

## Typography
The typography is the core of the technical hierarchy. 

**Inter** provides a neutral, highly legible sans-serif base for headings and body copy, ensuring the content feels like a professional system. **JetBrains Mono** is utilized for all metadata, labels, and technical accents (e.g., "REF_01", "DATE // 2024"). 

Use all-caps for monospace labels to create a "header-tag" effect. Headlines should utilize tight letter-spacing to feel dense and impactful, while body text maintains generous leading for readability. Structural accents like brackets `{ }` and slashes `/` should always be rendered in the monospace font.

## Layout & Spacing
The layout follows a **Fluid Grid** with intentional asymmetric disruptions. 

- **Grid Logic**: Use a 12-column grid for desktop. Align content to start on unexpected columns (e.g., Column 3 or 5) to create "off-grid" visual interest while maintaining mathematical alignment.
- **Systematic Texture**: Render faint, 1px horizontal baseline indicators and vertical grid lines in the background at 5% opacity. This makes the "system" behind the design visible to the user.
- **Negative Space**: Use 80px - 120px blocks of vertical space between major sections to emphasize the "modular" nature of the portfolio.
- **Responsive Behavior**: On mobile, collapse to a single column but maintain the 1px border lines to frame sections, preserving the technical feel.

## Elevation & Depth
Depth is conveyed through **Hard Shadows** and **Offset Layers**, mimicking physical technical manuals or stacked hardware components.

- **Hard Shadows**: Do not use blurs. Instead, use a solid black or dark grey offset (e.g., 4px x 4px) to give cards and buttons a "lifted" feel.
- **Layering**: Primary content sits on white surfaces. Secondary technical data can sit on "sunken" off-white containers with a 1px solid black border.
- **Visual Connectors**: Use 1px lines (vertical or horizontal) to "wire" different UI elements together, reinforcing the schematic concept.

## Shapes
The shape language is strictly **Sharp (0px)**. All containers, buttons, and input fields must have square corners. This reinforces the industrial, non-consumerist engineering aesthetic. 

Structural accents, such as the corners of a card, may feature "crosshair" markers or small 1px corner notches to mimic technical drafting styles.

## Components
- **Buttons**: Square corners, 1px solid black border. On hover, apply the primary accent color as a solid background fill with an offset hard shadow. Label text must be monospace.
- **Project Cards**: Utilize a "Schematic" style. The project image is framed by a 1px border. Above the image, include a monospace header string: `[ TYPE // PRODUCTION ]`. Below, list the tech stack as a comma-separated monospace string.
- **Status Chips**: Use monospace text enclosed in brackets: `[ ACTIVE ]` or `[ STABLE ]`. Use the accent color for the text.
- **Code Snippets**: Displayed in a "sunken" off-white block with a left-side 2px accent border.
- **Lists**: Bullet points are replaced with forward slashes `/` or hexadecimal counters `0x01`, `0x02`.
- **Inputs**: Simple 1px bottom border only. The label should float above in monospace, resembling a terminal prompt `> NAME:`.