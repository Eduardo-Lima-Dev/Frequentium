import React from 'react';
import logo from '../assets/logo.png'; 

const Header: React.FC = () => {
    return (
        <header className="bg-gray-700 p-6 rounded-lg shadow-md">
            <div className="flex justify-center items-center"> 
                <img src={logo} alt="Frequentium Logo" className="h-15 mr-4" /> 
                <h1 className="text-white text-xl font-bold">Frequentium</h1>
            </div>
        </header>
    );
};

export default Header;
