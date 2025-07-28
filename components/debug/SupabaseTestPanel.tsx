import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Play, CheckCircle, XCircle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { SupabaseTestSuite, SupabaseTestResult } from '@/utils/supabase-test';

export default function SupabaseTestPanel() {
  const theme = useTheme();
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<SupabaseTestResult[]>([]);

  const runTests = async () => {
    setTesting(true);
    setResults([]);

    try {
      const testResults = await SupabaseTestSuite.runAllTests();
      setResults(testResults);

      const passCount = testResults.filter(r => r.success).length;
      const totalCount = testResults.length;

      if (passCount === totalCount) {
        Alert.alert(
          'Tests Complete',
          '🎉 All tests passed! Supabase is properly configured.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Tests Complete',
          `⚠️ ${passCount}/${totalCount} tests passed. Check the results for details.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Test Error',
        `Failed to run tests: ${error instanceof Error ? error.message : 'Unknown error'}`,
        [{ text: 'OK' }]
      );
    } finally {
      setTesting(false);
    }
  };

  const renderTestResult = (result: SupabaseTestResult, index: number) => {
    const IconComponent = result.success ? CheckCircle : XCircle;
    const iconColor = result.success ? theme.colors.success : theme.colors.error;

    return (
      <View
        key={index}
        style={[
          styles.testResult,
          {
            backgroundColor: theme.colors.surface,
            borderLeftColor: iconColor,
          },
        ]}
      >
        <View style={styles.testHeader}>
          <IconComponent size={20} color={iconColor} />
          <Text style={[styles.testName, { color: theme.colors.textPrimary }]}>
            {result.test}
          </Text>
        </View>

        {result.success && result.details && (
          <Text style={[styles.testDetails, { color: theme.colors.textSecondary }]}>
            {result.details}
          </Text>
        )}

        {!result.success && result.error && (
          <Text style={[styles.testError, { color: theme.colors.error }]}>
            Error: {result.error}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          Supabase Configuration Test
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Verify that Supabase is properly configured for media uploads
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.runButton,
          {
            backgroundColor: theme.colors.primary,
            opacity: testing ? 0.6 : 1,
          },
        ]}
        onPress={runTests}
        disabled={testing}
      >
        <Play size={20} color="#FFFFFF" />
        <Text style={styles.runButtonText}>
          {testing ? 'Running Tests...' : 'Run Tests'}
        </Text>
      </TouchableOpacity>

      {results.length > 0 && (
        <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
          <Text style={[styles.resultsTitle, { color: theme.colors.textPrimary }]}>
            Test Results
          </Text>
          {results.map(renderTestResult)}

          <View style={[styles.summary, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.summaryText, { color: theme.colors.textPrimary }]}>
              Summary: {results.filter(r => r.success).length}/{results.length} tests passed
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  runButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 8,
  },
  runButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  testResult: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  testName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    flex: 1,
  },
  testDetails: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  testError: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  summary: {
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});
