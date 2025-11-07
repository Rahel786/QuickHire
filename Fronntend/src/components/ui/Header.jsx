import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);

  const navigationItems = [
    { label: 'Dashboard', path: '/user-dashboard', icon: 'LayoutDashboard' },
    { label: 'Experiences', path: '/senior-experience-sharing', icon: 'Users' },
    { label: 'Interview Prep', path: '/interview-tech-prep-planner', icon: 'Target' },
    { label: 'Jobs', path: '/job-search-results', icon: 'Briefcase' },
    { label: 'Learning', path: '/learning-resources', icon: 'BookOpen' },
    { label: 'Events', path: '/career-events-calendar', icon: 'Calendar' },
  ];

  const isActivePath = (path) => location?.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-card border-b border-border z-50 shadow-sm">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Logo */}
          <Link to="/user-dashboard" className="flex items-center space-x-2">
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
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth hover-scale ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" iconName="Bell" size="sm">
              <span className="sr-only">Notifications</span>
            </Button>
            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-border hover:bg-muted transition"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm uppercase">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">{user?.name || user?.email}</p>
                    <p className="text-xs text-muted-foreground">Profile</p>
                  </div>
                  <Icon name={isProfileMenuOpen ? 'ChevronUp' : 'ChevronDown'} size={16} />
                </button>

                {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-[55]">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted transition"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <Icon name="User" size={16} className="mr-2" />
                      View Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <Icon name="LogOut" size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
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
          className="fixed inset-0 bg-black bg-opacity-50 z-[60] md:hidden"
          onClick={closeMobileMenu}
        />
      )}
      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-card border-l border-border z-[60] transform transition-transform duration-300 md:hidden ${
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
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-smooth ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={20} />
                <span>{item?.label}</span>
              </Link>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <div className="space-y-2">
              <Button
                variant="ghost"
                fullWidth
                iconName="Bell"
                iconPosition="left"
                className="justify-start"
              >
                Notifications
              </Button>
              <Button
                variant="ghost"
                fullWidth
                iconName="User"
                iconPosition="left"
                className="justify-start"
                onClick={() => {
                  closeMobileMenu();
                  navigate('/profile');
                }}
              >
                Profile
              </Button>
              <Button
                variant="ghost"
                fullWidth
                iconName="Settings"
                iconPosition="left"
                className="justify-start"
              >
                Settings
              </Button>
              <Button
                variant="ghost"
                fullWidth
                iconName="HelpCircle"
                iconPosition="left"
                className="justify-start"
              >
                Help
              </Button>
              {user ? (
                <Button
                  variant="ghost"
                  fullWidth
                  iconName="LogOut"
                  iconPosition="left"
                  className="justify-start"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
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