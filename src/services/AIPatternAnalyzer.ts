import { DailyEntry } from '../types';

export interface PatternAnalysis {
  seizurePatterns: {
    frequency: number;
    timePatterns: string[];
    triggerSymptoms: string[];
  };
  emotionalPatterns: {
    mostCommon: string;
    trends: string[];
  };
  symptomPatterns: {
    mostFrequent: string[];
    correlations: string[];
  };
  insights: string[];
  recommendations: string[];
}

export class AIPatternAnalyzer {
  analyzePatterns(entries: DailyEntry[]): PatternAnalysis {
    if (entries.length < 3) {
      return this.getMinimalAnalysis();
    }

    const seizurePatterns = this.analyzeSeizurePatterns(entries);
    const emotionalPatterns = this.analyzeEmotionalPatterns(entries);
    const symptomPatterns = this.analyzeSymptomPatterns(entries);
    const insights = this.generateInsights(entries, seizurePatterns, emotionalPatterns, symptomPatterns);
    const recommendations = this.generateRecommendations(insights);

    return {
      seizurePatterns,
      emotionalPatterns,
      symptomPatterns,
      insights,
      recommendations
    };
  }

  private analyzeSeizurePatterns(entries: DailyEntry[]) {
    const seizureEntries = entries.filter(entry => entry.hadSeizure);
    const totalDays = entries.length;
    const frequency = seizureEntries.length / totalDays;

    // Analyze time patterns
    const timePatterns: string[] = [];
    const seizureTimes = seizureEntries
      .filter(entry => entry.seizureTime)
      .map(entry => entry.seizureTime!);

    if (seizureTimes.length > 1) {
      const morningCount = seizureTimes.filter(time => {
        const hour = parseInt(time.split(':')[0]);
        return hour >= 6 && hour < 12;
      }).length;

      const afternoonCount = seizureTimes.filter(time => {
        const hour = parseInt(time.split(':')[0]);
        return hour >= 12 && hour < 18;
      }).length;

      const eveningCount = seizureTimes.filter(time => {
        const hour = parseInt(time.split(':')[0]);
        return hour >= 18 || hour < 6;
      }).length;

      if (morningCount > afternoonCount && morningCount > eveningCount) {
        timePatterns.push('Las convulsiones tienden a ocurrir más en la mañana');
      } else if (afternoonCount > morningCount && afternoonCount > eveningCount) {
        timePatterns.push('Las convulsiones tienden a ocurrir más en la tarde');
      } else if (eveningCount > morningCount && eveningCount > afternoonCount) {
        timePatterns.push('Las convulsiones tienden a ocurrir más en la noche');
      }
    }

    // Analyze trigger symptoms
    const triggerSymptoms: string[] = [];
    const symptomCounts: { [key: string]: number } = {};

    seizureEntries.forEach(entry => {
      entry.symptoms.forEach(symptom => {
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
      });
    });

    const sortedSymptoms = Object.entries(symptomCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    sortedSymptoms.forEach(([symptom, count]) => {
      if (count >= seizureEntries.length * 0.5) {
        triggerSymptoms.push(this.getSymptomLabel(symptom));
      }
    });

    return {
      frequency,
      timePatterns,
      triggerSymptoms
    };
  }

  private analyzeEmotionalPatterns(entries: DailyEntry[]) {
    const emotionCounts: { [key: string]: number } = {};
    
    entries.forEach(entry => {
      emotionCounts[entry.emotion] = (emotionCounts[entry.emotion] || 0) + 1;
    });

    const sortedEmotions = Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a);

    const mostCommon = this.getEmotionLabel(sortedEmotions[0][0]);
    
    const trends: string[] = [];
    
    // Analyze recent trend (last 7 entries)
    const recentEntries = entries.slice(-7);
    const recentPositive = recentEntries.filter(entry => 
      ['very-happy', 'happy'].includes(entry.emotion)
    ).length;
    
    const recentNegative = recentEntries.filter(entry => 
      ['sad', 'angry', 'scared'].includes(entry.emotion)
    ).length;

    if (recentPositive > recentNegative) {
      trends.push('Tendencia emocional positiva en los últimos días');
    } else if (recentNegative > recentPositive) {
      trends.push('Se observan más emociones difíciles últimamente');
    }

    return {
      mostCommon,
      trends
    };
  }

