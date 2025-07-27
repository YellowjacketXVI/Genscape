import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function ScapeWizard() {
  const router = useRouter();

  const startScapeCreation = () => {
    router.push('/scape-wizard/step1');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create a New Scape</Text>
        <Text style={styles.description}>
          Scapes are customizable content pages where you can showcase your creations.
          Follow our 4-step wizard to create your perfect Scape.
        </Text>

        <View style={styles.stepsContainer}>
          <StepItem 
            number={1} 
            title="Scape Details" 
            description="Set the name, caption, and choose a layout" 
          />
          <StepItem 
            number={2} 
            title="Add Media" 
            description="Upload or select media for your Scape" 
          />
          <StepItem 
            number={3} 
            title="Configure Widgets" 
            description="Add and arrange widgets on your Scape" 
          />
          <StepItem 
            number={4} 
            title="Publish Options" 
            description="Set permissions, pricing, and visibility" 
          />
        </View>

        <TouchableOpacity style={styles.startButton} onPress={startScapeCreation}>
          <Text style={styles.buttonText}>Start Creating</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function StepItem({ number, title, description }: { number: number, title: string, description: string }) {
  return (
    <View style={styles.stepItem}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{number}</Text>
      </View>
      <View style={styles.stepInfo}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepDescription}>{description}</Text>
      </View>
      <ChevronRight size={20} color={Colors.text.muted} />
    </View>
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
  stepsContainer: {
    marginBottom: 32,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  stepNumber: {
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    fontSize: 16,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  stepDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.muted,
  },
  startButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFF',
  },
});