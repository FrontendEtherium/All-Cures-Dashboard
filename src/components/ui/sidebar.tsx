import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

type SidebarContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined)

 function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)

  const value = React.useMemo(() => ({ open, setOpen }), [open])

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("Sidebar components must be used within a SidebarProvider")
  }
  return context
}

const Sidebar = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    const { open } = useSidebar()

    return (
      <aside
        ref={ref}
        data-state={open ? "open" : "closed"}
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 -translate-x-full border-r bg-background/95 p-4 shadow-lg transition-transform",
          "lg:static lg:translate-x-0 lg:border-r lg:bg-background lg:shadow-none",
          open && "translate-x-0",
          className,
        )}
        {...props}
      />
    )
  },
)
Sidebar.displayName = "Sidebar"

const SidebarOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { open, setOpen } = useSidebar()

    if (!open) return null

    return (
      <div
        ref={ref}
        className={cn(
          "fixed inset-0 z-30 bg-background/60 backdrop-blur-sm lg:hidden",
          className,
        )}
        onClick={() => setOpen(false)}
        {...props}
      />
    )
  },
)
SidebarOverlay.displayName = "SidebarOverlay"

const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { open, setOpen } = useSidebar()
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className,
        )}
        aria-label="Toggle sidebar"
        data-state={open ? "open" : "closed"}
        onClick={() => setOpen(!open)}
        {...props}
      />
    )
  },
)
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("mb-6 space-y-1 text-left", className)}
      {...props}
    />
  ),
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mt-auto pt-6", className)} {...props} />
  ),
)
SidebarFooter.displayName = "SidebarFooter"

const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-1 flex-col gap-4", className)} {...props} />
  ),
)
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props} />
  ),
)
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-xs font-semibold uppercase text-muted-foreground", className)}
      {...props}
    />
  ),
)
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1", className)} {...props} />
  ),
)
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("grid gap-1", className)} {...props} />
  ),
)
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("list-none", className)} {...props} />
  ),
)
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
  {
    variants: {
      active: {
        true: "bg-secondary text-secondary-foreground",
        false: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
)

type SidebarMenuButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof sidebarMenuButtonVariants> & {
    asChild?: boolean
    children?: React.ReactNode
  }

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, asChild = false, active, children, type: _type, ...props }, ref) => {
    const classes = cn(sidebarMenuButtonVariants({ active }), className)

    if (asChild) {
      return (
        <Slot className={classes} data-active={active} {...props}>
          {children}
        </Slot>
      )
    }

    return (
      <button ref={ref} className={classes} data-active={active} {...props}>
        {children}
      </button>
    )
  },
)
SidebarMenuButton.displayName = "SidebarMenuButton"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarOverlay,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
}
