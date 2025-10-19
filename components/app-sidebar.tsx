"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconShoppingCart,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth-context"

// Navigation data based on user type
function getNavigationData(userType: string) {
  const baseNavigation = [
    {
      title: "Dashboard",
      url: `/dashboard/${userType}`,
      icon: IconDashboard,
    },
  ];

  // Add navigation items based on user type
  switch (userType?.toLowerCase()) {
    case 'owner':
      return [
        ...baseNavigation,
        {
          title: "Products",
          url: "/dashboard/products",
          icon: IconShoppingCart,
        },
        {
          title: "Employees",
          url: "/dashboard/employees",
          icon: IconUsers,
        },
        {
          title: "Sales",
          url: "/dashboard/sales",
          icon: IconChartBar,
        },
        {
          title: "Inventory",
          url: "/dashboard/inventory",
          icon: IconListDetails,
        },
        {
          title: "Outlets",
          url: "/dashboard/outlets",
          icon: IconDatabase,
        },
        {
          title: "Subscription",
          url: "/dashboard/subscription",
          icon: IconFileDescription,
        },
        {
          title: "Logs",
          url: "/dashboard/logs",
          icon: IconReport,
        },
      ];
      
    case 'admin':
      return [
        ...baseNavigation,
        {
          title: "Businesses",
          url: "/dashboard/businesses",
          icon: IconDatabase,
        },
        {
          title: "All Users",
          url: "/dashboard/users",
          icon: IconUsers,
        },
        {
          title: "System Logs",
          url: "/dashboard/logs",
          icon: IconReport,
        },
        {
          title: "Subscriptions",
          url: "/dashboard/subscriptions",
          icon: IconFileDescription,
        },
      ];
      
    case 'store_executive':
      return [
        ...baseNavigation,
        {
          title: "Products",
          url: "/dashboard/products",
          icon: IconShoppingCart,
        },
        {
          title: "Sales",
          url: "/dashboard/sales",
          icon: IconChartBar,
        },
        {
          title: "Inventory",
          url: "/dashboard/inventory",
          icon: IconListDetails,
        },
        {
          title: "Employees",
          url: "/dashboard/employees",
          icon: IconUsers,
        },
        {
          title: "Logs",
          url: "/dashboard/logs",
          icon: IconReport,
        },
      ];
      
    case 'sales_rep':
      return [
        ...baseNavigation,
        {
          title: "Products",
          url: "/dashboard/products",
          icon: IconDatabase,
        },
        {
          title: "My Sales",
          url: "/dashboard/sales",
          icon: IconChartBar,
        },
        {
          title: "New Sale",
          url: "/dashboard/new-sale",
          icon: IconShoppingCart,
        },
      ];
      
    default:
      return baseNavigation;
  }
}

const data = {
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  
  const navigationItems = getNavigationData(user?.userType || 'owner');
  
  const userData = {
    name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName || 'User',
    email: user?.email || '',
    avatar: '/avatars/default.jpg',
  };

  return (
    <Sidebar collapsible="offcanvas" className="border-r" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">ShopMaster</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="flex flex-col gap-2">
        <NavMain items={navigationItems} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
