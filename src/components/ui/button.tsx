import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost";
  size?: "default" | "sm";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, variant = "default", size = "default", ...props }, ref) => {
    const variantClasses =
      variant === "ghost"
        ? "bg-transparent text-blue-600 hover:bg-blue-100"
        : "bg-blue-600 text-white hover:bg-blue-700";
    const sizeClasses =
      size === "sm"
        ? "px-3 py-2 text-sm"
        : "px-4 py-2";

    return (
      <button
        ref={ref}
        className={cn(
          "rounded focus:outline-none",
          variantClasses,
          sizeClasses,
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };