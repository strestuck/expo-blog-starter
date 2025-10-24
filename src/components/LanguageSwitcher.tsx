import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

interface LanguageSwitcherProps {
  style?: any;
  showFlag?: boolean;
  compact?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  style,
  showFlag = true,
  compact = false,
}) => {
  const { currentLanguage, changeLanguage, availableLanguages, isLoading } = useLanguage();
  const [modalVisible, setModalVisible] = React.useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const modalBackgroundColor = useThemeColor({}, 'background');

  const currentLang = availableLanguages.find(lang => lang.code === currentLanguage);

  const handleLanguageSelect = async (languageCode: string) => {
    try {
      await changeLanguage(languageCode);
      setModalVisible(false);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactContainer, { borderColor }, style]}
        onPress={() => setModalVisible(true)}
        disabled={isLoading}
      >
        {showFlag && currentLang && (
          <Text style={styles.flag}>{currentLang.flag}</Text>
        )}
        <Text style={[styles.compactText, { color: textColor }]}>
          {currentLang?.code.toUpperCase()}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <>
      <TouchableOpacity
        style={[styles.container, { backgroundColor, borderColor }, style]}
        onPress={() => setModalVisible(true)}
        disabled={isLoading}
      >
        {showFlag && currentLang && (
          <Text style={styles.flag}>{currentLang.flag}</Text>
        )}
        <ThemedText style={styles.text}>
          {currentLang?.name || 'Language'}
        </ThemedText>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <ThemedView style={[styles.modalContent, { backgroundColor: modalBackgroundColor }]}>
            <ThemedText style={styles.modalTitle}>Select Language</ThemedText>

            {availableLanguages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageOption,
                  currentLanguage === language.code && {
                    backgroundColor: useThemeColor({}, 'tint') + '20',
                    borderColor: useThemeColor({}, 'tint'),
                  },
                  { borderColor },
                ]}
                onPress={() => handleLanguageSelect(language.code)}
              >
                {showFlag && (
                  <Text style={styles.flag}>{language.flag}</Text>
                )}
                <ThemedText style={[
                  styles.languageText,
                  currentLanguage === language.code && {
                    color: useThemeColor({}, 'tint'),
                    fontWeight: '600',
                  },
                ]}>
                  {language.name}
                </ThemedText>
                {currentLanguage === language.code && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.cancelButton, { borderColor }]}
              onPress={() => setModalVisible(false)}
            >
              <ThemedText style={styles.cancelText}>Cancel</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 120,
    justifyContent: 'center',
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    minWidth: 60,
    justifyContent: 'center',
  },
  flag: {
    fontSize: 16,
    marginRight: 6,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  compactText: {
    fontSize: 12,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    margin: 20,
    borderRadius: 12,
    padding: 20,
    minWidth: 280,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  languageText: {
    flex: 1,
    fontSize: 16,
  },
  checkmark: {
    fontSize: 16,
    color: '#007AFF',
  },
  cancelButton: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LanguageSwitcher;