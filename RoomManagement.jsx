import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RoomManagement = () => {
    const [roomType, setRoomType] = useState('');
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const [roomDetails, setRoomDetails] = useState([]);
    const [filteredRoomDetails, setFilteredRoomDetails] = useState(roomDetails);
    const [formData, setFormData] = useState({
        roomType: '',
        studentOrStartup: '',
        leaseSignedDate: '',
        rentOverdue: false,
        totalMembers: '',
        memberDetails: [],
        spaceAlloted: '',
        amount: '',
        amountInWords: '',
        rentForProperty: '',
        rentalPeriodFrom: '',
        rentalPeriodTo: '',
        paymentBy: '',
        paidBy: ''
    });

    const BASE_URL = 'http://localhost:5000/api/rooms';

    useEffect(() => {
        fetchRoomDetails();
    }, []);

    const fetchRoomDetails = async () => {
        try {
            const response = await axios.get(BASE_URL);
            setRoomDetails(response.data);
            setFilteredRoomDetails(response.data);
        } catch (error) {
            toast.error("Error fetching room details.");
        }
    };

    const handleRoomTypeChange = (e) => {
        const selectedType = e.target.value;
        setRoomType(selectedType);

        if (selectedType) {
            const filtered = roomDetails.filter(room => room.roomType === selectedType);
            setFilteredRoomDetails(filtered);
        } else {
            setFilteredRoomDetails(roomDetails);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (
            !roomType ||
            !formData.studentOrStartup ||
            !formData.leaseSignedDate ||
            formData.totalMembers < 1 ||
            !formData.paymentBy || // Assuming payment method is required
            !formData.rentalPeriodFrom || // Assuming these dates are also required
            !formData.rentalPeriodTo
        ) {
            toast.warn("Please fill all required fields.");
            return;
        }

        const dataToSubmit = {
            ...formData,
            roomType,
            totalMembers: parseInt(formData.totalMembers, 10),
            leaseSignedDate: new Date(formData.leaseSignedDate), // Ensure date is a Date object
            rentalPeriodFrom: new Date(formData.rentalPeriodFrom), // Ensure date is a Date object
            rentalPeriodTo: new Date(formData.rentalPeriodTo), // Ensure date is a Date object
            amount: formData.amount ? parseFloat(formData.amount) : undefined, // Handle optional fields
        };

        console.log("Data to submit:", dataToSubmit); // Debug log

        try {
            if (currentRoomId) {
                await axios.put(`${BASE_URL}/${currentRoomId}`, dataToSubmit);
                setCurrentRoomId(null);
                toast.success("Startup updated successfully.");
            } else {
                await axios.post(BASE_URL, dataToSubmit);
                toast.success("Startup added successfully.");
            }

            fetchRoomDetails();

            // Reset form data
            setFormData({
                roomType: '',
                studentOrStartup: '',
                leaseSignedDate: '',
                rentOverdue: false,
                totalMembers: '',
                memberDetails: [],
                spaceAlloted: '',
                amount: '',
                amountInWords: '',
                rentForProperty: '',
                rentalPeriodFrom: '',
                rentalPeriodTo: '',
                paymentBy: '',
                paidBy: ''
            });
            setRoomType('');
        } catch (error) {
            console.error("Error adding/updating room:", error); // Debug log
            toast.error("Error adding/updating room.");
        }
    };

    const handleUpdate = (room) => {
        setFormData({
            roomType: room.roomType,
            studentOrStartup: room.studentOrStartup,
            leaseSignedDate: room.leaseSignedDate,
            rentOverdue: room.rentOverdue,
            totalMembers: room.totalMembers,
            memberDetails: room.memberDetails,
            spaceAlloted: room.spaceAlloted,
            amount: room.amount,
            amountInWords: room.amountInWords,
            rentForProperty: room.rentForProperty,
            rentalPeriodFrom: room.rentalPeriodFrom,
            rentalPeriodTo: room.rentalPeriodTo,
            paymentBy: room.paymentBy,
            paidBy: room.paidBy
        });
        setRoomType(room.roomType);
        setCurrentRoomId(room._id);
    };

    const handleDelete = async (id) => {
        // Show confirmation dialog
        const isConfirmed = window.confirm("Are you sure you want to delete this startup?");

        // If the user clicked "Cancel", exit the function
        if (!isConfirmed) {
            return;
        }

        try {
            await axios.delete(`${BASE_URL}/${id}`);
            fetchRoomDetails(); // Refresh the room details
            toast.success("Startup deleted successfully."); // Show success message
        } catch (error) {
            console.error("Error deleting startup:", error); // Log the error for debugging
            toast.error("Error deleting startup."); // Show error message
        }
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            // Map jsonData to match your formData structure
            jsonData.forEach((row) => {
                const formattedRow = {
                    studentOrStartup: row['Student/Startup Name'] || '',
                    leaseSignedDate: row['L&L Agreement Date'] || '',
                    totalMembers: row['Total Members'] || '',
                    spaceAlloted: row['Space Allotted'] || '',
                    amount: row['Amount'] || '',
                    rentForProperty: row['Property For Rent'] || '',
                    rentalPeriodFrom: row['Rental Period From'] || '',
                    rentalPeriodTo: row['Rental Period To'] || '',
                    paymentBy: row['Payment By'] || '',
                    paidBy: row['Paid By'] || '',
                    rentOverdue: row['Rent Overdue'] === 'Yes',
                };
                saveImportedData(formattedRow);
            });
        };

        reader.readAsArrayBuffer(file);
    };

    // Save imported data to your server or state
    const saveImportedData = async (data) => {
        try {
            await axios.post(BASE_URL, data);
            fetchRoomDetails();
            toast.success("Data imported successfully.");
        } catch (error) {
            console.error("Error importing data:", error);
            toast.error("Error importing data.");
        }
    };

    const handleExport = () => {
        // Define the custom header row
        const header = [
            "STUDENT/STARTUP NAME",
            "L&L AGREEMENT DATE",
            "TOTAL MEMBERS",
            "SPACE ALLOTTED",
            "AMOUNT",
            "PROPERTY FOR RENT",
            "RENTAL PERIOD FROM",
            "RENTAL PERIOD TO",
            "PAYMENT BY",
            "PAID BY",
            "RENT OVERDUE"
        ];

        // Function to format date in DD-MM-YYYY
        const formatDate = (date) => {
            if (!date) return "N/A";
            const d = new Date(date);
            return d.toLocaleDateString('en-GB'); // 'en-GB' formats as DD/MM/YYYY
        };

        // Map roomDetails to match the custom header order
        const formattedData = roomDetails.map(item => ({
            "STUDENT/STARTUP NAME": item.studentOrStartup, 
            "L&L AGREEMENT DATE": formatDate(item.leaseSignedDate), 
            "TOTAL MEMBERS": item.totalMembers, 
            "SPACE ALLOTTED": item.spaceAlloted, 
            "AMOUNT": item.amount, 
            "PROPERTY FOR RENT": item.rentForProperty, 
            "RENTAL PERIOD FROM": formatDate(item.rentalPeriodFrom), 
            "RENTAL PERIOD TO": formatDate(item.rentalPeriodTo), 
            "PAYMENT BY": item.paymentBy, 
            "PAID BY": item.paidBy, 
            "RENT OVERDUE": item.rentOverdue ? "YES" : "NO" 
        }));

        // Convert formatted data to worksheet
        const worksheet = XLSX.utils.json_to_sheet(formattedData, { header });

        // Create a new workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "RoomDetails");

        // Generate buffer and save as Excel file
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'RoomDetails.xlsx');
        toast.success("Data exported successfully.");
    };


    return (
        <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-white to-indigo-100 py-10">
            <ToastContainer />
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <img src="/images/dtu-logo.png" alt="DTU Logo" className="h-20 md:h-28" />
                <h1 className="text-center text-2xl md:text-5xl font-bold text-indigo-900 mx-4">DTU INNOVATION AND INCUBATION FOUNDATION</h1>
                <img src="/images/Picture1.png" alt="DTU IIF Logo" className="h-16 md:h-20" />
            </div>
            <h2 className="text-center text-2xl md:text-4xl font-bold text-blue-900 mb-8 mt-0">SPACE MANAGER</h2>

            {/* Room Type Selector */}
            <div className="flex justify-center mb-8 md:mb-12">
                <select
                    onChange={handleRoomTypeChange}
                    className="w-3/4 md:w-auto p-4 rounded-full border border-gray-300 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 transition"
                    value={roomType}
                >
                    <option value="">Select Room Type</option>
                    <option value="only seat">Only Seat - Rs. 3000/month</option>
                    <option value="small room">Small Room - Rs. 5000/month</option>
                    <option value="large room">Large Room - Rs. 8000/month</option>
                </select>
            </div>

            {/* Add Startup Form */}
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-lg shadow-lg mb-8 md:mb-12 border border-gray-200">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Add a New Startup</h2>
                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                            type="text"
                            placeholder="Startup/Student Name"
                            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            onChange={(e) => setFormData({ ...formData, studentOrStartup: e.target.value })}
                            value={formData.studentOrStartup}
                        />
                        <input
                            type="text"
                            placeholder="L&L Agreement Date"
                            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            onFocus={(e) => (e.target.type = 'date')}
                            onBlur={(e) => (e.target.type = e.target.value ? 'date' : 'text')}
                            onChange={(e) => setFormData({ ...formData, leaseSignedDate: e.target.value })}
                            value={formData.leaseSignedDate}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                            type="number"
                            placeholder="Total Members"
                            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            onChange={(e) => setFormData({ ...formData, totalMembers: e.target.value })}
                            value={formData.totalMembers}
                        />
                    </div>

                    {/* New Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                            type="text"
                            placeholder="Space Alloted"
                            className="w-full p -4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            onChange={(e) => setFormData({ ...formData, spaceAlloted: e.target.value })}
                            value={formData.spaceAlloted}
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            value={formData.amount}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                            type="text"
                            placeholder="Amount in Words"
                            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            onChange={(e) => setFormData({ ...formData, amountInWords: e.target.value })}
                            value={formData.amountInWords}
                        />
                        <input
                            type="text"
                            placeholder="Property For Rent"
                            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            onChange={(e) => setFormData({ ...formData, rentForProperty: e.target.value })}
                            value={formData.rentForProperty}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                            type="text"
                            placeholder="Rental Period From"
                            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            onFocus={(e) => (e.target.type = 'date')}
                            onBlur={(e) => (e.target.type = e.target.value ? 'date' : 'text')}
                            onChange={(e) => setFormData({ ...formData, rentalPeriodFrom: e.target.value })}
                            value={formData.rentalPeriodFrom}
                        />
                        <input
                            type="text"
                            placeholder="Rental Period To"
                            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            onFocus={(e) => (e.target.type = 'date')}
                            onBlur={(e) => (e.target.type = e.target.value ? 'date' : 'text')}
                            onChange={(e) => setFormData({ ...formData, rentalPeriodTo: e.target.value })}
                            value={formData.rentalPeriodTo}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <select
                            onChange={(e) => setFormData({ ...formData, paymentBy: e.target.value })}
                            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            value={formData.paymentBy}
                        >
                            <option value="">Payment By</option>
                            <option value="cash">Cash</option>
                            <option value="credit card">Credit Card</option>
                            <option value="cheque">Cheque</option>
                            <option value="e-payment">E-Payment</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Paid By"
                            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}
                            value={formData.paidBy}
                        />
                    </div>

                    <div className="flex items-center mt-4">
                        <input
                            type="checkbox"
                            onChange={(e) => setFormData({ ...formData, rentOverdue: e.target.checked })}
                            checked={formData.rentOverdue}
                            className="mr-3"
                        />
                        <label className="text-gray-600">Rent Overdue</label>
                    </div>
                    <div className="flex justify-center mt-6">
                        <button type="submit" className="w-full md:w-1/2 bg-indigo-600 text-white py-3 rounded-full font-semibold hover:bg-indigo-700 transition">
                            {currentRoomId ? 'Update Room' : 'Add Startup'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Import/Export buttons */}
            <div className="flex justify-center space-x-4 mb-4 w-full">
                <input type="file" onChange={handleImport} className="hidden" id="fileUpload" />
                <label
                    htmlFor="fileUpload"
                    className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                    Import from Excel
                </label>
                <button
                    onClick={handleExport}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Export to Excel
                </button>
            </div>


            {/* Room Details Table */}
            <div className="max-w-5xl mx-auto overflow-x-auto">
                <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
                    <thead className="bg-indigo-500 text-white">
                        <tr>
                            <th className="py-2 md:py-4 px-2 md:px-6 font-semibold text-center text-xs md:text-sm">Startup Name</th>
                            <th className="py-2 md:py-4 px-2 md:px-6 font-semibold text-center text-xs md:text-sm">L&L Agreement Date</th>
                            <th className="py-2 md:py-4 px-2 md:px-6 font-semibold text-center text-xs md:text-sm">Rent Amount</th>
                            <th className="py-2 md:py-4 px-2 md:px-6 font-semibold text-center text-xs md:text-sm">Property For Rent</th>
                            <th className="py-2 md:py-4 px-2 md:px-6 font-semibold text-center text-xs md:text-sm">Overdue</th>
                            <th className="py-2 md:py-4 px-2 md:px-6 font-semibold text-center text-xs md:text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRoomDetails.map((room) => (
                            <tr key={room._id} className="border-b last:border-none hover:bg-gray-50 transition">
                                <td className="text-center py-2 md:py-4 px-2 md:px-6">{room.studentOrStartup}</td>
                                <td className="text-center py-2 md:py-4 px-2 md:px-6">{new Date(room.leaseSignedDate).toLocaleDateString('en-GB')}</td>
                                <td className="text-center py-2 md:py-4 px-2 md:px-6">{room.amount}</td>
                                <td className="text-center py-2 md:py-4 px-2 md:px-6">{room.rentForProperty}</td>
                                <td className="text-center py-2 md:py-4 px-2 md:px-6">{room.rentOverdue ? 'Yes' : 'No'}</td>
                                <td className="flex justify-center space-x-1 md:space-x-2 py-2 md:py-4 px-2 md:px-6">
                                    <button
                                        onClick={() => handleUpdate(room)}
                                        className="bg-yellow-500 text-white py-1 px-1 md:py-2 md:px-2 rounded-lg hover:bg-yellow-600 transition text-xs md:text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(room._id)}
                                        className="bg-red-500 text-white py-1 px-1 md:py-2 md:px-2 rounded-lg hover:bg-red-600 transition text-xs md:text-sm"
                                    >
                                        Delete
                                    </button>
                                    <a
                                        href={`/rooms/${room._id}`} // Link to RoomDetails page
                                        className="bg-blue-500 text-white py-1 px-1 md:py-2 md:px-2 rounded-lg hover:bg-blue-600 transition text-xs md:text-sm"
                                    >
                                        More Details
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer without white background */}
            <footer className="text-center py-4 mt-4">
                <p className="text-gray-600 font-bold">
                    Developed For The DTU INCUBATION CENTRE By <a href="https://www.linkedin.com/in/aditya-basu-bbb882256/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Aditya Basu</a>
                </p>
            </footer>
        </div>
    );
};

export default RoomManagement;
