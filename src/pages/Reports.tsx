import React, { useState } from 'react';
import { useDiary } from '../context/DiaryContext';
import { BarChart3, Calendar, Download, TrendingUp, FileText } from 'lucide-react';
import { getWeekRange, getMonthRange, formatDisplayDate } from '../utils/dateUtils';
import { pdfService } from '../services/pdfService';
import { useAuth } from '../context/AuthContext';

const Reports: React.FC = () => {
  const { user } = useAuth();
  const { entries } = useDiary();
  const [reportType, setReportType] = useState<'week' | 'month'>('month'); // Default to month to see more data
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Get active profile information
  const getActiveProfile = () => {
    if (!user) return null;
    
    const profiles = localStorage.getItem(`neuri-profiles-${user.id}`);
    if (profiles) {
      const parsed = JSON.parse(profiles);
      const activeProfileId = localStorage.getItem('neuri-active-profile') || 'default';
      const activeProfile = parsed.find((p: any) => p.id === activeProfileId);
      
      if (activeProfile) {
        return {
          id: activeProfile.id,
          name: activeProfile.name,
          age: activeProfile.age
        };
      }
    }
    
    // Fallback to user's main child info
    return {
      id: 'default',
      name: user.childName,
      age: user.childAge
    };
  };

  const getReportData = () => {
    const date = new Date(selectedDate);
    const range = reportType === 'week' ? getWeekRange(date) : getMonthRange(date);
    
    console.log('Report range:', {
      start: range.start.toISOString().split('T')[0],
      end: range.end.toISOString().split('T')[0],
      totalEntries: entries.length,
      reportType
    });
    
    const filteredEntries = entries.filter(entry => {
      // Parse entry date properly
      const entryDate = new Date(entry.date + 'T12:00:00'); // Use noon to avoid timezone issues
      const rangeStart = new Date(range.start.getFullYear(), range.start.getMonth(), range.start.getDate());
      const rangeEnd = new Date(range.end.getFullYear(), range.end.getMonth(), range.end.getDate());
      
      const isInRange = entryDate >= rangeStart && entryDate <= rangeEnd;
      
      if (entries.length < 10) { // Debug logging for small datasets
        console.log('Entry filter check:', {
          entryDate: entry.date,
          entryDateParsed: entryDate.toISOString().split('T')[0],
          rangeStart: rangeStart.toISOString().split('T')[0],
          rangeEnd: rangeEnd.toISOString().split('T')[0],
          isInRange
        });
      }
      
      return isInRange;
    });

    console.log(`Filtered ${filteredEntries.length} entries from ${entries.length} total`);

    return {
      entries: filteredEntries,
      range,
      totalDays: filteredEntries.length,
      seizureDays: filteredEntries.filter(e => e.hadSeizure).length,
      emotionStats: getEmotionStats(filteredEntries),
      symptomStats: getSymptomStats(filteredEntries)
    };
  };

  const getEmotionStats = (entries: any[]) => {
    const emotions = {
      'very-happy': { label: 'Muy Feliz', emoji: '😊', count: 0 },
      'happy': { label: 'Feliz', emoji: '🙂', count: 0 },
      'neutral': { label: 'Normal', emoji: '😐', count: 0 },
      'sad': { label: 'Triste', emoji: '😢', count: 0 },
      'angry': { label: 'Enojada', emoji: '😠', count: 0 },
      'scared': { label: 'Asustada', emoji: '😨', count: 0 }
    };

    entries.forEach(entry => {
      if (emotions[entry.emotion as keyof typeof emotions]) {
        emotions[entry.emotion as keyof typeof emotions].count++;
      }
    });

    return emotions;
  };

  const getSymptomStats = (entries: any[]) => {
    const symptoms: { [key: string]: { label: string; count: number } } = {
      'headache': { label: 'Dolor de cabeza', count: 0 },
      'fatigue': { label: 'Cansancio', count: 0 },
      'crying': { label: 'Llanto', count: 0 },
      'irritability': { label: 'Irritabilidad', count: 0 },
      'confusion': { label: 'Confusión', count: 0 },
      'nausea': { label: 'Náuseas', count: 0 },
      'dizziness': { label: 'Mareos', count: 0 },
      'sleep-issues': { label: 'Problemas de sueño', count: 0 },
      'appetite-loss': { label: 'Pérdida de apetito', count: 0 },
      'memory-issues': { label: 'Problemas de memoria', count: 0 }
    };

    entries.forEach(entry => {
      entry.symptoms.forEach((symptom: string) => {
        if (symptoms[symptom]) {
          symptoms[symptom].count++;
        }
      });
    });

    return Object.entries(symptoms)
      .filter(([_, data]) => data.count > 0)
      .sort(([_, a], [__, b]) => b.count - a.count);
  };

  const generateReport = () => {
    const data = getReportData();
    const activeProfile = getActiveProfile();
    
    const reportContent = `
REPORTE DE SALUD - ${reportType === 'week' ? 'SEMANAL' : 'MENSUAL'}
Paciente: ${activeProfile?.name || 'N/A'}
Período: ${formatDisplayDate(data.range.start.toISOString().split('T')[0])} - ${formatDisplayDate(data.range.end.toISOString().split('T')[0])}

RESUMEN GENERAL:
- Total de días registrados: ${data.totalDays}
- Días con convulsiones: ${data.seizureDays}
- Días sin convulsiones: ${data.totalDays - data.seizureDays}
- Porcentaje de días sin convulsiones: ${data.totalDays > 0 ? Math.round(((data.totalDays - data.seizureDays) / data.totalDays) * 100) : 0}%

ESTADO EMOCIONAL:
${Object.entries(data.emotionStats)
  .filter(([_, data]) => data.count > 0)
  .map(([_, data]) => `- ${data.emoji} ${data.label}: ${data.count} días`)
  .join('\n')}

SÍNTOMAS MÁS FRECUENTES:
${data.symptomStats.map(([_, data]) => `- ${data.label}: ${data.count} veces`).join('\n')}

DETALLES POR DÍA:
${data.entries.map(entry => `
${formatDisplayDate(entry.date)}:
- Estado emocional: ${data.emotionStats[entry.emotion as keyof typeof data.emotionStats]?.label || entry.emotion}
- Convulsión: ${entry.hadSeizure ? 'Sí' + (entry.seizureTime ? ` (${entry.seizureTime})` : '') : 'No'}
- Síntomas: ${entry.symptoms.length > 0 ? entry.symptoms.map((s: string) => {
  const symptomData = getSymptomStats([{symptoms: [s]}]);
  return symptomData[0]?.[1]?.label || s;
}).join(', ') : 'Ninguno'}
- Observaciones: ${entry.observations || 'Sin observaciones'}
`).join('\n')}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-salud-${activeProfile?.name || 'paciente'}-${reportType}-${selectedDate}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateMedicalPDF = async () => {
    if (!user) return;

    const activeProfile = getActiveProfile();
    if (!activeProfile) {
      alert('No se pudo obtener la información del perfil activo');
      return;
    }

    setIsGeneratingPDF(true);
    try {
      const data = getReportData();
      
      const reportData = {
        user: {
          ...user,
          childName: activeProfile.name, // Use active profile name
          childAge: activeProfile.age    // Use active profile age
        },
        entries: data.entries,
        period: reportType === 'week' ? 'Semanal' : 'Mensual',
        startDate: data.range.start.toISOString().split('T')[0],
        endDate: data.range.end.toISOString().split('T')[0],
        stats: {
          totalDays: data.totalDays,
          seizureDays: data.seizureDays,
          seizureFrequency: data.totalDays > 0 ? Math.round((data.seizureDays / data.totalDays) * 100) : 0,
          emotionStats: data.emotionStats,
          topSymptoms: data.symptomStats.slice(0, 5).map(([_, symptom]) => symptom)
        }
      };

      const filename = `reporte-medico-${activeProfile.name}-${reportType}-${selectedDate}`;
      const success = await pdfService.downloadReport(reportData, filename);
      
      if (success) {
        alert('Reporte médico generado exitosamente');
      } else {
        alert('Error al generar el reporte médico');
      }
    } catch (error) {
      console.error('Error generating medical PDF:', error);
      alert('Error al generar el reporte médico');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const data = getReportData();
  const activeProfile = getActiveProfile();

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-3 mb-6">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-full">
            <BarChart3 className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Reportes de Salud</h1>
            <p className="text-gray-600">
              Análisis detallado para {activeProfile?.name || 'el paciente'}
            </p>
          </div>
        </div>

        {/* Report Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setReportType('week')}
              className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors text-sm lg:text-base ${
                reportType === 'week'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semanal
            </button>
            <button
              onClick={() => setReportType('month')}
              className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors text-sm lg:text-base ${
                reportType === 'month'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Mensual
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm lg:text-base"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={generateReport}
              className="flex items-center justify-center space-x-2 bg-green-500 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm lg:text-base"
            >
              <Download className="h-4 w-4 lg:h-5 lg:w-5" />
              <span>Descargar TXT</span>
            </button>

            <button
              onClick={generateMedicalPDF}
              disabled={isGeneratingPDF}
              className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="h-4 w-4 lg:h-5 lg:w-5" />
              <span>{isGeneratingPDF ? 'Generando...' : 'Reporte Médico'}</span>
            </button>
          </div>
        </div>

        <div className="text-xs lg:text-sm text-gray-600 mb-2">
          Período: {formatDisplayDate(data.range.start.toISOString().split('T')[0])} - {formatDisplayDate(data.range.end.toISOString().split('T')[0])}
        </div>
        
        {/* Debug info */}
        <div className="text-xs text-blue-600 mb-4">
          📊 Total de entradas en la base de datos: {entries.length} | Filtradas para este período: {data.totalDays}
          {activeProfile && (
            <span className="ml-4">
              👤 Perfil activo: {activeProfile.name} ({activeProfile.age} años)
            </span>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 text-center">
          <div className="bg-blue-100 w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
            <Calendar className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
          </div>
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800">{data.totalDays}</h3>
          <p className="text-xs lg:text-base text-gray-600">Días registrados</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 text-center">
          <div className="bg-red-100 w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
            <span className="text-xl lg:text-2xl">⚡</span>
          </div>
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800">{data.seizureDays}</h3>
          <p className="text-xs lg:text-base text-gray-600">Días con convulsiones</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 text-center">
          <div className="bg-green-100 w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
            <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
          </div>
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800">{data.totalDays - data.seizureDays}</h3>
          <p className="text-xs lg:text-base text-gray-600">Días sin convulsiones</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 text-center">
          <div className="bg-purple-100 w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
            <span className="text-xl lg:text-2xl">📊</span>
          </div>
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
            {data.totalDays > 0 ? Math.round(((data.totalDays - data.seizureDays) / data.totalDays) * 100) : 0}%
          </h3>
          <p className="text-xs lg:text-base text-gray-600">Días sin convulsiones</p>
        </div>
      </div>

      {/* Emotion and Symptom Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6">
          <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-4 lg:mb-6">Estado Emocional</h3>
          <div className="space-y-3 lg:space-y-4">
            {Object.entries(data.emotionStats)
              .filter(([_, data]) => data.count > 0)
              .sort(([_, a], [__, b]) => b.count - a.count)
              .map(([emotion, emotionData]) => (
                <div key={emotion} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 lg:space-x-3">
                    <span className="text-xl lg:text-2xl">{emotionData.emoji}</span>
                    <span className="font-medium text-sm lg:text-base">{emotionData.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-gray-200 rounded-full h-2 w-16 lg:w-24">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${data.totalDays > 0 ? (emotionData.count / data.totalDays) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-xs lg:text-sm font-medium text-gray-600">{emotionData.count}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Symptom Analysis */}
        <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6">
          <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-4 lg:mb-6">Síntomas Más Frecuentes</h3>
          <div className="space-y-3 lg:space-y-4">
            {data.symptomStats.slice(0, 8).map(([symptom, symptomData]) => (
              <div key={symptom} className="flex items-center justify-between">
                <span className="font-medium text-sm lg:text-base">{symptomData.label}</span>
                <div className="flex items-center space-x-2">
                  <div className="bg-gray-200 rounded-full h-2 w-16 lg:w-24">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${data.totalDays > 0 ? Math.min((symptomData.count / data.totalDays) * 100, 100) : 0}%` }}
                    />
                  </div>
                  <span className="text-xs lg:text-sm font-medium text-gray-600">{symptomData.count}</span>
                </div>
              </div>
            ))}
            {data.symptomStats.length === 0 && (
              <p className="text-gray-500 text-center py-4 text-sm lg:text-base">No se registraron síntomas en este período</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Entries in Period */}
      {data.entries.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6">
          <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-4 lg:mb-6">
            Registros del Período ({data.entries.length} entradas)
          </h3>
          <div className="space-y-3 lg:space-y-4">
            {data.entries.slice(0, 10).map((entry) => (
              <div key={entry.id} className="border border-gray-200 rounded-xl p-3 lg:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    <div className="text-xl lg:text-2xl">
                      {data.emotionStats[entry.emotion as keyof typeof data.emotionStats]?.emoji || '😐'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm lg:text-base">{formatDisplayDate(entry.date)}</p>
                      <p className="text-xs lg:text-sm text-gray-600">
                        {entry.hadSeizure ? '⚡ Convulsión registrada' : '✅ Sin convulsiones'}
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    {entry.symptoms.length > 0 && (
                      <p className="text-xs lg:text-sm text-gray-600">{entry.symptoms.length} síntomas</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {data.entries.length > 10 && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">
                  Mostrando 10 de {data.entries.length} registros del período
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {data.entries.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 text-center">
          <div className="text-4xl lg:text-6xl mb-4">📊</div>
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">No hay datos para este período</h3>
          <p className="text-gray-600 text-sm lg:text-base">
            No se encontraron registros para el período seleccionado. Intenta con otra fecha o cambia a vista mensual.
          </p>
          <div className="mt-4 text-sm text-blue-600">
            💡 Tip: Cambia a vista "Mensual" para ver más datos, o selecciona una fecha más reciente.
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;