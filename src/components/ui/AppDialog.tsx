// src/components/ui/AppDialog.tsx
import { ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./internal/Dialog";

const dialogWidthVariants = cva("", {
  variants: {
    size: {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      full: "max-w-full sm:max-w-[90vw]",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type DialogSize = NonNullable<Parameters<typeof dialogWidthVariants>[0]>["size"];

interface AppDialogProps {
  aberto: boolean;
  onClose: () => void;
  titulo: string;
  descricao?: string;
  children: ReactNode;
  size?: DialogSize;
  className?: string;
}

export function AppDialog({
  aberto,
  onClose,
  titulo,
  descricao,
  children,
  size = "md",
  className,
}: AppDialogProps) {
  return (
    <Dialog open={aberto} onOpenChange={onClose}>
      <DialogContent className={dialogWidthVariants({ size, className })}>
        <DialogHeader>
          <DialogTitle className="text-xl text-primary">{titulo}</DialogTitle>
          {descricao && <DialogDescription>{descricao}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}