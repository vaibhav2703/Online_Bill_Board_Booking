import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ownerService from '../../services/ownerService';
import { getImageUrl, getPlaceholderImage } from '../../utils/imageUtils';
import {
    Menu,
    X,
    LogOut,
    User,
    LayoutDashboard,
    Map,
    Calendar,
    PlusCircle,
    RectangleHorizontal
} from 'lucide-react';

const Header = () => {
    const { isAuthenticated, role, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProfileDropdownOpen(false);
            }
        };

        if (profileDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [profileDropdownOpen]);

    // Fetch owner profile image
    useEffect(() => {
        const fetchProfileImage = async () => {
            if (isAuthenticated && role === 'OWNER') {
                try {
                    const profile = await ownerService.getOwnerProfile();
                    if (profile.profileImage) {
                        setProfileImage(profile.profileImage);
                    }
                } catch (error) {
                    console.error('Failed to fetch profile image:', error);
                }
            }
        };
        fetchProfileImage();
    }, [isAuthenticated, role]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const userNavLinks = [
        { to: '/user', label: 'Billboards', icon: LayoutDashboard },
        { to: '/user/map', label: 'Map View', icon: Map },
        { to: '/user/bookings', label: 'My Bookings', icon: Calendar },
    ];

    const ownerNavLinks = [
        { to: '/owner', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/owner/registerBillboard', label: 'Add Billboard', icon: PlusCircle },
        { to: '/owner/bookings', label: 'Bookings', icon: Calendar },
    ];

    const navLinks = role === 'OWNER' ? ownerNavLinks : userNavLinks;

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <RectangleHorizontal className="h-8 w-8 text-primary-600" />
                        <span className="text-xl font-bold text-gray-900">BillboardHub</span>
                    </Link>

                    {/* Desktop Navigation */}
                    {isAuthenticated && (
                        <div className="hidden md:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                                >
                                    <link.icon className="h-4 w-4" />
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Desktop Profile Dropdown */}
                    {isAuthenticated ? (
                        <div className="hidden md:block relative" ref={dropdownRef}>
                            <button
                                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors cursor-pointer"
                            >
                                {role === 'OWNER' && profileImage ? (
                                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary-600">
                                        <img
                                            src={getImageUrl(profileImage)}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = getPlaceholderImage();
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                                        <User className="h-5 w-5 text-primary-600" />
                                    </div>
                                )}
                                <span className="text-sm font-medium">{role}</span>
                            </button>

                            {profileDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                                    <Link
                                        to={role === 'OWNER' ? '/owner/profile' : '/user/profile'}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setProfileDropdownOpen(false)}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <User className="h-4 w-4" />
                                            <span>Profile</span>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <LogOut className="h-4 w-4" />
                                            <span>Logout</span>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="text-gray-700 hover:text-primary-600 transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register/user"
                                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-gray-700"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        {isAuthenticated ? (
                            <>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-100"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <link.icon className="h-5 w-5" />
                                        <span>{link.label}</span>
                                    </Link>
                                ))}
                                <Link
                                    to={role === 'OWNER' ? '/owner/profile' : '/user/profile'}
                                    className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-100"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <User className="h-5 w-5" />
                                    <span>Profile</span>
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center space-x-2 px-4 py-3 text-red-600 hover:bg-gray-100"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register/user"
                                    className="block px-4 py-3 text-primary-600 hover:bg-gray-100"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
