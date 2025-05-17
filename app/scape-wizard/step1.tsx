import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Image as ImageIcon, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import LayoutTemplate from '@/components/scape/LayoutTemplate';

export default function ScapeDetailsStep() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [selectedLayout, setSelectedLayout] = useState(1);

  const layouts = [
    { id: 1, name: 'Grid Layout' },
    { id: 2, name: 'Single Column' },
    { id: 3, name: 'Gallery Focus' },
    { id: 4, name: 'Shop Layout' },
  ];

  const goToNextStep = () => {
    // Here you would normally save the data
    router.push('/scape-wizard/step3');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Scape Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter a name for your Scape"
          placeholderTextColor={Colors.text.muted}
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Caption</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter a short description"
          placeholderTextColor={Colors.text.muted}
          value={caption}
          onChangeText={setCaption}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Tags (comma separated)</Text>
        <TextInput
          style={styles.input}
          placeholder="art, digital, portrait"
          placeholderTextColor={Colors.text.muted}
          value={tags}
          onChangeText={setTags}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Banner Image</Text>
        <TouchableOpacity style={styles.imageSelector}>
          <View style={styles.imagePlaceholder}>
            <ImageIcon size={24} color={Colors.text.muted} />
            <Text style={styles.imagePlaceholderText}>Upload Banner</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Choose a Layout</Text>
        <View style={styles.layoutGrid}>
          {layouts.map((layout) => (
            <TouchableOpacity
              key={layout.id}
              style={[
                styles.layoutItem,
                selectedLayout === layout.id && styles.selectedLayout,
              ]}
              onPress={() => setSelectedLayout(layout.id)}
            >
              <LayoutTemplate id={layout.id} selected={selectedLayout === layout.id} />
              <Text style={styles.layoutName}>{layout.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={goToNextStep}>
        <Text style={styles.nextButtonText}>Next: Configure Widgets</Text>
        <ChevronRight size={20} color="#FFF" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },
  contentContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: Colors.text.primary,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageSelector: {
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    overflow: 'hidden',
    height: 120,
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.muted,
    marginTop: 8,
  },
  layoutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  layoutItem: {
    width: '50%',
    padding: 8,
  },
  layoutContent: {
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    height: 120,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedLayout: {
    borderColor: Colors.primary,
  },
  layoutName: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  nextButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFF',
    marginRight: 8,
  },
});