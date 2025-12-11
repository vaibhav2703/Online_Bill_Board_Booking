import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ownerService from '../../services/ownerService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import BillboardDetailsModal from '../../components/ui/BillboardDetailsModal';
import toast from 'react-hot-toast';

const OwnerDashboard = () => {
    const [billboards, setBillboards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBillboard, setSelectedBillboard] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchBillboards();
    }, []);

    const fetchBillboards = async () => {
        try {
            const data = await ownerService.getOwnerBillboards();
            setBillboards(data);
        } catch (error) {
            toast.error('Failed to load billboards');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this billboard?')) return;
        try {
            await ownerService.deleteBillboard(id);
            toast.success('Billboard deleted successfully');
            fetchBillboards();
        } catch (error) {
            toast.error('Failed to delete billboard');
        }
    };

    const handleBillboardClick = (billboard) => {
        setSelectedBillboard(billboard);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBillboard(null);
    };

    // Filter billboards based on status
    const filteredBillboards = statusFilter === 'all'
        ? billboards
        : billboards.filter(b => b.status === statusFilter);

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'booked':
                return 'bg-blue-100 text-blue-800';
            case 'upcoming':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <LoadingSpinner className="min-h-screen" />;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Billboards</h1>
                        <p className="text-gray-600 mt-1">Manage your billboard inventory</p>
                    </div>
                    <Link
                        to="/owner/registerBillboard"
                        className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 flex items-center space-x-2"
                    >
                        <PlusCircle className="h-5 w-5" />
                        <span>Add Billboard</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-gray-600 text-sm font-medium">Total Billboards</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{billboards.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-gray-600 text-sm font-medium">Available</h3>
                        <p className="text-3xl font-bold text-green-600 mt-2">
                            {billboards.filter((b) => b.status === 'available').length}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-gray-600 text-sm font-medium">Booked</h3>
                        <p className="text-3xl font-bold text-primary-600 mt-2">
                            {billboards.filter((b) => b.status === 'booked').length}
                        </p>
                    </div>
                </div>

                {billboards.length === 0 ? (
                    <EmptyState
                        title="No billboards yet"
                        description="Start by adding your first billboard"
                        action={
                            <Link
                                to="/owner/registerBillboard"
                                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700"
                            >
                                Add Billboard
                            </Link>
                        }
                    />
                ) : (
                    <>
                        {/* Status Filter */}
                        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm"
                                >
                                    <option value="all">All Billboards</option>
                                    <option value="available">Available</option>
                                    <option value="booked">Booked</option>
                                    <option value="upcoming">Upcoming</option>
                                </select>
                                <span className="text-sm text-gray-500">
                                    Showing {filteredBillboards.length} of {billboards.length} billboards
                                </span>
                            </div>
                        </div>

                        {/* Table */}
                        {filteredBillboards.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                <p className="text-gray-600 mb-2">No billboards found with status: <span className="font-semibold">{statusFilter}</span></p>
                                <p className="text-sm text-gray-500">Try selecting a different filter option.</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                {/* Scrollable table wrapper for mobile */}
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Location</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Size</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Price</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredBillboards.map((billboard) => (
                                                <tr key={billboard.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button
                                                            onClick={() => handleBillboardClick(billboard)}
                                                            className="text-primary-600 hover:text-primary-800 hover:underline transition-colors duration-200 font-semibold cursor-pointer text-left"
                                                        >
                                                            {billboard.name}
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{billboard.location}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{billboard.size}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₹{billboard.price}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(billboard.status)}`}>
                                                            {billboard.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <button
                                                            onClick={() => handleDelete(billboard.id)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Billboard Details Modal */}
                <BillboardDetailsModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    billboard={selectedBillboard}
                />
            </div>
        </div>
    );
};

export default OwnerDashboard;
