import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Baby, Calendar } from 'lucide-react';

interface RegisterProps {
  onSuccess: () => void;
  onBackToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSuccess, onBackToLogin }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    childName: '',
    childAge: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.childName.trim()) {
      newErrors.childName = 'El nombre del niño/a es requerido';
    }

    if (!formData.childAge || parseInt(formData.childAge) < 1 || parseInt(formData.childAge) > 18) {
      newErrors.childAge = 'La edad debe estar entre 1 y 18 años';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const success = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        childName: formData.childName,
        childAge: parseInt(formData.childAge)
      });

      if (success) {
        onSuccess();
      } else {
        setErrors({ email: 'Este email ya está registrado' });
      }
    } catch (error) {
      setErrors({ general: 'Error al crear la cuenta. Intenta de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md opacity-0 animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4">
            <img 
              src="/Logo Neuri-.png" 
              alt="Neuri Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Crear Cuenta</h1>
          <p className="text-gray-600">Únete a la familia Neuri</p>
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Parent Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Tu nombre completo
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200 ${
                  errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                }`}
                placeholder="Ej: María González"
              />
            </div>
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200 ${
                  errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                }`}
                placeholder="tu@email.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200 ${
                  errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                }`}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Confirmar contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200 ${
                  errors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                }`}
                placeholder="Repite tu contraseña"
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>

          {/* Child Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nombre del niño/a
            </label>
            <div className="relative">
              <Baby className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={formData.childName}
                onChange={(e) => handleInputChange('childName', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200 ${
                  errors.childName ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                }`}
                placeholder="Ej: Sofía"
              />
            </div>
            {errors.childName && <p className="text-red-500 text-sm">{errors.childName}</p>}
          </div>

          {/* Child Age */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Edad del niño/a
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="number"
                min="1"
                max="18"
                value={formData.childAge}
                onChange={(e) => handleInputChange('childAge', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200 ${
                  errors.childAge ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                }`}
                placeholder="Ej: 8"
              />
            </div>
            {errors.childAge && <p className="text-red-500 text-sm">{errors.childAge}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={onBackToLogin}
              className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
            >
              Iniciar Sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;