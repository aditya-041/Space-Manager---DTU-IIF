import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const RoomDetails = () => {
    const { id } = useParams();
    const [roomDetails, setRoomDetails] = useState(null);
    const [overdueDays, setOverdueDays] = useState(0);
    

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/rooms/${id}`);
                const roomData = response.data;
                setRoomDetails(roomData); 

                const today = new Date();
                const dueDate = new Date(roomData.rentalPeriodTo);
                const differenceInTime = today - dueDate;

                if (roomData.rentOverdue) {
                    const daysOverdue = Math.floor(differenceInTime / (1000 * 3600 * 24));
                    setOverdueDays(daysOverdue > 0 ? daysOverdue : 0);
                } else {
                    setOverdueDays(0);
                }
            } catch (error) {
                console.error("Error fetching room details:", error);
            }
        };

        fetchRoomDetails();
    }, [id]);

    useEffect(() => {
        const updateOverdueDays = () => {
            const today = new Date();
            const dueDate = new Date(roomDetails?.rentalPeriodTo);
            const differenceInTime = today - dueDate;

            if (roomDetails?.rentOverdue) {
                const daysOverdue = Math.floor(differenceInTime / (1000 * 3600 * 24)); 
                setOverdueDays(daysOverdue > 0 ? daysOverdue : 0);
            }
        };

        if (roomDetails) {
            updateOverdueDays();
            const intervalId = setInterval(updateOverdueDays, 1000 * 60 * 60 * 24);

            return () => clearInterval(intervalId);
        }
    }, [roomDetails]);

    const printReceipt = () => {
        if (!roomDetails) return;
    
        const receiptHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rent Receipt</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
        }
        .receipt {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #ccc;
            padding: 20px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #ccc;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .logo {
            width: 15px;
            height: 15px;
            border-radius: 50%;
            overflow:clip;
        }
        .title {
            font-size: 18px;
            font-weight: bold;
        }
        .subtitle {
            font-size: 16px;
        }
        .receipt-details {
            text-wrap:nowrap;
        }
        .main-content {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        .section {
            width: 48%;
        }
        .section-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .grid {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 10px;
            margin-bottom: 20px;
        }
        .grid-item {
            padding: 5px;
            border-bottom: 1px solid #eee;
        }
        .payment-methods {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        .footer {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
        }
        .signature {
            text-align: center;
        }
        .thank-you {
            text-align: center;
            font-style: italic;
            margin-top: 20px;
        }
        .pad{
            padding:3px;
        }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="header">
            <img src="/images/Picture1.png" height="50px" width="50px" />
        <div class="logo">
        </div>
            <div class= "pad">
                <div class="title">DTU INNOVATION AND INCUBATION FOUNDATION DTU DELHI-42</div>
                <div class="subtitle">LEAVE AND LICENSE CUM RENT RECEIPT</div>
            </div>
            <div class="receipt-details">
                <div>RECEIPT NO. ${generateReceiptNumber()}</div>
                <div>DATE: ${new Date().toLocaleDateString('en-GB')}</div>
            </div>
        </div>

        <div class="main-content">
            <div class="section">
                <div class="section-title">STARTUP/FOUNDER NAME:</div>
                <div>${roomDetails.studentOrStartup}</div>
            </div>
            <div class="section">
                <div class="section-title">SPACE ALLOTED:</div>
                <div>${roomDetails.spaceAlloted}</div>
            </div>
        </div>

        <div class="grid">
            <div class="grid-item"><strong>AMOUNT</strong></div>
            <div class="grid-item"><strong>RS. ${roomDetails.amount}/-</strong></div>
            <div class="grid-item"><strong>AMOUNT IN WORDS</strong></div>
            <div class="grid-item">RUPEES:  ${convertAmountToWords(roomDetails.amount)}</div>
            <div class="grid-item"><strong>RENT FOR PROPERTY</strong></div>
            <div class="grid-item">${roomDetails.rentForProperty}</div>
        </div>

        <div class="grid">
            <div class="grid-item"><strong>RENTAL PERIOD</strong></div>
            <div class="grid-item">
                FROM: ${new Date(roomDetails.rentalPeriodFrom).toLocaleDateString('en-GB')}
                TO: ${new Date(roomDetails.rentalPeriodTo).toLocaleDateString('en-GB')}
            </div>
        </div>

        <div class="payment-methods">
            <div><strong>PAYMENT BY:</strong></div>
            <div><input type="checkbox" ${roomDetails.paymentBy == "cash" ? "checked":""} > Cash</div>
            <div><input type="checkbox" ${roomDetails.paymentBy == "credit card" ? "checked":""}> Credit Card</div>
            <div><input type="checkbox" ${roomDetails.paymentBy == "cheque" ? "checked":""}> Cheque</div>
            <div><input type="checkbox" ${roomDetails.paymentBy == "e-payment" ? "checked":""}> E PAYMENT</div>
        </div>

        <div class="footer">
            <div class="signature">
                <strong>PAID BY</strong>
                <div>${roomDetails.paidBy}</div>
            </div>
            <div class="signature">
                <strong>RECEIVED BY</strong>
                <div>DTU-IIF</div>
            </div>
            <div class="signature">
                <strong>AUTHORIZED BY</strong>
                <div>INCUBATION MANAGER</div>
            </div>
        </div>

        <div class="thank-you">THANK YOU FOR YOUR BUSINESS</div>
    </div>
</body>
</html>`
        const printWindow = window.open('', '_blank');
        printWindow.document.open();
        printWindow.document.write(receiptHTML);
        printWindow.document.close();
    
        
        setTimeout(() => {
            printWindow.focus(); 
            printWindow.print(); 
            printWindow.close(); 
        }, 1000); 
    };

    const convertAmountToWords = (amount) => {
        const words = [
            '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
            'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen',
            'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
        ];

        if (amount === 0) return 'ZERO ONLY';

        let word = '';
        const lakhs = Math.floor(amount / 100000);
        const thousands = Math.floor((amount % 100000) / 1000);
        const hundreds = Math.floor((amount % 1000) / 100);
        const tensAndUnits = amount % 100;

        // Handle lakhs
        if (lakhs > 0) {
            word += (lakhs < 20 ? words[lakhs] : words[18 + Math.floor(lakhs / 10)] + (lakhs % 10 ? ' ' + words[lakhs % 10] : '')) + ' Lakh ';
        }

        // Handle thousands
        if (thousands > 0) {
            word += (thousands < 20 ? words[thousands] : words[18 + Math.floor(thousands / 10)] + (thousands % 10 ? ' ' + words[thousands % 10] : '')) + ' Thousand ';
        }

        // Handle hundreds
        if (hundreds > 0) {
            word += words[hundreds] + ' Hundred ';
        }

        // Handle tens and units
        if (tensAndUnits > 0) {
            if (tensAndUnits < 20) {
                word += words[tensAndUnits] + ' ';
            } else {
                const tens = Math.floor(tensAndUnits / 10);
                const units = tensAndUnits % 10;
                word += words[18 + tens] + ' ';
                if (units > 0) {
                    word += words[units] + ' ';
                }
            }
        }

        return word.trim().toUpperCase() + ' ONLY';
    };

    const generateReceiptNumber = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const uniqueNumber = Math.floor(Math.random() * 100); // Random unique number (00 to 99)

        return `${day}${month}/${uniqueNumber}`;
    };

    if (!roomDetails) return <p className="text-center text-gray-600">Loading...</p>;

    return (
<div className="container mx-auto p-8 space-y-8">
    {/* Header */}
    <h1 className="text-4xl font-bold text-center text-blue-700 mb-4 shadow-md p-6 rounded-lg bg-gradient-to-r from-blue-100 to-blue-50">
        Room Details for {roomDetails.studentOrStartup}
    </h1>

    {/* Room Details Card */}
    <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 border-b-2 border-blue-100 pb-2">
            Room Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
            {/* Room details fields */}
            {[
                { label: "Room Type", value: roomDetails.roomType },
                { label: "L&L Agreement Date", value: new Date(roomDetails.leaseSignedDate).toLocaleDateString('en-GB') },
                { label: "Total Members", value: roomDetails.totalMembers },
                { label: "Space Alloted", value: roomDetails.spaceAlloted },
                { label: "Rent Amount", value: `₹${roomDetails.amount}` },
                { label: "Property For Rent", value: roomDetails.rentForProperty },
                {
                    label: "Rental Period",
                    value: `${new Date(roomDetails.rentalPeriodFrom).toLocaleDateString('en-GB')} to ${new Date(roomDetails.rentalPeriodTo).toLocaleDateString('en-GB')}`
                },
                { label: "Paid By", value: roomDetails.paidBy },
                { label: "Overdue", value: roomDetails.rentOverdue ? 'Yes' : 'No' },
                ...(roomDetails.rentOverdue ? [{ label: "Overdue From", value: `${overdueDays} days` }] : []),
                { label: "Payment By", value: roomDetails.paymentBy }
            ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center p-4 rounded-md bg-gray-50">
                    <span className="font-medium text-gray-600">{label}:</span>
                    <span className="text-gray-800">{value}</span>
                </div>
            ))}
        </div>
    </div>

    {/* Print E-Receipt Button */}
    <div className="flex justify-center">
        <button
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-500 transition-transform transform hover:scale-105 shadow-md"
            onClick={printReceipt}
        >
            Print E-Receipt
        </button>
    </div>
</div>

    );
};

export default RoomDetails;
