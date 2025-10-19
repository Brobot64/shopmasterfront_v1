'use client'

import { Button } from '@/components/ui/button'
import { Layers2, LayoutDashboardIcon, MenuIcon, SettingsIcon, ShoppingCartIcon, User2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface SideBarProps {
  active: boolean
  toggleActive: () => void
}

const SideBar: React.FC<SideBarProps> = ({ active, toggleActive }) => {
  return (
    <aside className={`sidebars ${active ? 'active' : ''}`}>
      <div className="top">
        <div className="logos"></div>
        <Button className="atn-btn" onClick={toggleActive}>
          <MenuIcon />
        </Button>
      </div>

      <div className="store-image">
        <p>Name of Store</p>
      </div>

      <ul>
        <li>
          <Link href="/">
            <LayoutDashboardIcon />
            <span className="nav-item">Dashboard</span>
          </Link>
          <span className="tooltip">Dashboard</span>
        </li>

        <li>
          <Link href="/">
            <ShoppingCartIcon />
            <span className="nav-item">Products</span>
          </Link>
          <span className="tooltip">Products</span>
        </li>

        <li>
          <Link href="/">
            <Layers2 />
            <span className="nav-item">Categories</span>
          </Link>
          <span className="tooltip">Categories</span>
        </li>

        <li>
          <Link href="/">
            <User2 />
            <span className="nav-item">Customers</span>
          </Link>
          <span className="tooltip">Customers</span>
        </li>

        <li>
          <Link href="/">
            <SettingsIcon />
            <span className="nav-item">Settings</span>
          </Link>
          <span className="tooltip">Settings</span>
        </li>
      </ul>

      <div className="bottom"></div>
    </aside>
  )
}

export default SideBar
