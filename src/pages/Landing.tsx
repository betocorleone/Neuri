import React from 'react';
import { Heart, Calendar, BarChart3, Shield, Users, Star } from 'lucide-react';

interface LandingProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const Landing: React.FC<LandingProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 lg:space-x-6">
              {/* Bolt.new logo*/}
              <a 
                href="https://bolt.new/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity duration-200"
                title="Powered by bolt.new"
              >
                <div className="w-14 h-14 lg:w-16 lg:h-16">
                  <img 
                    src="src/assets/black_circle_360x360 bolt.png" 
                    alt="bolt.new" 
                    className="w-full h-full object-contain"
                  //  onError={(e) => {
                      // Fallback to a simple black circle with bolt icon
                    //  const target = e.target as HTMLImageElement;
                     // target.style.display = 'none';
                     // const fallback = document.createElement('div');
                     // fallback.className = 'w-full h-full bg-black rounded-full flex items-center justify-center';
                     // fallback.innerHTML = '<span class="text-white text-2xl">⚡</span>';
                     // target.parentNode?.appendChild(fallback);
                   // }
                    //}
                  />
                </div>
              </a>
              
              {/* Main app branding */}
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 lg:w-20 lg:h-20">
                  <img 
                    src="src/assets/Logo Neuri-.png" 
                    alt="Neuri Logo" 
                    className="w-full h-full object-contain"
                    //onError={(e) => {
                      // Fallback to gradient circle with N
                      //const target = e.target as HTMLImageElement;
                     // target.style.display = 'none';
                     // const fallback = document.createElement('div');
                     // fallback.className = 'w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center';
                     // fallback.innerHTML = '<span class="text-white text-2xl font-bold">N</span>';
                     // target.parentNode?.appendChild(fallback);
                   // }}
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Neuri</h1>
                  <p className="text-sm text-gray-600">Seguimiento con amor</p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onLogin}
                className="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={onGetStarted}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 font-medium transition-all duration-200 transform hover:scale-105"
              >
                Comenzar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8 opacity-0 animate-fade-in">
            <div className="text-6xl lg:text-8xl mb-6">💝</div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Cuidado y seguimiento
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                {" "}con amor
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
              Una aplicación diseñada especialmente para el seguimiento diario de la salud de los niños, 
              con un enfoque cálido y comprensivo para las familias.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in delay-300">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Comenzar Gratis
            </button>
            <button
              onClick={onLogin}
              className="px-8 py-4 bg-white text-gray-700 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg border border-gray-200"
            >
              Ya tengo cuenta
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white/50 backdrop-blur-sm py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Diseñado para familias
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Herramientas simples y efectivas para el seguimiento diario de la salud de tu hijo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 opacity-0 animate-fade-in delay-100">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Registro Diario</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Registra fácilmente el estado emocional, síntomas y observaciones importantes de cada día.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 opacity-0 animate-fade-in delay-200">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Reportes Visuales</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Genera reportes semanales y mensuales para compartir con profesionales de la salud.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 opacity-0 animate-fade-in delay-300">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Heart className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Interfaz Amigable</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Diseño cálido y accesible, pensado especialmente para niños y familias.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 opacity-0 animate-fade-in delay-400">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Privacidad Total</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Todos los datos se almacenan de forma segura y privada en tu dispositivo.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 opacity-0 animate-fade-in delay-500">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Para Toda la Familia</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Múltiples perfiles para diferentes miembros de la familia en una sola cuenta.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 opacity-0 animate-fade-in delay-600">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Fácil de Usar</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Interfaz intuitiva que cualquier miembro de la familia puede usar sin dificultad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Lo que dicen las familias
            </h2>
            <p className="text-xl text-gray-600">
              Experiencias reales de padres que usan Neuri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg opacity-0 animate-fade-in delay-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">👩</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">María González</h4>
                  <p className="text-sm text-gray-600">Madre de familia</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                "Neuri nos ha ayudado enormemente a llevar un registro detallado de la salud de nuestra hija. 
                La interfaz es muy fácil de usar y los reportes son muy útiles para las citas médicas."
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg opacity-0 animate-fade-in delay-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">👨</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Carlos Rodríguez</h4>
                  <p className="text-sm text-gray-600">Padre de familia</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                "La aplicación es perfecta para nuestras necesidades. Es simple, efectiva y nos da 
                la tranquilidad de tener toda la información organizada en un solo lugar."
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg opacity-0 animate-fade-in delay-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">👩‍⚕️</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Dra. Ana López</h4>
                  <p className="text-sm text-gray-600">Pediatra</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                "Recomiendo Neuri a todas las familias de mis pacientes. Los reportes que generan 
                son muy valiosos para el seguimiento médico y toma de decisiones."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-500 to-pink-500 py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Comienza hoy mismo
            </h2>
            <p className="text-xl text-purple-100 mb-8 leading-relaxed">
              Únete a las familias que ya confían en Neuri para el cuidado y seguimiento 
              de la salud de sus hijos.
            </p>
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-white text-purple-600 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Crear Cuenta Gratis
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10">
                <img 
                  src="/Logo Neuri.png" 
                  alt="Neuri Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback for footer logo
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center';
                    fallback.innerHTML = '<span class="text-white text-sm font-bold">N</span>';
                    target.parentNode?.appendChild(fallback);
                  }}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">Neuri</h3>
                <p className="text-sm text-gray-400">Seguimiento con amor</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © 2024 Neuri. Hecho con 💝 para las familias.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
