import React, { useState } from 'react';

const SubirFoto = ({ servicioId }) => {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('id', servicioId);

    try {
      const response = await fetch('http://localhost:5000/api/servicios/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('Imagen subida con éxito');
      } else {
        alert('Error al subir la imagen');
      }
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      alert('Error al subir la imagen');
    }
  };

  return (
    <div className="space-y-4">
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleImageChange} 
        className="file-input file-input-bordered file-input-primary w-full max-w-xs bg-gray-700 text-white"
      />
      <button 
        onClick={handleUpload} 
        className="btn btn-primary w-full"
      >
        Subir Imagen
      </button>
    </div>
  );
};

export default SubirFoto;
