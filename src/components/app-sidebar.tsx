import { NavLink } from "react-router-dom"
import type { LucideIcon } from "lucide-react"

import {
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
  useSidebar,
} from "@/components/ui/sidebar"

export type AppSidebarItem = {
  title: string
  description: string
  href: string
  icon: LucideIcon
}

type AppSidebarProps = {
  items: AppSidebarItem[]
}

export function AppSidebar({ items }: AppSidebarProps) {
  const { setOpen } = useSidebar()

  return (
    <>
      <SidebarOverlay />
      <Sidebar>
        <SidebarHeader>
          <div className="text-lg font-semibold">All Cures</div>
          <p className="text-sm text-muted-foreground">Operations dashboard</p>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <NavLink to={item.href} end onClick={() => setOpen(false)}>
                      {({ isActive }) => (
                        <SidebarMenuButton asChild active={isActive}>
                          <span className="flex items-center gap-3">
                            <item.icon className="size-4" />
                            <span className="flex-1 text-left">{item.title}</span>
                          </span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
            Reach out to the ops team on Slack for support.
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  )
}
