import {Link} from 'react-router';

/**
 * Ghost Button Component
 * A spectral button with ethereal hover effects
 *
 * @param {Object} props
 * @param {string} props.to - Link destination (makes it a Link)
 * @param {string} props.href - External URL (makes it an anchor)
 * @param {string} props.variant - 'default' | 'glitch' - button style variant
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 * @param {string} props.type - Button type for form submission
 * @param {boolean} props.disabled - Disabled state
 */
export function GhostButton({
  to,
  href,
  variant = 'default',
  className = '',
  children,
  onClick,
  type = 'button',
  disabled = false,
  ...props
}) {
  const baseClass = variant === 'glitch' ? 'ghost-btn-glitch' : 'ghost-btn';
  const combinedClassName = `${baseClass} ${className}`.trim();

  // For glitch variant, we need the data-text attribute
  // Also add data-text to default variant for hero section glitch effects
  const glitchProps = { 'data-text': typeof children === 'string' ? children : '' };

  // External link
  if (href) {
    return (
      <a
        href={href}
        className={combinedClassName}
        target="_blank"
        rel="noopener noreferrer"
        {...glitchProps}
        {...props}
      >
        {children}
      </a>
    );
  }

  // Internal link
  if (to) {
    return (
      <Link
        to={to}
        className={combinedClassName}
        {...glitchProps}
        {...props}
      >
        {children}
      </Link>
    );
  }

  // Button element
  return (
    <button
      type={type}
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled}
      {...glitchProps}
      {...props}
    >
      {children}
    </button>
  );
}
