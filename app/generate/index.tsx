import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Wand as Wand2, Image as ImageIcon, History, Plus } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function GenerateScreen() {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Generate</Text>
        <TouchableOpacity style={styles.historyButton}>
          <History size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.modelSelector}>
          <Text style={styles.label}>AI Model</Text>
          <TouchableOpacity style={styles.modelButton}>
            <Text style={styles.modelButtonText}>Select Model</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.previewContainer}>
          <View style={styles.preview}>
            <ImageIcon size={40} color={Colors.text.muted} />
          </View>
          
          <View style={styles.previewActions}>
            <TouchableOpacity style={styles.actionButton}>
              <ImageIcon size={20} color={Colors.text.primary} />
              <Text style={styles.actionButtonText}>Reference</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <History size={20} color={Colors.text.primary} />
              <Text style={styles.actionButtonText}>History</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.promptSection}>
          <Text style={styles.label}>Prompt</Text>
          <TextInput
            style={styles.promptInput}
            multiline
            numberOfLines={4}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Enter your prompt here..."
            placeholderTextColor={Colors.text.muted}
          />
        </View>

        <View style={styles.loraSection}>
          <Text style={styles.label}>LoRA Models</Text>
          <View style={styles.loraTags}>
            <TouchableOpacity style={styles.loraTag}>
              <Text style={styles.loraTagText}>battle-suit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loraTag}>
              <Text style={styles.loraTagText}>Zoe_price</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addLoraButton}>
              <Plus size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.generateButton}>
          <Wand2 size={24} color="#FFF" />
          <Text style={styles.generateButtonText}>Generate</Text>
          <Text style={styles.generateCost}>12 AICR</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.text.primary,
  },
  historyButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  modelSelector: {
    marginBottom: 24,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  modelButton: {
    backgroundColor: Colors.background.medium,
    padding: 16,
    borderRadius: 8,
  },
  modelButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text.secondary,
  },
  previewContainer: {
    marginBottom: 24,
  },
  preview: {
    backgroundColor: Colors.background.medium,
    height: 200,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: Colors.background.medium,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  promptSection: {
    marginBottom: 24,
  },
  promptInput: {
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    padding: 16,
    color: Colors.text.primary,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  loraSection: {
    marginBottom: 24,
  },
  loraTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  loraTag: {
    backgroundColor: Colors.background.medium,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  loraTagText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary,
  },
  addLoraButton: {
    backgroundColor: Colors.background.medium,
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  generateButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 40,
  },
  generateButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FFF',
    marginLeft: 8,
    marginRight: 8,
  },
  generateCost: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});