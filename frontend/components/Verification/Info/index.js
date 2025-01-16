"use client"
import { useRouter } from 'next/navigation';
import React from 'react';

const VerificationInfo = () => {
    const router = useRouter();

    const handleProceed = () => {
        router.push('/sell/verify');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 mt-4 mb-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
                <h2 className="text-3xl font-bold mb-6 text-center">User Verification</h2>
                <p className="mb-4 text-lg">In the digital age, ensuring user authenticity is paramount to safeguarding personal information and maintaining secure platforms. One of the most effective strategies for user verification involves a three-step approach: uploading a recognized government ID card, and verifying the user&#39;s location. Here&#39;s a brief overview of how these methods work and their significance.</p>
                
                
                
                <h3 className="text-2xl font-semibold mt-6 mb-2">1. Government ID Card Upload</h3>
                <p className="mb-4 text-lg">Uploading a recognized government ID card is a critical component of identity verification. This method ensures that the user provides a legitimate, government-issued document such as a passport, driver&#39;s license, or national ID card. The process typically includes:</p>
                <ul className="list-disc list-inside mb-4 text-lg">
                    <li><strong>ID Capture:</strong> Users upload a clear, high-quality image of their government ID.</li>
                    <li><strong>Document Verification:</strong> Advanced software checks the ID for authenticity by analyzing security features, text accuracy, and overall integrity.</li>
                    <li><strong>Data Extraction:</strong> Relevant information, such as name, date of birth, and ID number, is extracted from the document for comparison with the user&#39;s input data.</li>
                </ul>

                <h3 className="text-2xl font-semibold mt-6 mb-2">2. Location Verification</h3>
                <p className="mb-4 text-lg">Location verification ensures that the user is in a specific geographic area or that their submitted address matches their actual location. The process typically involves:</p>
                <ul className="list-disc list-inside mb-4 text-lg">
                    <li><strong>GPS Verification:</strong> Users enable location services on their device to share their current geographic coordinates.</li>
                    <li><strong>Address Matching:</strong> The submitted address is cross-referenced with the GPS data to ensure consistency and accuracy.</li>
                    <li><strong>Geolocation Accuracy:</strong> Advanced geolocation techniques verify that the user&#39;s location is within an acceptable range of the submitted address, providing an additional layer of security.</li>
                </ul>
                
                <p className="mt-6 mb-4 text-lg">Combining camera picture verification, government ID uploads, and location verification provides a robust process that helps prevent identity theft, ensures compliance with regulations, and enhances user trust. By utilizing these methods, platforms can create a secure environment that protects both the user and the organization.</p>
                
                <div className="text-center">
                    <button onClick={handleProceed} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                        Proceed to Verification
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerificationInfo;
