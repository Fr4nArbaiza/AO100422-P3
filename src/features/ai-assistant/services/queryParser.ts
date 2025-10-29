import { AIResponse } from '../../../shared/types';

/**
 * Service for parsing and formatting AI responses
 */
export const queryParser = {
  /**
   * Parse AI response and extract structured data
   * @param response - Raw AI response
   * @returns Parsed response with suggestions
   */
  parseResponse(response: string): AIResponse {
    const suggestions = this.extractSuggestions(response);
    const cleanedResponse = this.cleanResponse(response);

    return {
      response: cleanedResponse,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
    };
  },

  /**
   * Extract suggestions from AI response
   * @param response - AI response text
   * @returns Array of suggestions
   */
  extractSuggestions(response: string): string[] {
    const suggestions: string[] = [];
    
    // Look for bullet points or numbered lists
    const bulletPattern = /[•\-\*]\s*([^.\n]+)/g;
    const numberedPattern = /^\d+\.\s*([^.\n]+)/gm;
    
    // Extract bullet points
    let match;
    while ((match = bulletPattern.exec(response)) !== null) {
      const suggestion = match[1].trim();
      if (suggestion.length > 10 && suggestion.length < 100) {
        suggestions.push(suggestion);
      }
    }
    
    // Extract numbered items
    while ((match = numberedPattern.exec(response)) !== null) {
      const suggestion = match[1].trim();
      if (suggestion.length > 10 && suggestion.length < 100) {
        suggestions.push(suggestion);
      }
    }
    
    // Look for common suggestion patterns
    const suggestionPatterns = [
      /(?:sugerencia|recomendación|consejo):\s*([^.!?]+)/gi,
      /(?:deberías|podrías|te recomiendo)\s+([^.!?]+)/gi,
      /(?:considera|piensa en)\s+([^.!?]+)/gi,
      /(?:intenta|prueba)\s+([^.!?]+)/gi,
    ];

    suggestionPatterns.forEach(pattern => {
      const matches = response.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const suggestion = match
            .replace(/^(?:sugerencia|recomendación|consejo):\s*/i, '')
            .replace(/^(?:deberías|podrías|te recomiendo)\s+/i, '')
            .replace(/^(?:considera|piensa en)\s+/i, '')
            .replace(/^(?:intenta|prueba)\s+/i, '')
            .trim();
          
          if (suggestion && suggestion.length > 10 && suggestion.length < 100) {
            suggestions.push(suggestion);
          }
        });
      }
    });

    return [...new Set(suggestions)].slice(0, 3); // Remove duplicates and limit to 3
  },

  /**
   * Clean response text by removing extra formatting
   * @param response - Raw response text
   * @returns Cleaned response text
   */
  cleanResponse(response: string): string {
    return response
      .replace(/\n\s*\n/g, '\n') // Remove multiple newlines
      .replace(/^\s+|\s+$/g, '') // Trim whitespace
      .replace(/\s+/g, ' '); // Replace multiple spaces with single space
  },

  /**
   * Extract financial data from response
   * @param response - AI response text
   * @returns Object with extracted financial data
   */
  extractFinancialData(response: string): {
    amounts: number[];
    percentages: number[];
    dates: string[];
  } {
    const amounts: number[] = [];
    const percentages: number[] = [];
    const dates: string[] = [];

    // Extract amounts (currency format)
    const amountPattern = /\$[\d,]+\.?\d*/g;
    const amountMatches = response.match(amountPattern);
    if (amountMatches) {
      amountMatches.forEach(match => {
        const amount = parseFloat(match.replace(/[$,]/g, ''));
        if (!isNaN(amount)) {
          amounts.push(amount);
        }
      });
    }

    // Extract percentages
    const percentagePattern = /\d+(\.\d+)?%/g;
    const percentageMatches = response.match(percentagePattern);
    if (percentageMatches) {
      percentageMatches.forEach(match => {
        const percentage = parseFloat(match.replace('%', ''));
        if (!isNaN(percentage)) {
          percentages.push(percentage);
        }
      });
    }

    // Extract dates (basic patterns)
    const datePattern = /\b\d{1,2}\/\d{1,2}\/\d{4}\b|\b\d{4}-\d{2}-\d{2}\b/g;
    const dateMatches = response.match(datePattern);
    if (dateMatches) {
      dates.push(...dateMatches);
    }

    return { amounts, percentages, dates };
  },

  /**
   * Check if response contains actionable advice
   * @param response - AI response text
   * @returns True if response contains actionable advice
   */
  hasActionableAdvice(response: string): boolean {
    const actionWords = [
      'deberías', 'podrías', 'recomiendo', 'sugiero', 'considera',
      'intenta', 'prueba', 'evita', 'reduce', 'aumenta', 'mejora'
    ];
    
    const lowerResponse = response.toLowerCase();
    return actionWords.some(word => lowerResponse.includes(word));
  },

  /**
   * Format response for better readability
   * @param response - Raw response text
   * @returns Formatted response text
   */
  formatResponse(response: string): string {
    // Add line breaks before bullet points
    let formatted = response.replace(/([•\-\*])\s*/g, '\n$1 ');
    
    // Add line breaks before numbered lists
    formatted = formatted.replace(/(\d+\.)\s*/g, '\n$1 ');
    
    // Clean up extra whitespace
    formatted = formatted.replace(/\n\s*\n/g, '\n\n');
    
    return formatted.trim();
  },
};


