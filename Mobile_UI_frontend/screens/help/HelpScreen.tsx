import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Colors, SPACING, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What do the BMI categories mean?",
    answer: "BMI (Body Mass Index) categories help assess weight status: Underweight (<18.5), Normal (18.5-24.9), Overweight (25-29.9), and Obese (≥30). These are general guidelines and may not apply to everyone, especially athletes or those with high muscle mass."
  },
  {
    question: "How is the health score calculated?",
    answer: "The health score considers multiple factors including BMI, physical activity level, sleep quality, screen time, diet habits, and family history. Each factor is weighted based on its impact on overall health, with scores ranging from 0-100."
  },
  {
    question: "What does the confidence score represent?",
    answer: "The confidence score indicates how reliable the assessment is based on the completeness and consistency of your responses. Higher confidence means more accurate results."
  },
  {
    question: "Should I consult a healthcare professional?",
    answer: "This app provides general health insights and is not a substitute for professional medical advice. Always consult with healthcare providers for personalized medical guidance, especially if you have health concerns."
  },
  {
    question: "How often should I take this assessment?",
    answer: "You can take this assessment as often as you'd like to track changes in your health habits. We recommend monthly assessments to monitor progress and lifestyle changes."
  },
  {
    question: "Is my data secure and private?",
    answer: "Yes, all your data is stored locally on your device and is not transmitted to external servers. Your privacy and data security are our top priorities."
  }
];

const resources = [
  {
    title: "Centers for Disease Control and Prevention",
    description: "Official BMI information and health guidelines",
    url: "https://www.cdc.gov/healthyweight/assessing/bmi/index.html"
  },
  {
    title: "World Health Organization",
    description: "Global health recommendations and standards",
    url: "https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
  },
  {
    title: "American Heart Association",
    description: "Heart health and lifestyle recommendations",
    url: "https://www.heart.org/en/healthy-living"
  },
  {
    title: "National Sleep Foundation",
    description: "Sleep health guidelines and tips",
    url: "https://www.sleepfoundation.org/"
  }
];