  private analyzeSymptomPatterns(entries: DailyEntry[]) {
    const symptomCounts: { [key: string]: number } = {};
    
    entries.forEach(entry => {
      entry.symptoms.forEach(symptom => {
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
      });
    });

    const sortedSymptoms = Object.entries(symptomCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    const mostFrequent = sortedSymptoms.map(([symptom]) => this.getSymptomLabel(symptom));

    const correlations: string[] = [];
    
    // Analyze symptom-emotion correlations
    const sadEntries = entries.filter(entry => entry.emotion === 'sad');
    if (sadEntries.length > 2) {
      const sadSymptoms: { [key: string]: number } = {};
      sadEntries.forEach(entry => {
        entry.symptoms.forEach(symptom => {
          sadSymptoms[symptom] = (sadSymptoms[symptom] || 0) + 1;
        });
      });
      
      const commonSadSymptom = Object.entries(sadSymptoms)
        .sort(([,a], [,b]) => b - a)[0];
      
      if (commonSadSymptom && commonSadSymptom[1] >= sadEntries.length * 0.6) {
        correlations.push(`${this.getSymptomLabel(commonSadSymptom[0])} aparece frecuentemente cuando se siente triste`);
      }
    }

    return {
      mostFrequent,
      correlations
    };
  }

  private generateInsights(
    entries: DailyEntry[], 
    seizurePatterns: any, 
    emotionalPatterns: any, 
    symptomPatterns: any
  ): string[] {
    const insights: string[] = [];

    // Seizure insights
    if (seizurePatterns.frequency > 0) {
      if (seizurePatterns.frequency < 0.2) {
        insights.push('¡Excelente! Las convulsiones son poco frecuentes');
      } else if (seizurePatterns.frequency > 0.5) {
        insights.push('Se observa una frecuencia alta de convulsiones, es importante consultar con el médico');
      }

      if (seizurePatterns.timePatterns.length > 0) {
        insights.push(seizurePatterns.timePatterns[0]);
      }

      if (seizurePatterns.triggerSymptoms.length > 0) {
        insights.push(`Los síntomas ${seizurePatterns.triggerSymptoms.join(', ')} aparecen frecuentemente antes de las convulsiones`);
      }
    }

    // Emotional insights
    if (emotionalPatterns.trends.length > 0) {
      insights.push(emotionalPatterns.trends[0]);
    }

    // Symptom insights
    if (symptomPatterns.mostFrequent.length > 0) {
      insights.push(`Los síntomas más comunes son: ${symptomPatterns.mostFrequent.slice(0, 2).join(' y ')}`);
    }

    if (symptomPatterns.correlations.length > 0) {
      insights.push(symptomPatterns.correlations[0]);
    }

    // Weekly patterns
    const weeklyPattern = this.analyzeWeeklyPatterns(entries);
    if (weeklyPattern) {
      insights.push(weeklyPattern);
    }

    return insights.slice(0, 5); // Limit to 5 insights
  }

  private analyzeWeeklyPatterns(entries: DailyEntry[]): string | null {
    if (entries.length < 14) return null;

    const dayOfWeekCounts: { [key: number]: { seizures: number, total: number } } = {};
    
    entries.forEach(entry => {
      const date = new Date(entry.date);
      const dayOfWeek = date.getDay();
      
      if (!dayOfWeekCounts[dayOfWeek]) {
        dayOfWeekCounts[dayOfWeek] = { seizures: 0, total: 0 };
      }
      
      dayOfWeekCounts[dayOfWeek].total++;
      if (entry.hadSeizure) {
        dayOfWeekCounts[dayOfWeek].seizures++;
      }
    });

    const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    let highestRiskDay = -1;
    let highestRisk = 0;

    Object.entries(dayOfWeekCounts).forEach(([day, data]) => {
      const risk = data.total > 2 ? data.seizures / data.total : 0;
      if (risk > highestRisk && risk > 0.3) {
        highestRisk = risk;
        highestRiskDay = parseInt(day);
      }
    });

    if (highestRiskDay >= 0) {
      return `Los ${dayNames[highestRiskDay]}s parecen ser días de mayor riesgo`;
    }

    return null;
  }

  private generateRecommendations(insights: string[]): string[] {
    const recommendations: string[] = [];

    insights.forEach(insight => {
      if (insight.includes('mañana')) {
        recommendations.push('Considera mantener una rutina matutina más relajada');
      }
      if (insight.includes('frecuencia alta')) {
        recommendations.push('Es recomendable programar una cita médica pronto');
      }
      if (insight.includes('dolor de cabeza')) {
        recommendations.push('Monitorea los factores que podrían causar dolor de cabeza');
      }
      if (insight.includes('cansancio')) {
        recommendations.push('Asegúrate de que tenga suficiente descanso');
      }
    });

    return recommendations.slice(0, 3);
  }

  private getMinimalAnalysis(): PatternAnalysis {
    return {
      seizurePatterns: {
        frequency: 0,
        timePatterns: [],
        triggerSymptoms: []
      },
      emotionalPatterns: {
        mostCommon: 'Normal',
        trends: []
      },
      symptomPatterns: {
        mostFrequent: [],
        correlations: []
      },
      insights: ['Continúa registrando para que pueda encontrar patrones útiles'],
      recommendations: ['Mantén un registro constante para obtener mejores análisis']
    };
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
      'headache': 'dolor de cabeza',
      'fatigue': 'cansancio',
      'crying': 'llanto',
      'irritability': 'irritabilidad',
      'confusion': 'confusión',
      'nausea': 'náuseas',
      'dizziness': 'mareos',
      'sleep-issues': 'problemas de sueño',
      'appetite-loss': 'pérdida de apetito',
      'memory-issues': 'problemas de memoria'
    };
    return symptoms[symptom] || symptom;
  }
}