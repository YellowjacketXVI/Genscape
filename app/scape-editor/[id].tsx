import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Plus, Star, Camera } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { ChannelProvider } from '@/contexts/ChannelContext';
import Button from '@/components/ui/Button';
import LoadingScreen from '@/components/ui/LoadingScreen';
import WidgetSelectionPanel from '@/components/scape/WidgetSelectionPanel';
import WidgetCard from '@/components/scape/WidgetCard';
import BannerSelector from '@/components/scape/BannerSelector';
import { 
  ScapeEditorState, 
  ScapeEditorWidget,
  ScapeValidationResult 
} from '@/types/scape-editor';
import { 
  validateScape, 
  createWidget,
  reorderWidgets 
} from '@/utils/widget-utils';

export default function ScapeEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scapeState, setScapeState] = useState<ScapeEditorState>({
    id: id || 'new',
    title: '',
    banner: null,
    bannerStatic: false,
    widgets: [],
    featureWidgetId: null,
    tagline: '',
    isDraft: true,
  });
  
  const [showWidgetPanel, setShowWidgetPanel] = useState(false);
  const [showTitleEditor, setShowTitleEditor] = useState(false);
  const [showBannerSelector, setShowBannerSelector] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [validation, setValidation] = useState<ScapeValidationResult>({
    isValid: false,
    errors: [],
    canSaveDraft: false,
    canPublish: false,
  });

  useEffect(() => {
    loadScape();
  }, [id]);

  useEffect(() => {
    // Update validation whenever scape state changes
    const newValidation = validateScape(
      scapeState.title,
      scapeState.widgets,
      scapeState.featureWidgetId,
      scapeState.tagline
    );
    setValidation(newValidation);
  }, [scapeState]);

  const loadScape = async () => {
    try {
      if (id === 'new') {
        // Initialize new scape
        setScapeState(prev => ({
          ...prev,
          title: 'Untitled Scape',
        }));
      } else {
        // TODO: Load existing scape from API
        // For now, simulate loading
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load scape');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleTitleEdit = () => {
    setTempTitle(scapeState.title);
    setShowTitleEditor(true);
  };

  const handleTitleSave = () => {
    const titleValidation = validateScape(tempTitle, [], null, '');
    if (!titleValidation.canSaveDraft) {
      Alert.alert('Invalid Title', titleValidation.errors[0]);
      return;
    }
    
    setScapeState(prev => ({ ...prev, title: tempTitle }));
    setShowTitleEditor(false);
  };

  const handleAddWidget = (type: string, variant: string, defaultData: any) => {
    const newWidget = createWidget(type as any, variant, defaultData);
    setScapeState(prev => ({
      ...prev,
      widgets: [...prev.widgets, newWidget],
    }));
    setShowWidgetPanel(false);
  };

  const handleUpdateWidget = (updatedWidget: ScapeEditorWidget) => {
    setScapeState(prev => ({
      ...prev,
      widgets: prev.widgets.map(w => 
        w.id === updatedWidget.id ? updatedWidget : w
      ),
    }));
  };

  const handleDeleteWidget = (widgetId: string) => {
    Alert.alert(
      'Delete Widget',
      'Are you sure you want to delete this widget?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setScapeState(prev => ({
              ...prev,
              widgets: prev.widgets.filter(w => w.id !== widgetId),
              featureWidgetId: prev.featureWidgetId === widgetId ? null : prev.featureWidgetId,
            }));
          },
        },
      ]
    );
  };

  const handleSetFeatureWidget = (widgetId: string) => {
    setScapeState(prev => ({
      ...prev,
      featureWidgetId: prev.featureWidgetId === widgetId ? null : widgetId,
    }));
  };

  const handleBannerSelect = (mediaUrl: string) => {
    setScapeState(prev => ({ ...prev, banner: mediaUrl }));
    setShowBannerSelector(false);
  };

  const handleSaveDraft = async () => {
    if (!validation.canSaveDraft) {
      Alert.alert('Cannot Save', validation.errors.join('\n'));
      return;
    }

    setSaving(true);
    try {
      // TODO: Save to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'Draft saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!validation.canPublish) {
      Alert.alert('Cannot Publish', validation.errors.join('\n'));
      return;
    }

    setSaving(true);
    try {
      // TODO: Publish to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'Scape published successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to publish scape');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ChannelProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleTitleEdit} style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              {scapeState.title}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <Button
              title="Draft"
              variant="secondary"
              size="sm"
              onPress={handleSaveDraft}
              disabled={!validation.canSaveDraft || saving}
              loading={saving}
            />
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Banner Section */}
          <TouchableOpacity 
            style={[styles.bannerSection, { backgroundColor: theme.colors.surface }]}
            onPress={() => setShowBannerSelector(true)}
          >
            {scapeState.banner ? (
              <Text style={[styles.bannerText, { color: theme.colors.textSecondary }]}>
                Banner Selected
              </Text>
            ) : (
              <>
                <Camera size={32} color={theme.colors.textSecondary} />
                <Text style={[styles.bannerText, { color: theme.colors.textSecondary }]}>
                  Tap to add banner
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Widgets */}
          <View style={styles.widgetsSection}>
            {scapeState.widgets.map((widget, index) => (
              <WidgetCard
                key={widget.id}
                widget={widget}
                isFeature={scapeState.featureWidgetId === widget.id}
                onUpdate={handleUpdateWidget}
                onDelete={() => handleDeleteWidget(widget.id)}
                onSetFeature={() => handleSetFeatureWidget(widget.id)}
              />
            ))}
          </View>

          {/* Feature Widget Tagline */}
          {scapeState.featureWidgetId && (
            <View style={[styles.taglineSection, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.taglineLabel, { color: theme.colors.textSecondary }]}>
                Tagline ({scapeState.tagline.length}/75)
              </Text>
              <TextInput
                style={[styles.taglineInput, { 
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.border 
                }]}
                value={scapeState.tagline}
                onChangeText={(text) => {
                  if (text.length <= 75) {
                    setScapeState(prev => ({ ...prev, tagline: text }));
                  }
                }}
                placeholder="Enter a tagline for your featured content..."
                placeholderTextColor={theme.colors.textMuted}
                multiline
                maxLength={75}
              />
            </View>
          )}
        </ScrollView>

        {/* Add Widget Button */}
        <View style={[styles.footer, { backgroundColor: theme.colors.background }]}>
          <Button
            title="+ Add Widget"
            onPress={() => setShowWidgetPanel(true)}
            style={[styles.addButton, theme.shadows.lg as any]}
          />
          
          {validation.canPublish && (
            <Button
              title="Publish"
              variant="primary"
              onPress={handlePublish}
              disabled={saving}
              loading={saving}
              style={styles.publishButton}
            />
          )}
        </View>

        {/* Modals */}
        <Modal
          visible={showTitleEditor}
          transparent
          animationType="fade"
          onRequestClose={() => setShowTitleEditor(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.titleModal, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
                Edit Scape Name
              </Text>
              <TextInput
                style={[styles.titleInput, { 
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.border 
                }]}
                value={tempTitle}
                onChangeText={setTempTitle}
                placeholder="Enter scape name"
                placeholderTextColor={theme.colors.textMuted}
                autoFocus
              />
              <View style={styles.modalActions}>
                <Button
                  title="Cancel"
                  variant="secondary"
                  onPress={() => setShowTitleEditor(false)}
                  style={styles.modalButton}
                />
                <Button
                  title="Save"
                  onPress={handleTitleSave}
                  style={styles.modalButton}
                />
              </View>
            </View>
          </View>
        </Modal>

        <WidgetSelectionPanel
          isVisible={showWidgetPanel}
          onClose={() => setShowWidgetPanel(false)}
          onSelectWidget={handleAddWidget}
        />

        <BannerSelector
          isVisible={showBannerSelector}
          onClose={() => setShowBannerSelector(false)}
          onSelect={handleBannerSelect}
        />
      </SafeAreaView>
    </ChannelProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  bannerSection: {
    height: 120,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#333',
  },
  bannerText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginTop: 8,
  },
  widgetsSection: {
    gap: 16,
  },
  taglineSection: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
  },
  taglineLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  taglineInput: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  footer: {
    padding: 16,
    gap: 12,
  },
  addButton: {
    width: '100%',
  },
  publishButton: {
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titleModal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    marginBottom: 16,
    textAlign: 'center',
  },
  titleInput: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});
