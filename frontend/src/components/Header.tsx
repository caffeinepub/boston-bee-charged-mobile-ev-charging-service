import { Link, useNavigate } from '@tanstack/react-router';
import { Zap, Menu, Calendar } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export function Header() {
  const navigate = useNavigate();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  const authText = loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const NavLinks = () => (
    <>
      <Link
        to="/"
        className="text-sm font-medium transition-colors hover:text-primary"
        onClick={() => setMobileMenuOpen(false)}
      >
        Home
      </Link>
      <Link
        to="/schedule"
        className="text-sm font-medium transition-colors hover:text-primary"
        onClick={() => setMobileMenuOpen(false)}
      >
        Schedule
      </Link>
      {isAuthenticated && (
        <Link
          to="/appointments"
          className="text-sm font-medium transition-colors hover:text-primary"
          onClick={() => setMobileMenuOpen(false)}
        >
          My Appointments
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/assets/generated/boston-bee-tech.dim_400x400.png"
            alt="Boston Bee Charged"
            className="h-10 w-10 rounded-lg"
          />
          <div>
            <h1 className="text-xl font-bold tracking-tight">Boston Bee Charged</h1>
            <p className="text-xs text-muted-foreground">Mobile EV Charging</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleAuth}
            disabled={disabled}
            variant={isAuthenticated ? 'outline' : 'default'}
            size="sm"
            className="hidden md:flex"
          >
            {authText}
          </Button>
          <ThemeToggle />

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col gap-4 mt-8">
                <NavLinks />
                <Button
                  onClick={handleAuth}
                  disabled={disabled}
                  variant={isAuthenticated ? 'outline' : 'default'}
                  size="sm"
                  className="w-full"
                >
                  {authText}
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
