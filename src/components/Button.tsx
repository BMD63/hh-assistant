import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  view?: "blue" | "red" | "gray" | "outline";
  icon?: React.ReactNode;
  loading?: boolean;
  size?: "md"; // пока только один, можно добавить другие в будущем
  className?: string;
  children: React.ReactNode;
}

const VIEW_STYLES: Record<string, string> = {
  blue:
    "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
  red:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  gray:
    "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
  outline:
    "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus:ring-gray-400"
};

const SIZE_STYLES: Record<string, string> = {
  md: "text-sm font-medium px-4 h-10 min-w-[130px]",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      view = "blue",
      icon,
      loading = false,
      disabled,
      size = "md",
      className = '',
      type = "button",
      children,
      ...rest
    },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`flex items-center justify-center gap-2 rounded-lg transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${VIEW_STYLES[view]} ${SIZE_STYLES[size]} ${className}`}
      {...rest}
    >
      {icon && (
        <span className="flex items-center justify-center w-5 h-5">{icon}</span>
      )}
      {loading ? <span>Загрузка...</span> : children}
    </button>
  )
);
Button.displayName = "Button";
