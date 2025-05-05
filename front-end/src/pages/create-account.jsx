import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    email: '',
    numero_telephone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.numero_telephone) {
      newErrors.numero_telephone = 'Phone number is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/citizens/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            numero_telephone: formData.numero_telephone,
            password_hash: formData.password // Note: Your backend should hash this
          }),
        });

        const responseData = await response.json();
        
        if (!response.ok) {
          if (responseData.detail) {
            // Handle different error formats
            if (Array.isArray(responseData.detail)) {
              const apiErrors = {};
              responseData.detail.forEach(error => {
                const field = error.loc ? error.loc[1] : 'server';
                apiErrors[field] = error.msg;
              });
              setErrors(apiErrors);
            } else {
              setErrors({ server: responseData.detail });
            }
          } else {
            setErrors({ server: 'Account creation failed. Please try again.' });
          }
          return;
        }

        // Clear form on success
        setFormData({
          email: '',
          numero_telephone: '',
          password: '',
          confirmPassword: ''
        });
        
        setSuccessMessage('Account created successfully!');
        setErrors({});
      } catch (error) {
        console.error('Account creation error:', error);
        setErrors({
          ...errors,
          server: 'Network error. Please try again.'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
        noValidate
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Créer un compte</h2>

        {errors.server && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">
            {errors.server}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 text-sm rounded">
            {successMessage}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Adresse e-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring ${
              errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
            }`}
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="exemple@domaine.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="numero_telephone" className="block text-sm font-medium text-gray-700">
            Numéro de téléphone
          </label>
          <input
            type="tel"
            id="numero_telephone"
            name="numero_telephone"
            className={`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring ${
              errors.numero_telephone ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
            }`}
            value={formData.numero_telephone}
            onChange={handleChange}
            required
            placeholder="0612345678"
          />
          {errors.numero_telephone && (
            <p className="mt-1 text-sm text-red-600">{errors.numero_telephone}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className={`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring ${
              errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
            }`}
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            minLength="8"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className={`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring ${
              errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
            }`}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Création en cours...' : 'Créer un compte'}
        </button>

        <div className="mt-4 text-center text-sm text-gray-600">
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Se connecter
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CreateAccount;