import { getGeminiModel } from '../../../core/config/gemini.config';
import { AIQuery, AIResponse } from '../../../shared/types';

/**
 * Service for handling AI assistant operations with Gemini
 */
export const geminiService = {
  /**
   * Process user query with context and return AI response
   * @param query - User query with financial context
   * @returns AI response with suggestions
   */
  async processQuery(query: AIQuery): Promise<AIResponse> {
    try {
      const context = this.buildContext(query.context);
      const prompt = this.buildPrompt(query.query, context);
      
      const model = await getGeminiModel();
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        response: text,
        suggestions: this.extractSuggestions(text),
      };
    } catch (error) {
      throw new Error('Error al procesar consulta con IA');
    }
  },

  /**
   * Build context string from user's financial data
   * @param context - User's financial context
   * @returns Formatted context string
   */
  buildContext(context: AIQuery['context']): string {
    const { spendingWallet, savingsWallet, recentTransactions } = context;
    const total = spendingWallet + savingsWallet;

    let contextString = `Contexto financiero del usuario:
- Cartera de Gastos: $${spendingWallet.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
- Cartera de Ahorros: $${savingsWallet.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
- Saldo Total: $${total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}

Transacciones recientes:`;

    if (recentTransactions.length > 0) {
      recentTransactions.slice(0, 5).forEach((transaction, index) => {
        const type = transaction.type === 'income' ? 'Ingreso' : 
                    transaction.type === 'expense' ? 'Gasto' : 'Transferencia';
        const amount = `$${transaction.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`;
        const date = transaction.createdAt.toLocaleDateString('es-ES');
        
        contextString += `\n${index + 1}. ${type}: ${amount} - ${transaction.description} (${date})`;
      });
    } else {
      contextString += '\nNo hay transacciones recientes.';
    }

    return contextString;
  },

  /**
   * Build prompt for Gemini AI
   * @param query - User's question
   * @param context - Financial context
   * @returns Formatted prompt
   */
  buildPrompt(query: string, context: string): string {
    return `Eres un asistente financiero inteligente para la aplicación "Balance Dual". 
Tu función es ayudar a los usuarios a entender y gestionar sus finanzas personales.

${context}

Pregunta del usuario: "${query}"

Instrucciones:
1. Responde en español de manera clara y amigable
2. Usa los datos financieros proporcionados para dar respuestas precisas
3. Proporciona consejos prácticos y útiles
4. Si la pregunta es sobre gastos, ahorros o transferencias, usa los datos reales del usuario
5. Mantén un tono profesional pero accesible
6. Si no tienes suficiente información, pide aclaraciones

Responde:`;
  },

  /**
   * Extract suggestions from AI response
   * @param response - AI response text
   * @returns Array of suggestions
   */
  extractSuggestions(response: string): string[] {
    const suggestions: string[] = [];
    
    // Look for common financial advice patterns
    const patterns = [
      /(?:sugerencia|recomendación|consejo):\s*([^.!?]+)/gi,
      /(?:deberías|podrías|te recomiendo)\s+([^.!?]+)/gi,
      /(?:considera|piensa en)\s+([^.!?]+)/gi,
    ];

    patterns.forEach(pattern => {
      const matches = response.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const suggestion = match.replace(/^(?:sugerencia|recomendación|consejo):\s*/i, '')
                                 .replace(/^(?:deberías|podrías|te recomiendo)\s+/i, '')
                                 .replace(/^(?:considera|piensa en)\s+/i, '')
                                 .trim();
          if (suggestion && suggestion.length > 10) {
            suggestions.push(suggestion);
          }
        });
      }
    });

    return suggestions.slice(0, 3); // Limit to 3 suggestions
  },

  /**
   * Get quick financial insights based on user data
   * @param context - User's financial context
   * @returns Quick insights
   */
  async getQuickInsights(context: AIQuery['context']): Promise<string[]> {
    try {
      const insights: string[] = [];
      const { spendingWallet, savingsWallet, recentTransactions } = context;
      const total = spendingWallet + savingsWallet;

      // Spending analysis
      const expenses = recentTransactions.filter(t => t.type === 'expense');
      const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
      
      if (expenses.length > 0) {
        const avgExpense = totalExpenses / expenses.length;
        insights.push(`Gasto promedio: $${avgExpense.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`);
      }

      // Savings analysis
      const savingsRate = total > 0 ? (savingsWallet / total) * 100 : 0;
      if (savingsRate > 20) {
        insights.push('¡Excelente tasa de ahorro! Mantén este ritmo.');
      } else if (savingsRate > 10) {
        insights.push('Buena tasa de ahorro. Considera aumentarla gradualmente.');
      } else {
        insights.push('Considera aumentar tu tasa de ahorro para mayor estabilidad financiera.');
      }

      // Recent activity
      const recentCount = recentTransactions.filter(t => {
        const daysDiff = (Date.now() - t.createdAt.getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff <= 7;
      }).length;

      if (recentCount > 5) {
        insights.push('Actividad financiera alta esta semana. Revisa tus gastos.');
      } else if (recentCount === 0) {
        insights.push('No hay actividad reciente. Considera registrar tus movimientos.');
      }

      return insights;
    } catch (error) {
      return ['No se pudieron generar insights en este momento.'];
    }
  },
};


