import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from './Button';
import { COLORS, SPACING, FONT_SIZES } from '../constants';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <Text style={styles.title}>¡Oops! Algo salió mal</Text>
          <Text style={styles.message}>
            Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
          </Text>
          {__DEV__ && this.state.error && (
            <Text style={styles.errorDetails}>
              {this.state.error.message}
            </Text>
          )}
          <Button
            title="Reintentar"
            onPress={this.handleRetry}
            style={styles.button}
          />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  message: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
    marginBottom: SPACING.lg,
    textAlign: 'center',
    lineHeight: 24,
  },
  errorDetails: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.error,
    marginBottom: SPACING.lg,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  button: {
    minWidth: 120,
  },
});


