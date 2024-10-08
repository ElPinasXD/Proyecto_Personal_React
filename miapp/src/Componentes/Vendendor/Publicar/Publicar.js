import React, { useState, useEffect } from 'react';
import './Publicar.css';
import axios from 'axios';
import MensajeProducto from './MensajeProducto';

function Publicar() {
    const [formValues, setFormValues] = useState({
        name: '',
        price: '',
        image: '', // Cambiado a string
        description: '',
        region: '',
        type: '',
        quantity: '',
    });
    const [, setErrors] = useState({});
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [imagePreview, setImagePreview] = useState(''); // Estado para la vista previa de la imagen

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [id]: value,
        }));
    };

    const handleSearchImage = () => {
        const { image } = formValues;
        if (image) {
            setImagePreview(image); // Actualiza la vista previa con el enlace de la imagen
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formValues.name) newErrors.name = 'Nombre es obligatorio';
        if (!formValues.price) newErrors.price = 'Precio es obligatorio';
        if (!formValues.image) newErrors.image = 'Imagen es obligatoria';
        if (!formValues.description) newErrors.description = 'Descripción es obligatoria';
        if (!formValues.region) newErrors.region = 'Región es obligatoria';
        if (!formValues.type) newErrors.type = 'Tipo de producto es obligatorio';
        if (!formValues.quantity) newErrors.quantity = 'Cantidad es obligatoria';
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length === 0) {
            const productData = {
                name: formValues.name,
                price: formValues.price,
                image: formValues.image,
                description: formValues.description,
                region: formValues.region,
                type: formValues.type,
                quantity: formValues.quantity,
                madeBy: username,
            };

            axios.post('http://localhost:3005/products', productData)
                .then(response => {
                    console.log('Producto creado:', response.data);
                    setIsMessageVisible(true);
                })
                .catch(error => {
                    console.error('Error al crear el producto:', error.response ? error.response.data : error.message);
                });
        } else {
            setErrors(formErrors);
        }
    };

    return (
        <div className="container">
            {isMessageVisible ? (
                <MensajeProducto />
            ) : (
                <>
                    <h1 className="title">Ingrese datos del producto</h1>
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Nombre</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Ingrese el nombre del producto"
                                className="input"
                                value={formValues.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="price">Precio</label>
                            <input
                                id="price"
                                type="number"
                                placeholder="Ingrese el precio del producto"
                                className="input"
                                value={formValues.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="quantity">Cantidad</label>
                            <input
                                id="quantity"
                                type="number"
                                placeholder="Ingrese la cantidad del producto"
                                className="input"
                                value={formValues.quantity}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {/*<div className="form-group">
                            <label htmlFor="image">Imagen del producto</label>
                            <div className="upload-container">
                                <UploadIcon className="upload-icon" />
                                <p className="upload-text">Seleccionar archivo</p>
                                <input
                                    id="image"
                                    type="file"
                                    className="file-input"
                                    onChange={handleChange}
                                    accept=".jpg, .png"
                                    required
                                />
                            </div>
                        </div>*/}
                        <div className="form-group">
                            <label htmlFor="image">Imagen del producto (URL)</label>
                            <div className="image-input-container">
                                <input
                                    id="image"
                                    type="text"
                                    placeholder="Ingrese la URL de la imagen"
                                    className="input image-input"
                                    value={formValues.image}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={handleSearchImage}
                                    disabled={!formValues.image}
                                    className="search-button-publicar"
                                >
                                    Buscar
                                </button>
                            </div>
                        </div>
                        {imagePreview && (
                            <div className="image-preview">
                                <img src={imagePreview} alt="Vista previa" className="preview-image" />
                            </div>
                        )}
                        <div className="form-group">
                            <label htmlFor="description">Descripción</label>
                            <textarea
                                id="description"
                                placeholder="Ingrese la descripción del producto"
                                className="textarea"
                                value={formValues.description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="region">Región de origen</label>
                            <select
                                id="region"
                                className="select"
                                value={formValues.region}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Seleccione la región</option>
                                <option value="Andina">Andina</option>
                                <option value="Amazonica">Amazónica</option>
                                <option value="Caribe">Caribe</option>
                                <option value="Pacifica">Pacífica</option>
                                <option value="Insular">Insular</option>
                                <option value="Orinoquia">Orinoquia</option>
                                <option value="Otra">Otra</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="type">Tipo de producto</label>
                            <select
                                id="type"
                                className="select"
                                value={formValues.type}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Seleccione el tipo</option>
                                <option value="Horneados">Horneados</option>
                                <option value="Fritos">Fritos</option>
                                <option value="Gelatinas">Gelatinas</option>
                                <option value="Cremosos">Cremosos</option>
                                <option value="Galletas">Galletas</option>
                                <option value="PlatosF">Platos Fríos</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                        <button type="submit" className="submit-button">Publicar</button>
                    </form>
                </>
            )}
        </div>
    );
}

export default Publicar;

/*
function UploadIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
    );
} */

