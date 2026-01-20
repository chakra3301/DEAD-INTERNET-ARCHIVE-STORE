/**
 * Glitch Text Component
 * Text with digital corruption effects on hover
 *
 * @param {Object} props
 * @param {string} props.text - The text to display
 * @param {string} props.as - HTML element to render (default: 'span')
 * @param {string} props.variant - 'glitch' | 'pixel' | 'corrupt' - effect type
 * @param {string} props.className - Additional CSS classes
 */
export function GlitchText({
  text,
  as: Component = 'span',
  variant = 'glitch',
  className = '',
  ...props
}) {
  const variantClass = {
    glitch: 'glitch-text',
    pixel: 'pixel-break',
    corrupt: 'data-corrupt',
  }[variant] || 'glitch-text';

  return (
    <Component
      className={`${variantClass} ${className}`.trim()}
      data-text={text}
      {...props}
    >
      {text}
    </Component>
  );
}

/**
 * Anomaly Card Component
 * A card with scanning line effect and border animations
 */
export function AnomalyCard({
  children,
  className = '',
  withScan = false,
  ...props
}) {
  const classes = ['anomaly-card'];
  if (withScan) classes.push('scan-effect');
  if (className) classes.push(className);

  return (
    <div className={classes.join(' ')} {...props}>
      {children}
    </div>
  );
}

/**
 * Static Noise Component
 * Animated static/noise overlay for dramatic effect
 */
export function StaticNoise({ opacity = 0.03, className = '' }) {
  return (
    <div
      className={`static-noise ${className}`.trim()}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        zIndex: 1,
      }}
    />
  );
}

/**
 * Scan Line Component
 * A horizontal scanning line effect
 */
export function ScanLine({ duration = 3, className = '' }) {
  return (
    <div
      className={`scan-line-element ${className}`.trim()}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
        animation: `scan-line ${duration}s linear infinite`,
        pointerEvents: 'none',
        zIndex: 2,
      }}
    />
  );
}
