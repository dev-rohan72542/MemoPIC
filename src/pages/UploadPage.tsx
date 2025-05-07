import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, FileText, X, AlertCircle } from 'lucide-react';

interface UploadPageProps {
  onImageUpload: (file: File) => void;
  error?: string | null;
}

const UploadPage: React.FC<UploadPageProps> = ({ onImageUpload, error }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      
      // Create a preview URL for the image
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  const handleContinue = () => {
    if (selectedFile) {
      onImageUpload(selectedFile);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Upload Your Study Material</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <p className="text-gray-600 mb-6 text-center">
            Upload an image of your notes, document, or diagram to create a quiz.
            We support JPG and PNG formats.
          </p>
          
          {!previewUrl ? (
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition duration-300 ease-in-out ${
                isDragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-1">
                {isDragActive ? 'Drop the image here' : 'Drag and drop your image'}
              </p>
              <p className="text-gray-500 mb-4">or click to browse files</p>
              <div className="flex justify-center gap-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Image className="h-5 w-5 mr-1" />
                  JPG
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FileText className="h-5 w-5 mr-1" />
                  PNG
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="rounded-lg overflow-hidden mb-4">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-h-96 mx-auto object-contain"
                />
              </div>
              <button 
                onClick={handleRemoveFile}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                aria-label="Remove image"
              >
                <X className="h-5 w-5 text-gray-700" />
              </button>
              <div className="text-center text-gray-600 text-sm mt-2">
                {selectedFile?.name} ({Math.round(selectedFile?.size / 1024)} KB)
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={handleContinue}
          disabled={!selectedFile}
          className={`py-3 px-8 rounded-lg font-medium shadow-md transition duration-300 ease-in-out ${
            selectedFile
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-gray-300 cursor-not-allowed text-gray-500'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default UploadPage;