export default function HelpScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const openResource = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.contentWrapper}>
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.header}
          >
            <Text style={[Typography.h1, { color: colors.textInverse }]}>Help & Resources</Text>
            <Text style={[Typography.body, { color: colors.textInverse, opacity: 0.9 }]}>
              Get answers and learn more about health assessment
            </Text>
          </LinearGradient>

          <View style={styles.content}>
            {/* BMI Categories Section */}
            <Card variant="elevated" style={styles.card}>
              <CardHeader>
                <Text style={[Typography.h5, { color: colors.textPrimary }]}>
                  📊 BMI Categories Explained
                </Text>
              </CardHeader>
              <CardContent>
                <View style={styles.bmiCategories}>
                  <View style={[styles.bmiCategory, { backgroundColor: colors.info }]}>
                    <Text style={[Typography.h6, { color: colors.textInverse }]}>Underweight</Text>
                    <Text style={[Typography.caption, { color: colors.textInverse, opacity: 0.9 }]}> &lt; 18.5</Text>
                    <Text style={[Typography.caption, { color: colors.textInverse, opacity: 0.8 }]}>
                      May indicate nutritional deficiency or other health issues
                    </Text>
                  </View>
                  <View style={[styles.bmiCategory, { backgroundColor: colors.success }]}>
                    <Text style={[Typography.h6, { color: colors.textInverse }]}>Normal Weight</Text>
                    <Text style={[Typography.caption, { color: colors.textInverse, opacity: 0.9 }]}>18.5 - 24.9</Text>
                    <Text style={[Typography.caption, { color: colors.textInverse, opacity: 0.8 }]}>
                      Healthy weight range for most adults
                    </Text>
                  </View>
                  <View style={[styles.bmiCategory, { backgroundColor: colors.warning }]}>
                    <Text style={[Typography.h6, { color: colors.textInverse }]}>Overweight</Text>
                    <Text style={[Typography.caption, { color: colors.textInverse, opacity: 0.9 }]}>25.0 - 29.9</Text>
                    <Text style={[Typography.caption, { color: colors.textInverse, opacity: 0.8 }]}>
                      May increase risk of health problems
                    </Text>
                  </View>
                  <View style={[styles.bmiCategory, { backgroundColor: colors.error }]}>
                    <Text style={[Typography.h6, { color: colors.textInverse }]}>Obese</Text>
                    <Text style={[Typography.caption, { color: colors.textInverse, opacity: 0.9 }]}>≥ 30.0</Text>
                    <Text style={[Typography.caption, { color: colors.textInverse, opacity: 0.8 }]}>
                      Significantly increased health risks
                    </Text>
                  </View>
                </View>
              </CardContent>
            </Card>

            {/* FAQs Section */}
            <Card variant="elevated" style={styles.card}>
              <CardHeader>
                <Text style={[Typography.h5, { color: colors.textPrimary }]}>
                  ❓ Frequently Asked Questions
                </Text>
              </CardHeader>
              <CardContent>
                {faqs.map((faq, index) => (
                  <View key={index}>
                    <View style={styles.faqItem}>
                      <TouchableOpacity
                        style={[styles.faqQuestion, { backgroundColor: colors.surface }]}
                        onPress={() => toggleFAQ(index)}
                      >
                        <View style={styles.faqQuestionContent}>
                          <Text style={[Typography.body, { color: colors.textPrimary, flex: 1 }]} numberOfLines={0}>
                            {faq.question}
                          </Text>
                          <View style={[styles.faqToggle, { backgroundColor: colors.primary + '20' }]}>
                            <Text style={[Typography.caption, { color: colors.primary, fontWeight: 'bold' }]}>
                              {expandedFAQ === index ? '−' : '+'}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                      {expandedFAQ === index && (
                        <View style={[styles.faqAnswer, { backgroundColor: colors.background }]}>
                          <Text style={[Typography.caption, { color: colors.textSecondary, lineHeight: 20 }]} numberOfLines={0}>
                            {faq.answer}
                          </Text>
                        </View>
                      )}
                    </View>
                    {index < faqs.length - 1 && (
                      <View style={[styles.faqSeparator, { backgroundColor: colors.borderLight }]} />
                    )}
                  </View>
                ))}
              </CardContent>
            </Card>

            {/* Resources Section */}
            <Card variant="elevated" style={styles.card}>
              <CardHeader>
                <Text style={[Typography.h5, { color: colors.textPrimary }]}>
                  🔗 Helpful Resources
                </Text>
              </CardHeader>
              <CardContent>
                <Text style={[Typography.caption, { color: colors.textSecondary, marginBottom: SPACING.md }]}>
                  Explore these trusted sources for more information about health and wellness:
                </Text>
                {resources.map((resource, index) => (
                  <View key={index}>
                    <TouchableOpacity
                      style={[styles.resourceItem, { backgroundColor: colors.surface }]}
                      onPress={() => openResource(resource.url)}
                    >
                      <View style={styles.resourceIcon}>
                        <Text style={styles.resourceEmoji}>🔗</Text>
                      </View>
                      <View style={styles.resourceContent}>
                        <Text style={[Typography.body, { color: colors.textPrimary, fontWeight: '600' }]} numberOfLines={0}>
                          {resource.title}
                        </Text>
                        <Text style={[Typography.caption, { color: colors.textSecondary }]} numberOfLines={0}>
                          {resource.description}
                        </Text>
                      </View>
                      <View style={[styles.resourceArrow, { backgroundColor: colors.primary + '20' }]}>
                        <Text style={[Typography.caption, { color: colors.primary, fontWeight: 'bold' }]}>→</Text>
                      </View>
                    </TouchableOpacity>
                    {index < resources.length - 1 && (
                      <View style={[styles.resourceSeparator, { backgroundColor: colors.borderLight }]} />
                    )}
                  </View>
                ))}
              </CardContent>
            </Card>

            {/* Disclaimer Section */}
            <Card variant="elevated" style={styles.card}>
              <CardHeader>
                <Text style={[Typography.h5, { color: colors.textPrimary }]}>
                  ⚠️ Important Disclaimer
                </Text>
              </CardHeader>
              <CardContent>
                <View style={[styles.disclaimerBox, { backgroundColor: colors.warning + '20', borderLeftColor: colors.warning }]}>
                  <Text style={[Typography.caption, { color: colors.warning, lineHeight: 20 }]} numberOfLines={0}>
                    This health assessment tool is for informational purposes only and should not be considered as medical advice, diagnosis, or treatment. The results are based on general health guidelines and may not be accurate for everyone.
                  </Text>
                  <Text style={[Typography.caption, { color: colors.warning, lineHeight: 20, marginTop: SPACING.sm }]} numberOfLines={0}>
                    Always consult with qualified healthcare professionals for personalized medical advice, especially if you have existing health conditions or concerns.
                  </Text>
                  <Text style={[Typography.caption, { color: colors.warning, lineHeight: 20, marginTop: SPACING.sm }]} numberOfLines={0}>
                    This app does not replace professional medical consultation, diagnosis, or treatment.
                  </Text>
                </View>
              </CardContent>
            </Card>

            {/* Contact Section */}
            <Card variant="elevated" style={styles.card}>
              <CardHeader>
                <Text style={[Typography.h5, { color: colors.textPrimary }]}>
                  📞 Need More Help?
                </Text>
              </CardHeader>
              <CardContent>
                <Text style={[Typography.caption, { color: colors.textSecondary, lineHeight: 20 }]} numberOfLines={0}>
                  If you have questions about this app or need technical support, please contact us through the app store or our support channels.
                </Text>
              </CardContent>
            </Card>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 800,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.xl,
  },
  header: {
    padding: SPACING.xl,
    paddingTop: SPACING['4xl'],
    alignItems: 'center',
  },
  content: {
    padding: SPACING.lg,
  },
  card: {
    marginBottom: SPACING.lg,
  },
  bmiCategories: {
    gap: SPACING.md,
  },
  bmiCategory: {
    padding: SPACING.md,
    borderRadius: 12,
  },
  faqItem: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  faqQuestion: {
    padding: SPACING.md,
  },
  faqQuestionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqToggle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  faqAnswer: {
    padding: SPACING.md,
  },
  faqSeparator: {
    height: 1,
    marginVertical: SPACING.sm,
    marginHorizontal: SPACING.md,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 8,
  },
  resourceIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  resourceEmoji: {
    fontSize: 16,
  },
  resourceContent: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  resourceArrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourceSeparator: {
    height: 1,
    marginVertical: SPACING.sm,
    marginHorizontal: SPACING.md,
  },
  disclaimerBox: {
    padding: SPACING.md,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
});
