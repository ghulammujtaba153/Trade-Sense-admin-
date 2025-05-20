import React from 'react'
import { FiUploadCloud } from 'react-icons/fi'

const ImageUploader = ({ label, fieldName, value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">{label}</label>
      <div className="relative border border-dashed border-gray-400 rounded-md p-4 flex items-center justify-center cursor-pointer hover:border-blue-500 transition">
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) => onChange(e, fieldName)}
        />
        <div className="flex flex-col items-center text-gray-600">
          <FiUploadCloud size={32} />
          <p className="text-sm">Click to upload {label.toLowerCase()}</p>
        </div>
      </div>
      {value && (
        <img
          src={value}
          alt={label}
          className="h-24 mt-2 rounded object-cover border"
        />
      )}
    </div>
  )
}

export default ImageUploader
