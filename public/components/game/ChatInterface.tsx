import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Send } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'master' | 'system';
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onCommand: (command: string) => void;
}

export default function ChatInterface({ messages = [], onSendMessage, onCommand }: ChatInterfaceProps) {
  const { colors } = useTheme();
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    const trimmedText = inputText.trim();
    if (!trimmedText) return;

    if (trimmedText.startsWith('/')) {
      onCommand(trimmedText);
    } else {
      onSendMessage(trimmedText);
    }

    setInputText('');
  };

  const renderMessage = (message: Message) => {
    const isUser = message.type === 'user';
    const isSystem = message.type === 'system';

    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.masterMessage,
          isSystem && styles.systemMessage
        ]}
      >
        <Text
          style={[
            styles.messageText,
            { color: isSystem ? colors.textLight : colors.text }
          ]}
        >
          {message.content}
        </Text>
        <Text style={[styles.timestamp, { color: colors.textLight }]}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textLight }]}>
              Bem-vindo à sua aventura! Use comandos com / para ações especiais.
            </Text>
          </View>
        ) : (
          messages.map(renderMessage)
        )}
      </ScrollView>

      <View style={[styles.inputContainer, { backgroundColor: colors.cardBackground }]}>
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.background }]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Digite sua mensagem ou use / para comandos..."
          placeholderTextColor={colors.textLight}
          multiline
          maxLength={500}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: colors.primary },
            !inputText.trim() && { opacity: 0.5 }
          ]}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Send size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 8,
  },
  messageContainer: {
    padding: 12,
    borderRadius: 8,
    maxWidth: '80%',
    marginVertical: 4,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4A90E2',
  },
  masterMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#2E3440',
  },
  systemMessage: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 4,
  },
  messageText: {
    fontFamily: 'Exo-Regular',
    fontSize: 14,
    color: '#FFFFFF',
  },
  timestamp: {
    fontFamily: 'Exo-Regular',
    fontSize: 10,
    marginTop: 4,
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    fontFamily: 'Exo-Regular',
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontFamily: 'Exo-Regular',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  }
}); 