interface ReportData {
  user: any;
  entries: any[];
  period: string;
  startDate: string;
  endDate: string;
  stats: any;
}

class PDFService {
  async generateMedicalReport(data: ReportData): Promise<Blob> {
    // Create a comprehensive medical report as HTML
    const reportContent = this.generateReportContent(data);
    
    // Return HTML blob instead of trying to print
    return new Blob([reportContent], { type: 'text/html' });
  }

  private generateReportContent(data: ReportData): string {
    const { user, entries, period, startDate, endDate, stats } = data;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Reporte Médico - ${user.childName}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #8B5CF6;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            width: 60px;
            height: 60px;
            margin: 0 auto 10px;
            background: #8B5CF6;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 24px;
          }
          .patient-info {
            background: #F8FAFC;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }
          .stat-card {
            background: white;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
          }
          .stat-number {
            font-size: 2em;
            font-weight: bold;
            color: #8B5CF6;
          }
          .entries-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          .entries-table th,
          .entries-table td {
            border: 1px solid #E2E8F0;
            padding: 12px;
            text-align: left;
          }
          .entries-table th {
            background: #F1F5F9;
            font-weight: bold;
          }
          .seizure-yes {
            color: #DC2626;
            font-weight: bold;
          }
          .seizure-no {
            color: #059669;
          }
          .emotion-indicator {
            font-size: 1.2em;
            margin-right: 5px;
          }
          .symptoms-list {
            font-size: 0.9em;
            color: #6B7280;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #E2E8F0;
            font-size: 0.9em;
            color: #6B7280;
          }
          .print-instructions {
            background: #EFF6FF;
            border: 1px solid #BFDBFE;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
          }
          .print-button {
            background: #8B5CF6;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px 5px;
          }
          .print-button:hover {
            background: #7C3AED;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
            .print-instructions { display: none; }
          }
        </style>
        <script>
          function printReport() {
            window.print();
          }
          
          function saveAsPDF() {
            // Modern browsers support this
            if (window.chrome) {
              window.print();
            } else {
              alert('Para guardar como PDF:\\n1. Presiona Ctrl+P (Cmd+P en Mac)\\n2. Selecciona "Guardar como PDF" como destino\\n3. Haz clic en Guardar');
            }
          }
        </script>
      </head>
      <body>
        <div class="print-instructions no-print">
          <h3>📄 Instrucciones para guardar el reporte:</h3>
          <p><strong>Opción 1 - Imprimir:</strong></p>
          <button class="print-button" onclick="printReport()">🖨️ Imprimir Reporte</button>
          
          <p><strong>Opción 2 - Guardar como PDF:</strong></p>
          <button class="print-button" onclick="saveAsPDF()">📄 Guardar como PDF</button>
          
          <p><strong>Instrucciones manuales:</strong></p>
          <ol>
            <li>Presiona <strong>Ctrl+P</strong> (o <strong>Cmd+P</strong> en Mac)</li>
            <li>En el diálogo de impresión, selecciona <strong>"Guardar como PDF"</strong> como destino</li>
            <li>Haz clic en <strong>"Guardar"</strong> y elige la ubicación</li>
          </ol>
        </div>

        <div class="header">
          <div class="logo">N</div>
          <h1>Reporte Médico de Salud</h1>
          <h2>${user.childName}</h2>
          <p>Período: ${this.formatDate(startDate)} - ${this.formatDate(endDate)}</p>
          <p>Generado el: ${this.formatDate(new Date().toISOString())}</p>
        </div>

        <div class="patient-info">
          <h3>Información del Paciente</h3>
          <p><strong>Nombre:</strong> ${user.childName}</p>
          <p><strong>Edad:</strong> ${user.childAge} años</p>
          <p><strong>Responsable:</strong> ${user.name}</p>
          <p><strong>Email de contacto:</strong> ${user.email}</p>
          <p><strong>Período del reporte:</strong> ${period} (${this.formatDate(startDate)} - ${this.formatDate(endDate)})</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">${stats.totalDays}</div>
            <div>Días Registrados</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${stats.seizureDays}</div>
            <div>Días con Convulsiones</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${stats.totalDays - stats.seizureDays}</div>
            <div>Días sin Convulsiones</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${stats.seizureFrequency}%</div>
            <div>Frecuencia de Convulsiones</div>
          </div>
        </div>

        <h3>Estado Emocional Predominante</h3>
        <div class="stats-grid">
          ${Object.entries(stats.emotionStats)
            .filter(([_, data]: [string, any]) => data.count > 0)
            .sort(([_, a]: [string, any], [__, b]: [string, any]) => b.count - a.count)
            .slice(0, 3)
            .map(([emotion, data]: [string, any]) => `
              <div class="stat-card">
                <div class="emotion-indicator">${data.emoji}</div>
                <div><strong>${data.label}</strong></div>
                <div>${data.count} días</div>
              </div>
            `).join('')}
        </div>

        <h3>Síntomas Más Frecuentes</h3>
        <ul>
          ${stats.topSymptoms.map((symptom: any) => `
            <li>${symptom.label}: ${symptom.count} veces</li>
          `).join('')}
        </ul>

        <h3>Registro Detallado por Día</h3>
        <table class="entries-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Estado Emocional</th>
              <th>Convulsión</th>
              <th>Hora</th>
              <th>Síntomas</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            ${entries.map(entry => `
              <tr>
                <td>${this.formatDate(entry.date)}</td>
                <td>
                  <span class="emotion-indicator">${this.getEmotionEmoji(entry.emotion)}</span>
                  ${this.getEmotionLabel(entry.emotion)}
                </td>
                <td class="${entry.hadSeizure ? 'seizure-yes' : 'seizure-no'}">
                  ${entry.hadSeizure ? 'SÍ' : 'NO'}
                </td>
                <td>${entry.seizureTime || '-'}</td>
                <td class="symptoms-list">
                  ${entry.symptoms.length > 0 
                    ? entry.symptoms.map((s: string) => this.getSymptomLabel(s)).join(', ')
                    : 'Ninguno'
                  }
                </td>
                <td>${entry.observations || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p><strong>Nota médica:</strong> Este reporte ha sido generado automáticamente por la aplicación Neuri - Diario de Salud. 
          Los datos han sido registrados por ${user.name} como responsable del cuidado de ${user.childName}.</p>
          
          <p><strong>Recomendaciones:</strong></p>
          <ul>
            <li>Comparta este reporte con el médico tratante</li>
            <li>Mantenga un registro constante para mejores análisis</li>
            <li>Consulte con un profesional ante cualquier patrón preocupante</li>
          </ul>
          
          <p style="text-align: center; margin-top: 20px;">
            <em>Generado por Neuri - Diario de Salud | ${new Date().toLocaleDateString('es-ES')}</em>
          </p>
        </div>
      </body>
      </html>
    `;
  }

  async downloadReport(data: ReportData, filename: string) {
    try {
      const blob = await this.generateMedicalReport(data);
      
      // Create download link for HTML file
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.html`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Also open the report in a new tab for immediate viewing/printing
      const newTab = window.open();
      if (newTab) {
        const htmlContent = await blob.text();
        newTab.document.write(htmlContent);
        newTab.document.close();
      } else {
        // If popup is blocked, show instructions
        alert('Reporte descargado exitosamente como archivo HTML.\n\n' +
              'Para convertir a PDF:\n' +
              '1. Abre el archivo HTML descargado\n' +
              '2. Presiona Ctrl+P (Cmd+P en Mac)\n' +
              '3. Selecciona "Guardar como PDF"\n' +
              '4. Haz clic en Guardar');
      }
      
      return true;
    } catch (error) {
      console.error('Error generating report:', error);
      return false;
    }
  }

  private formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private getEmotionEmoji(emotion: string): string {
    const emotions: { [key: string]: string } = {
      'very-happy': '😊',
      'happy': '🙂',
      'neutral': '😐',
      'sad': '😢',
      'angry': '😠',
      'scared': '😨'
    };
    return emotions[emotion] || '😐';
  }

  private getEmotionLabel(emotion: string): string {
    const emotions: { [key: string]: string } = {
      'very-happy': 'Muy Feliz',
      'happy': 'Feliz',
      'neutral': 'Normal',
      'sad': 'Triste',
      'angry': 'Enojada',
      'scared': 'Asustada'
    };
    return emotions[emotion] || 'Normal';
  }

  private getSymptomLabel(symptom: string): string {
    const symptoms: { [key: string]: string } = {
      'headache': 'Dolor de cabeza',
      'fatigue': 'Cansancio',
      'crying': 'Llanto',
      'irritability': 'Irritabilidad',
      'confusion': 'Confusión',
      'nausea': 'Náuseas',
      'dizziness': 'Mareos',
      'sleep-issues': 'Problemas de sueño',
      'appetite-loss': 'Pérdida de apetito',
      'memory-issues': 'Problemas de memoria'
    };
    return symptoms[symptom] || symptom;
  }
}

export const pdfService = new PDFService();