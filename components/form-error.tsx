import { cn } from "@/lib/utils";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { HTMLAttributes } from "react";

interface FormErrorProps extends HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export const FormError = ({ message, className, ...props }: FormErrorProps) => {
  if (!message) return null;

  const baseStyle = "bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive";

  return (
    <div {...props} className={cn(baseStyle, className)}>
      <ExclamationTriangleIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
