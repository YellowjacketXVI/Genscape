import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldCheck, AlertTriangle, DollarSign, Eye, EyeOff, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function PublishOptionsStep() {
  const router = useRouter();
  
  const [genGuard, setGenGuard] = useState(true);
  const [allowDatasetReuse, setAllowDatasetReuse] = useState(false);
  const [contentWarnings, setContentWarnings] = useState({
    suggestive: false,
    political: false,
    violent: false,
    nudity: false,
  });
  const [visibility, setVisibility] = useState('public');
  const [approvalType, setApprovalType] = useState('auto');
  const [pricingModel, setPricingModel] = useState('free');

  const finishWizard = () => {
    // In a real app, you would save all wizard data here
    router.push('/scape-manager');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Publish Options</Text>
        <Text style={styles.description}>
          Configure permissions, pricing, and visibility for your Scape before publishing.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Protection</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingTitleRow}>
                <ShieldCheck size={20} color={Colors.primary} />
                <Text style={styles.settingTitle}>GenGuard Protection</Text>
              </View>
              <Text style={styles.settingDescription}>
                Prevents downloading or external use of your content
              </Text>
            </View>
            <Switch
              value={genGuard}
              onValueChange={setGenGuard}
              trackColor={{ false: '#555', true: Colors.primary }}
              thumbColor="#FFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingTitleRow}>
                <AlertTriangle size={20} color={Colors.text.secondary} />
                <Text style={styles.settingTitle}>Dataset Reuse</Text>
              </View>
              <Text style={styles.settingDescription}>
                Allow this content to be used in training datasets
              </Text>
            </View>
            <Switch
              value={allowDatasetReuse}
              onValueChange={setAllowDatasetReuse}
              trackColor={{ false: '#555', true: Colors.primary }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Warnings</Text>
          <Text style={styles.sectionDescription}>
            Flag your content if it contains any of these elements.
          </Text>
          
          <View style={styles.warningsGrid}>
            <WarningToggle
              label="Suggestive Themes"
              value={contentWarnings.suggestive}
              onToggle={() => setContentWarnings({...contentWarnings, suggestive: !contentWarnings.suggestive})}
            />
            <WarningToggle
              label="Political Content"
              value={contentWarnings.political}
              onToggle={() => setContentWarnings({...contentWarnings, political: !contentWarnings.political})}
            />
            <WarningToggle
              label="Violent Content"
              value={contentWarnings.violent}
              onToggle={() => setContentWarnings({...contentWarnings, violent: !contentWarnings.violent})}
            />
            <WarningToggle
              label="Partial Nudity"
              value={contentWarnings.nudity}
              onToggle={() => setContentWarnings({...contentWarnings, nudity: !contentWarnings.nudity})}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visibility</Text>
          
          <View style={styles.optionsGrid}>
            <OptionButton
              icon={<Eye size={20} color="#FFF" />}
              label="Public"
              selected={visibility === 'public'}
              onPress={() => setVisibility('public')}
            />
            <OptionButton
              icon={<EyeOff size={20} color="#FFF" />}
              label="Private"
              selected={visibility === 'private'}
              onPress={() => setVisibility('private')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Approval Settings</Text>
          
          <View style={styles.optionsGrid}>
            <OptionButton
              label="Auto-Approve"
              selected={approvalType === 'auto'}
              onPress={() => setApprovalType('auto')}
            />
            <OptionButton
              label="Manual Review"
              selected={approvalType === 'manual'}
              onPress={() => setApprovalType('manual')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing Model</Text>
          
          <View style={styles.optionsGrid}>
            <OptionButton
              label="Free"
              selected={pricingModel === 'free'}
              onPress={() => setPricingModel('free')}
            />
            <OptionButton
              icon={<DollarSign size={20} color="#FFF" />}
              label="Paid (10%)"
              selected={pricingModel === 'paid10'}
              onPress={() => setPricingModel('paid10')}
            />
            <OptionButton
              icon={<DollarSign size={20} color="#FFF" />}
              label="Paid (20%)"
              selected={pricingModel === 'paid20'}
              onPress={() => setPricingModel('paid20')}
            />
            <OptionButton
              icon={<DollarSign size={20} color="#FFF" />}
              label="Paid (30%)"
              selected={pricingModel === 'paid30'}
              onPress={() => setPricingModel('paid30')}
            />
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.publishButton} onPress={finishWizard}>
          <Text style={styles.publishButtonText}>Publish Scape</Text>
          <ChevronRight size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function WarningToggle({ label, value, onToggle }: { label: string, value: boolean, onToggle: () => void }) {
  return (
    <TouchableOpacity style={styles.warningToggle} onPress={onToggle}>
      <View style={[styles.warningIndicator, value ? styles.warningActive : {}]} />
      <Text style={styles.warningLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function OptionButton({ icon, label, selected, onPress }: { icon?: React.ReactNode, label: string, selected: boolean, onPress: () => void }) {
  return (
    <TouchableOpacity 
      style={[styles.optionButton, selected ? styles.optionSelected : {}]}
      onPress={onPress}
    >
      {icon}
      <Text style={[styles.optionLabel, selected ? styles.optionLabelSelected : {}]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 24,
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  sectionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  settingTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.muted,
  },
  warningsGrid: {
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    padding: 16,
  },
  warningToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  warningIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.background.light,
    marginRight: 12,
  },
  warningActive: {
    backgroundColor: Colors.primary,
  },
  warningLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text.secondary,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    margin: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.background.light,
  },
  optionLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  optionLabelSelected: {
    color: Colors.text.primary,
  },
  footer: {
    backgroundColor: Colors.background.dark,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.background.light,
  },
  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  publishButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFF',
    marginRight: 8,
  },
});