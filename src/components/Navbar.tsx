'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Container,
  Stack,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  NotificationsNone as NotificationsIcon,
  ChatBubbleOutline as ChatIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import dynamic from 'next/dynamic';
import UserMenu from './UserMenu';

const LoginDialog = dynamic(() => import('./LoginDialog'), { ssr: false });
const RegisterDialog = dynamic(() => import('./RegisterDialog'), { ssr: false });

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const navLinks = [
    { name: 'Discover', path: '/' },
    { name: 'Resorts', path: '/resorts' },
    { name: 'Experiences', path: '#experiences' },
  ];

  const handleMobileNav = (path: string) => {
    setMobileMenuOpen(false);
    router.push(path);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          color: '#0a0a0a',
          borderBottom: '1px solid #f0f0f0',
          zIndex: 1100,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: { xs: 70, md: 80 }, justifyContent: 'space-between' }}>
            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: '#0a0a0a',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: '1.25rem',
                  }}
                >
                  S
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    letterSpacing: '-0.03em',
                    color: '#0a0a0a',
                  }}
                >
                  Scaper
                </Typography>
              </Box>
            </Link>

            {/* Desktop Nav Links */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
              {navLinks.map((link) => (
                <Link key={link.name} href={link.path} style={{ textDecoration: 'none' }}>
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: pathname === link.path ? '#0a0a0a' : '#737373',
                      '&:hover': { color: '#0a0a0a' },
                      transition: 'color 0.2s',
                    }}
                  >
                    {link.name}
                  </Typography>
                </Link>
              ))}
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1 } }}>
              {session ? (
                <>
                  <IconButton sx={{ color: '#737373', display: { xs: 'none', md: 'flex' } }}>
                    <NotificationsIcon fontSize="small" />
                  </IconButton>
                  <IconButton sx={{ color: '#737373', display: { xs: 'none', md: 'flex' } }}>
                    <ChatIcon fontSize="small" />
                  </IconButton>
                  <UserMenu
                    user={{ name: session.user?.name || '', role: (session.user as any)?.role || 'user' }}
                    anchorEl={anchorEl}
                    onMenuOpen={(e) => setAnchorEl(e.currentTarget)}
                    onMenuClose={() => setAnchorEl(null)}
                    onLogout={handleLogout}
                    onNavigate={router.push}
                  />
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setOpenLoginDialog(true)}
                    sx={{
                      color: '#0a0a0a',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      px: 2,
                      display: { xs: 'none', sm: 'inline-flex' },
                    }}
                  >
                    Log in
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setOpenRegisterDialog(true)}
                    sx={{
                      bgcolor: '#0a0a0a',
                      color: '#fff',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      px: 3,
                      borderRadius: 2.5,
                      '&:hover': { bgcolor: '#262626' },
                    }}
                  >
                    Sign up
                  </Button>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <IconButton
                sx={{ display: { xs: 'flex', md: 'none' }, ml: 0.5 }}
                onClick={() => setMobileMenuOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: { width: '100%', maxWidth: 300, bgcolor: '#fff' },
        }}
      >
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Scaper</Typography>
            <IconButton onClick={() => setMobileMenuOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List sx={{ flexGrow: 1 }}>
            {navLinks.map((link) => (
              <ListItem key={link.name} disablePadding sx={{ mb: 1 }}>
                <Button
                  fullWidth
                  onClick={() => handleMobileNav(link.path)}
                  sx={{
                    justifyContent: 'flex-start',
                    color: '#0a0a0a',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    py: 1.5,
                    px: 0,
                  }}
                >
                  {link.name}
                </Button>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mt: 'auto' }}>
            {!session && (
              <Stack spacing={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => { setMobileMenuOpen(false); setOpenLoginDialog(true); }}
                  sx={{ borderRadius: 2, py: 1.5, borderColor: '#e5e5e5', color: '#0a0a0a' }}
                >
                  Log in
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => { setMobileMenuOpen(false); setOpenRegisterDialog(true); }}
                  sx={{ borderRadius: 2, py: 1.5, bgcolor: '#0a0a0a' }}
                >
                  Sign up
                </Button>
              </Stack>
            )}
          </Box>
        </Box>
      </Drawer>

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

