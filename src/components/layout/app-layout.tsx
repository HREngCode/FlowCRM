"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Mail,
  Users,
  Settings,
  Briefcase,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { FlowCRMLogo } from '@/components/icons/logo';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/toaster";
import React from 'react';


interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  subItems?: NavItem[];
}

const navItems: NavItem[] = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/emails', icon: Mail, label: 'Emails' },
  { href: '/contacts', icon: Users, label: 'Contacts' },
  { 
    href: '/tools', 
    icon: Briefcase, 
    label: 'Tools',
    subItems: [
      { href: '/tools/sentiment-analyzer', icon: ChevronRight, label: 'Sentiment Analyzer' },
      { href: '/tools/contact-extractor', icon: ChevronRight, label: 'Contact Extractor' },
      { href: '/tools/response-generator', icon: ChevronRight, label: 'Response Generator' },
    ] 
  },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

function UserProfileDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="user avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Demo User</p>
            <p className="text-xs leading-none text-muted-foreground">
              user@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface AppLayoutProps {
  children: ReactNode;
}

function NavigationMenu({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const { open } = useSidebar();
  const [openSubMenus, setOpenSubMenus] = React.useState<Record<string, boolean>>({});

  const toggleSubMenu = (label: string) => {
    setOpenSubMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.label}>
          {item.subItems ? (
            <>
              <SidebarMenuButton
                onClick={() => toggleSubMenu(item.label)}
                className="justify-between"
                isActive={item.subItems.some(sub => pathname === sub.href)}
                tooltip={open ? undefined : item.label}
              >
                <div className="flex items-center gap-2">
                  <item.icon />
                  <span>{item.label}</span>
                </div>
                {item.subItems && (openSubMenus[item.label] ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
              </SidebarMenuButton>
              {openSubMenus[item.label] && open && (
                <SidebarMenuSub>
                  {item.subItems.map(subItem => (
                     <SidebarMenuSubItem key={subItem.label}>
                       <Link href={subItem.href} legacyBehavior passHref>
                         <SidebarMenuSubButton isActive={pathname === subItem.href}>
                           {/* Sub-item icons can be simpler or omitted if not distinct enough */}
                           <span>{subItem.label}</span>
                         </SidebarMenuSubButton>
                       </Link>
                     </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </>
          ) : (
            <Link href={item.href} legacyBehavior passHref>
              <SidebarMenuButton isActive={pathname === item.href} tooltip={open ? undefined : item.label}>
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}


export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar className="border-r">
        <SidebarHeader className="p-4">
          <FlowCRMLogo />
        </SidebarHeader>
        <SidebarContent>
            <NavigationMenu items={navItems} />
        </SidebarContent>
        <SidebarFooter className="p-4">
          <p className="text-xs text-muted-foreground">© 2024 FlowCRM</p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex items-center gap-4 ml-auto">
            <UserProfileDropdown />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
