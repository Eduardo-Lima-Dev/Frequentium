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
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded-lg w-1/2 relative"> {/* Aumentei a largura do modal para 50% */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl text-white">Upload de Arquivo JSON</h2>
                    <button
                        onClick={closeModal}
                        className="text-white text-2xl ml-4"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div
                    {...getRootProps()}
                    className="border-4 border-dashed border-gray-500 p-6 text-center cursor-pointer"
                >
                    <input {...getInputProps()} />
                    <p className="text-white">Arraste e solte um arquivo JSON aqui, ou clique para selecionar.</p>
                </div>
                <p className="text-gray-400 mt-4 text-center">Somente arquivos JSON são permitidos.</p>
            </div>
        </div>
    );
};

export default UploadJsonModal;
