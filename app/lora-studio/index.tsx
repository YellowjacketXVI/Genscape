import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Plus, Database, Upload, Tag } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function LoraStudioScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LoRA Studio</Text>
        <TouchableOpacity style={styles.createButton}>
          <Plus size={20} color="#FFF" />
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your LoRA Models</Text>
          
          <View style={styles.loraGrid}>
            <LoraCard
              name="Battle Suit"
              images={24}
              status="Training"
              progress={65}
            />
            <LoraCard
              name="Character Style"
              images={48}
              status="Complete"
              progress={100}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Training Datasets</Text>
          
          <View style={styles.datasetGrid}>
            <DatasetCard
              name="Battle Suits"
              images={24}
              captions={24}
            />
            <DatasetCard
              name="Character References"
              images={48}
              captions={48}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.importButton}>
          <Upload size={20} color={Colors.primary} />
          <Text style={styles.importButtonText}>Import Dataset</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function LoraCard({ name, images, status, progress }: { name: string, images: number, status: string, progress: number }) {
  return (
    <View style={styles.loraCard}>
      <View style={styles.loraIcon}>
        <Database size={24} color={Colors.text.primary} />
      </View>
      <Text style={styles.loraName}>{name}</Text>
      <Text style={styles.loraStats}>{images} training images</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.loraStatus}>{status}</Text>
    </View>
  );
}

function DatasetCard({ name, images, captions }: { name: string, images: number, captions: number }) {
  return (
    <View style={styles.datasetCard}>
      <View style={styles.datasetIcon}>
        <Tag size={24} color={Colors.text.primary} />
      </View>
      <Text style={styles.datasetName}>{name}</Text>
      <Text style={styles.datasetStats}>
        {images} images • {captions} captions
      </Text>
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  createButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFF',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  loraGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  loraCard: {
    backgroundColor: Colors.background.medium,
    borderRadius: 12,
    padding: 16,
    width: '50%',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  loraIcon: {
    backgroundColor: Colors.background.light,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  loraName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  loraStats: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.muted,
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.background.light,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  loraStatus: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  datasetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  datasetCard: {
    backgroundColor: Colors.background.medium,
    borderRadius: 12,
    padding: 16,
    width: '50%',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  datasetIcon: {
    backgroundColor: Colors.background.light,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  datasetName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  datasetStats: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.muted,
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 16,
    marginBottom: 40,
  },
  importButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 8,
  },
});