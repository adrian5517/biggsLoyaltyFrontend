import React, { useRef, useState } from "react";


export type BiggsAnimatedButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: React.ReactNode;
    /** Optional: override the logo image src */
    logoSrc?: string;
    /** Optional: size variant */
    size?: "sm" | "md" | "lg";
    /** Optional: show a ripple effect on click */
    ripple?: boolean;
  };

/**
 * BiggsAnimatedButton — Enhanced animated button with logo reveal,
 * text slide, ripple effect, and accessibility improvements.
 *
 * Usage:
 * <BiggsAnimatedButton onClick={...} size="md" ripple>
 *   <span className="now">now!</span>
 *   <span className="play">play</span>
 * </BiggsAnimatedButton>
 */
export const BiggsAnimatedButton: React.FC<BiggsAnimatedButtonProps> = ({
  children,
  className = "",
  logoSrc = "https://biggs.ph/biggs_website/controls/uploads/6864929dc167a.png",
  size = "md",
  ripple = true,
  onClick,
  disabled,
  ...props
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const rippleCounter = useRef(0);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = ++rippleCounter.current;
      setRipples((prev) => [...prev, { id, x, y }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 700);
    }
    onClick?.(e);
  };

  return (
    <button
      ref={btnRef}
      className={`biggs-animated-btn size-${size} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      aria-disabled={disabled}
      {...props}
    >
      <img
        src={logoSrc}
        alt="Biggs logo"
        className="btn-img"
        draggable={false}
      />

      {children}

      {ripples.map(({ id, x, y }) => (
        <span
          key={id}
          className="ripple-wave"
          style={{ left: x, top: y }}
          aria-hidden="true"
        />
      ))}
    </button>
  );
};