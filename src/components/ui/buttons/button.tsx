import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-yellow-500 text-primary-foreground hover:bg-yellow-700",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        noborder:
          "bg-background dark:bg-zinc-950 hover:bg-accent dark:hover:bg-zinc-900 hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        green: "text-white bg-customGreen",
        blue: "text-white bg-blue-700",
        aktif: "text-green-600 bg-green-100 dark:bg-green-950 dark:text-green-400",
        mati: "text-red-600 bg-red-100 dark:bg-red-950 dark:text-red-400",
        mulaiTernak: "text-white bg-customGreen mulaiTernak",
        panen: "text-white bg-customRed panen",
        jumlahAyam: "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground",
        sangatBaik: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-950",
        baik: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950",
        buruk: "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950",
        bahaya: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950",
        empty: "bg-yellow-100 dark:bg-yellow-950 text-yellow-500 dark:text-yellow-400",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

