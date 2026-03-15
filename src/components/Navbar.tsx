'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  Search, 
  Menu, 
  AccountCircle, 
  Language, 
  NotificationsNone 
} from '@mui/icons-material';
import dynamic from 'next/dynamic';
import UserMenu from './UserMenu';
import GlobalSearch from './GlobalSearch';

const LoginDialog = dynamic(() => import('./LoginDialog'), { ssr: false });
const RegisterDialog = dynamic(() => import('./RegisterDialog'), { ssr: false });

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <>
      <nav className={`
        sticky top-0 z-50 w-full transition-all duration-300
        ${isScrolled ? 'bg-white border-b border-border-light py-4 shadow-sm' : 'bg-white py-5'}
      `}>
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 group">
            <div className="text-brand">
              <span className="text-2xl font-black tracking-tighter">resortss.in</span>
            </div>
          </Link>

          <div className="hidden md:block flex-1 max-w-[400px]">
            <GlobalSearch />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-1 mr-2 px-3 py-2 hover:bg-bg-offset rounded-full transition-all cursor-pointer">
              <span className="text-[14px] font-semibold text-text-main">Airbnb your home</span>
            </div>
            
            <div className="hidden sm:flex p-2 hover:bg-bg-offset rounded-full transition-all cursor-pointer">
              <Language sx={{ fontSize: 20 }} className="text-text-main" />
            </div>

            <div 
              onClick={(e) => setAnchorEl(e.currentTarget)}
              className="flex items-center gap-3 p-2 border border-border-light rounded-full hover:shadow-md transition-all cursor-pointer"
            >
              <Menu sx={{ fontSize: 18 }} className="text-text-main ml-1" />
              <div className="text-text-muted">
                {(session?.user as any)?.image ? (
                  <img src={(session?.user as any).image} alt="User" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <AccountCircle sx={{ fontSize: 32 }} />
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Import GlobalSearch if not already done */}
      {/* (Adding it here for clarity, but it should be imported at top) */}

      {/* User Menu Integration */}
      {anchorEl && (
        <UserMenu
          user={{ name: session?.user?.name || '', role: (session?.user as any)?.role || 'user' }}
          anchorEl={anchorEl}
          onMenuOpen={() => {}} // Not needed for custom trigger
          onMenuClose={() => setAnchorEl(null)}
          onLogout={handleLogout}
          onNavigate={(path) => {
            setAnchorEl(null);
            router.push(path);
          }}
        />
      )}

      <LoginDialog
        open={openLoginDialog}
        onClose={() => setOpenLoginDialog(false)}
        onSuccess={() => setOpenLoginDialog(false)}
        onSwitchToRegister={() => { setOpenLoginDialog(false); setOpenRegisterDialog(true); }}
      />
      <RegisterDialog
        open={openRegisterDialog}
        onClose={() => setOpenRegisterDialog(false)}
        onSuccess={() => setOpenRegisterDialog(false)}
        onSwitchToLogin={() => { setOpenRegisterDialog(false); setOpenLoginDialog(true); }}
      />
    </>
  );
}

