import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getIconComponent = (
  icons: any,
  iconName: string | undefined,
  className?: string | undefined
) => {
  return iconName && icons[iconName]
    ? icons[iconName]({ className: className || "" })
    : null;
};
