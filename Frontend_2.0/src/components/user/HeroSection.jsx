import React from 'react';
import { Search, MapPin, TrendingUp, Award, Zap } from 'lucide-react';
import billboardHeroMain from '../../assets/images/billboard_hero_main.png';
import billboardDigitalScreen from '../../assets/images/Gemini_Generated_Image_tj35mtj35mtj35mt.png';
import premiumLocationImg from '../../assets/images/premium_location.png';
import bestDealsImg from '../../assets/images/Gemini_Generated_Image_o6x80wo6x80wo6x8.png';

const HeroSection = ({ searchTerm, onSearchChange }) => {
    return (
        <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 overflow-visible">
            {/* Background decorative elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            </div>

            {/* Decorative images */}
            {/* Left image - centered vertically with gradient glow */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-56 h-72 hidden lg:block">
                <div className="relative w-full h-full">
                    {/* Gradient glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-2xl blur-xl opacity-60"></div>
                    {/* Image */}
                    <img
                        src={billboardHeroMain}
                        alt="Billboard decoration"
                        className="relative w-full h-full object-cover rounded-2xl shadow-2xl border-2 border-orange-300/50"
                        style={{ clipPath: 'polygon(0 0, 100% 10%, 100% 100%, 0 90%)' }}
                    />
                </div>
            </div>

            {/* Right image - top corner with gradient glow */}
            <div className="absolute right-0 top-0 w-64 h-80 hidden lg:block">
                <div className="relative w-full h-full">
                    {/* Gradient glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-l from-orange-400 via-orange-500 to-orange-600 rounded-bl-[100px] blur-xl opacity-60"></div>
                    {/* Image */}
                    <img
                        src={billboardDigitalScreen}
                        alt="Digital billboard decoration"
                        className="relative w-full h-full object-cover rounded-bl-[100px] shadow-2xl border-2 border-orange-300/50"
                    />
                </div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
                {/* Hero Content */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                        Book Premium Billboards.
                        <br />
                        <span className="text-white/95">Amplify Your Brand!</span>
                    </h1>
                    <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
                        Discover the best billboard locations across the city and boost your advertising reach
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="bg-white rounded-2xl shadow-2xl p-3 flex flex-col md:flex-row gap-3">
                        <div className="flex-1 relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-500" />
                            <input
                                type="text"
                                placeholder="Enter your location"
                                className="w-full pl-12 pr-4 py-3 border-0 focus:ring-0 rounded-lg text-gray-700 placeholder-gray-400"
                            />
                        </div>
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-500" />
                            <input
                                type="text"
                                placeholder="Search for billboards..."
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border-0 focus:ring-0 rounded-lg text-gray-700 placeholder-gray-400"
                            />
                        </div>
                        <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2">
                            <Search className="h-5 w-5" />
                            <span>Search</span>
                        </button>
                    </div>
                </div>

                {/* Service Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {/* Card 1 - Premium Locations */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">PREMIUM LOCATIONS</h3>
                                <p className="text-sm text-gray-600">HIGH TRAFFIC AREAS</p>
                            </div>
                            <div className="bg-orange-100 p-2 rounded-lg group-hover:bg-orange-200 transition-colors">
                                <TrendingUp className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                        <p className="text-orange-600 font-semibold text-sm mb-3">UPTO 70% VISIBILITY</p>
                        <div className="relative h-32 bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg overflow-hidden">
                            <img
                                src={premiumLocationImg}
                                alt="Premium Location"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 to-transparent"></div>
                        </div>
                        <div className="mt-4 flex items-center justify-end">
                            <div className="bg-orange-600 text-white p-2 rounded-full group-hover:bg-orange-700 transition-colors">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 - Digital Displays */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">DIGITAL DISPLAYS</h3>
                                <p className="text-sm text-gray-600">MODERN TECHNOLOGY</p>
                            </div>
                            <div className="bg-orange-100 p-2 rounded-lg group-hover:bg-orange-200 transition-colors">
                                <Zap className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                        <p className="text-orange-600 font-semibold text-sm mb-3">UPTO 60% ENGAGEMENT</p>
                        <div className="relative h-32 bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg overflow-hidden">
                            <img
                                src={billboardDigitalScreen}
                                alt="Digital Display"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 to-transparent"></div>
                        </div>
                        <div className="mt-4 flex items-center justify-end">
                            <div className="bg-orange-600 text-white p-2 rounded-full group-hover:bg-orange-700 transition-colors">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Card 3 - Best Deals */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">BEST DEALS</h3>
                                <p className="text-sm text-gray-600">SAVE MORE TODAY</p>
                            </div>
                            <div className="bg-orange-100 p-2 rounded-lg group-hover:bg-orange-200 transition-colors">
                                <Award className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                        <p className="text-orange-600 font-semibold text-sm mb-3">UPTO 50% OFF</p>
                        <div className="relative h-32 bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg overflow-hidden">
                            <img
                                src={bestDealsImg}
                                alt="Best Deals"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 to-transparent"></div>
                        </div>
                        <div className="mt-4 flex items-center justify-end">
                            <div className="bg-orange-600 text-white p-2 rounded-full group-hover:bg-orange-700 transition-colors">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
