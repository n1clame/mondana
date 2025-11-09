import * as React from "react";
import clsx from "clsx";
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" };
export function Button({ className, variant="default", ...props }: ButtonProps) {
  const base="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-0";
  const styles=variant==="default"?"bg-red-600 hover:bg-red-500 text-white":"border border-white/15 text-white/90 hover:text-white hover:bg-white/10";
  return <button className={clsx(base, styles, className)} {...props}/>;
}
