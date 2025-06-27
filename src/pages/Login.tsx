import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onSuccess: () => void;
  onRegister: () => void;
  onBackToLanding: () => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess, onRegister, onBackToLanding }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setErrors({ general: 'Por favor completa todos los campos' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        onSuccess();
      } else {
        setErrors({ general: 'Email o contraseña incorrectos' });
      }
    } catch (error) {
      setErrors({ general: 'Error al iniciar sesión. Intenta de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors.general) {
      setErrors({});
    }
  };

  const fillDemoCredentials = () => {
    setFormData({
      email: 'demo@neuri.com',
      password: 'demo123'
    });
    setErrors({});
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Bienvenido de vuelta</h1>
          <p className="text-gray-600">Inicia sesión en tu cuenta</p>
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 opacity-0 animate-fade-in">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors duration-200"
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors duration-200"
                placeholder="Tu contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 space-y-4">
          <div className="text-center">
            <p className="text-gray-600">
              ¿No tienes cuenta?{' '}
              <button
                onClick={onRegister}
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
              >
                Crear cuenta
              </button>
            </p>
          </div>
          
          <div className="text-center">
            <button
              onClick={onBackToLanding}
              className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200"
            >
              ← Volver al inicio
            </button>
          </div>
        </div>

        {/* Demo credentials */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="text-center mb-3">
            <p className="text-sm font-semibold text-blue-800 mb-2">
              🎯 Cuenta de Demostración
            </p>
            <p className="text-xs text-blue-700 mb-3">
              Prueba la aplicación con datos de ejemplo
            </p>
          </div>
          
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-200"
          >
            Usar Cuenta Demo
          </button>
          
          <div className="mt-3 text-xs text-blue-600 text-center">
            <p>Email: demo@neuri.com</p>
            <p>Contraseña: demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;