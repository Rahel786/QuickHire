// Full updated Header component with admin support:
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navigationItems = [
    { label: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
    { label: 'Experiences', path: '/senior-experience-sharing', icon: 'Users' },
    { label: 'Interview Prep', path: '/interview-tech-prep-planner', icon: 'Target' },
    { label: 'Jobs', path: '/job-search-results', icon: 'Briefcase' },
    { label: 'Learning', path: '/learning-resources', icon: 'BookOpen' },
    { label: 'Events', path: '/career-events-calendar', icon: 'Calendar' },
    ...(user?.role === 'admin' ? [
      { label: 'Admin', path: '/admin', icon: 'Shield', badge: 'Admin' }
    ] : [])
  ];

  const isActivePath = (path) => location?.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-card border-b border-border z-100">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Icon name="Zap" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">QuickHire</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth hover-scale relative ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
                {item?.badge && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {item?.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" iconName="Bell" size="sm">
              <span className="sr-only">Notifications</span>
            </Button>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <div className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                    Admin
                  </div>
                )}
                <Button 
                  variant="ghost" 
                  iconName="LogOut" 
                  size="sm"
                  onClick={async () => {
                    await signOut();
                    window.location.href = '/login';
                  }}
                >
                  <span className="sr-only">Sign Out</span>
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="ghost" iconName="LogIn" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={toggleMobileMenu}
            iconName={isMobileMenuOpen ? 'X' : 'Menu'}
          >
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-200 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-card border-l border-border z-200 transform transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Icon name="Zap" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">QuickHire</span>
          </div>
          <Button variant="ghost" size="sm" onClick={closeMobileMenu} iconName="X">
            <span className="sr-only">Close menu</span>
          </Button>
        </div>

        <nav className="p-6">
          <div className="space-y-2">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={closeMobileMenu}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-smooth relative ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={20} />
                <span>{item?.label}</span>
                {item?.badge && (
                  <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {item?.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <div className="space-y-2">
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <div className="px-4 py-2 bg-purple-100 text-purple-700 text-sm font-medium rounded-lg mb-2">
                      👑 Administrator
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    fullWidth
                    iconName="User"
                    iconPosition="left"
                    className="justify-start"
                  >
                    {user.name || user.email}
                  </Button>
                  <Button
                    variant="ghost"
                    fullWidth
                    iconName="LogOut"
                    iconPosition="left"
                    className="justify-start"
                    onClick={async () => {
                      await signOut();
                      closeMobileMenu();
                      window.location.href = '/login';
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="w-full"
                >
                  <Button
                    variant="ghost"
                    fullWidth
                    iconName="LogIn"
                    iconPosition="left"
                    className="justify-start"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;