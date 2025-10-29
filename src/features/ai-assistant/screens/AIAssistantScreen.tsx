import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWallet } from '../../../core/context/WalletContext';
import { COLORS, SPACING, FONT_SIZES } from '../../../shared/constants';
import Constants from 'expo-constants';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AIAssistantScreen: React.FC = () => {
  const { wallet, transactions } = useWallet();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getGeminiApiKey = () => {
    const extra = (Constants.expoConfig?.extra || Constants.manifest?.extra || {}) as any;
    return extra.GEMINI_API_KEY;
  };

  const callGeminiAPI = async (userQuery: string): Promise<string> => {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      throw new Error('API key de Gemini no configurada');
    }

    const context = buildFinancialContext();
    const prompt = buildPrompt(userQuery, context);

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Error de API: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo obtener respuesta de Gemini';
  };

  const buildFinancialContext = (): string => {
    const total = wallet.spending + wallet.savings;
    const expenses = transactions.filter(t => t.type === 'expense');
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = total > 0 ? (wallet.savings / total) * 100 : 0;

    let context = `Contexto financiero del usuario:
- Cartera de Gastos: $${wallet.spending.toLocaleString('en-US', { minimumFractionDigits: 2 })}
- Cartera de Ahorros: $${wallet.savings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
- Saldo Total: $${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
- Tasa de Ahorro: ${savingsRate.toFixed(1)}%
- Total Gastado: $${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
- Número de Gastos: ${expenses.length}

Transacciones recientes:`;

    if (transactions.length > 0) {
      transactions.slice(0, 5).forEach((transaction, index) => {
        const type = transaction.type === 'income' ? 'Ingreso' : 
                    transaction.type === 'expense' ? 'Gasto' : 'Transferencia';
        const amount = `$${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        const date = transaction.createdAt.toLocaleDateString('es-ES');
        
        context += `\n${index + 1}. ${type}: ${amount} - ${transaction.description} (${date})`;
      });
    } else {
      context += '\nNo hay transacciones recientes.';
    }

    return context;
  };

  const buildPrompt = (userQuery: string, context: string): string => {
    return `Eres un asistente financiero inteligente para la aplicación "Balance Dual". 
Tu función es ayudar a los usuarios a entender y gestionar sus finanzas personales.

${context}

Pregunta del usuario: "${userQuery}"

Instrucciones:
1. Responde en español de manera clara y amigable
2. Usa los datos financieros proporcionados para dar respuestas precisas
3. Proporciona consejos prácticos y útiles
4. Si la pregunta es sobre gastos, ahorros o transferencias, usa los datos reales del usuario
5. Mantén un tono profesional pero accesible
6. Si no tienes suficiente información, pide aclaraciones
7. Limita tu respuesta a máximo 200 palabras para mantenerla concisa

Responde:`;
  };

  useEffect(() => {
    // Mensaje de bienvenida inicial
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'assistant',
      content: '¡Hola! Soy tu asistente financiero. Puedo ayudarte con información sobre tus saldos, gastos y transacciones. ¿En qué te puedo ayudar?',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendQuery = async () => {
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: query.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const userQuery = query.trim();
    setQuery('');
    setIsLoading(true);

    try {
      const response = await callGeminiAPI(userQuery);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Lo siento, no pude procesar tu consulta en este momento. Por favor, verifica tu conexión a internet e intenta de nuevo.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setQuery(question);
  };

  const renderMessage = (message: ChatMessage) => (
    <View key={message.id} style={[styles.messageContainer, message.type === 'user' && styles.userMessage]}>
      <View style={[styles.messageBubble, message.type === 'user' ? styles.userBubble : styles.assistantBubble]}>
        <Text style={[styles.messageText, message.type === 'user' ? styles.userText : styles.assistantText]}>
          {message.content}
        </Text>
        <Text style={styles.messageTime}>
          {message.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Asistente IA</Text>
        <Text style={styles.subtitle}>Tu consultor financiero personal</Text>
      </View>

      <ScrollView style={styles.messagesContainer}>
        {messages.map(renderMessage)}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Pensando...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Pregunta a tu asistente financiero..."
            placeholderTextColor={COLORS.gray}
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!query.trim() || isLoading) && styles.sendButtonDisabled]}
            onPress={handleSendQuery}
            disabled={!query.trim() || isLoading}
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.quickQuestions}>
          <Text style={styles.quickQuestionsTitle}>Preguntas Rápidas:</Text>
        <View style={styles.quickQuestionsGrid}>
          {[
            '¿Cuál es mi situación financiera actual?',
            '¿Cómo puedo mejorar mis ahorros?',
            '¿Qué gastos debo reducir?',
            'Dame consejos financieros personalizados',
          ].map((question, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickQuestionButton}
                onPress={() => handleQuickQuestion(question)}
              >
                <Text style={styles.quickQuestionText}>{question}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    padding: SPACING.lg,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
  },
  messagesContainer: {
    flex: 1,
    padding: SPACING.lg,
  },
  messageContainer: {
    marginBottom: SPACING.md,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: SPACING.md,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
  },
  assistantBubble: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.light,
  },
  messageText: {
    fontSize: FONT_SIZES.md,
    lineHeight: 20,
  },
  userText: {
    color: COLORS.white,
  },
  assistantText: {
    color: COLORS.dark,
  },
  messageTime: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray,
    marginTop: SPACING.xs,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: SPACING.md,
  },
  loadingText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
    fontStyle: 'italic',
  },
  inputContainer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: SPACING.md,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.light,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.dark,
    maxHeight: 100,
    marginRight: SPACING.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.gray,
    opacity: 0.5,
  },
  sendButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
  quickQuestions: {
    marginTop: SPACING.sm,
  },
  quickQuestionsTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SPACING.sm,
  },
  quickQuestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  quickQuestionButton: {
    backgroundColor: COLORS.light,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.light,
  },
  quickQuestionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.dark,
  },
});