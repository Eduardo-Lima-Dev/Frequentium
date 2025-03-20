import React from 'react';
import { useDropzone } from 'react-dropzone';
import { FaTimes } from 'react-icons/fa';

interface UploadJsonModalProps {
    isOpen: boolean;
    closeModal: () => void;
    handleFileUpload: (file: File) => void;
}

const UploadJsonModal: React.FC<UploadJsonModalProps> = ({ isOpen, closeModal, handleFileUpload }) => {

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'application/json': ['.json'] },
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                handleFileUpload(acceptedFiles[0]);
                closeModal();
            }
        },
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <FaTimes />
                </button>
                <h2 className="text-2xl mb-4">Upload de Arquivo JSON</h2>
                <div
                    {...getRootProps()}
                    className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-gray-500 transition-colors"
                >
                    <input {...getInputProps()} />
                    <p className="text-white">Arraste e solte um arquivo JSON aqui, ou clique para selecionar.</p>
                </div>
                <p className="text-gray-400 mt-4 text-center text-sm">Somente arquivos JSON são permitidos.</p>
            </div>
        </div>
    );
};

export default UploadJsonModal;
