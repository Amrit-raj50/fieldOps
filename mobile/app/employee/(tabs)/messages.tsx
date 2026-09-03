import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Message {
    id: string;
    text: string;
    sender: 'employee' | 'admin';
    time: string;
}

export default function EmployeeMessages() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hello, welcome to FieldOps! Reach out here if you need admin assistance on your assigned tasks.',
            sender: 'admin',
            time: '09:00 AM',
        },
    ]);
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMsg: Message = {
            id: Date.now().toString(),
            text: inputText.trim(),
            sender: 'employee',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, newMsg]);
        setInputText('');
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isMe = item.sender === 'employee';

        return (
            <View
                style={[
                    styles.messageContainer,
                    isMe ? styles.myMessageContainer : styles.otherMessageContainer,
                ]}
            >
                <View
                    style={[
                        styles.bubble,
                        isMe ? styles.myBubble : styles.otherBubble,
                    ]}
                >
                    <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.otherMessageText]}>
                        {item.text}
                    </Text>
                    <Text style={[styles.timeText, isMe ? styles.myTimeText : styles.otherTimeText]}>
                        {item.time}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <View style={styles.header}>
                <Text style={styles.heading}>Admin Support</Text>
                <Text style={styles.subHeading}>Direct channel to dispatch & administration</Text>
            </View>

            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                contentContainerStyle={styles.listContent}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type your message..."
                    placeholderTextColor="#94a3b8"
                    value={inputText}
                    onChangeText={setInputText}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Ionicons name="send" size={18} color="#ffffff" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 45,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        paddingBottom: 14,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    subHeading: {
        fontSize: 13,
        color: '#64748b',
        marginTop: 2,
    },
    listContent: {
        padding: 16,
    },
    messageContainer: {
        marginBottom: 12,
        flexDirection: 'row',
    },
    myMessageContainer: {
        justifyContent: 'flex-end',
    },
    otherMessageContainer: {
        justifyContent: 'flex-start',
    },
    bubble: {
        maxWidth: '78%',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 16,
    },
    myBubble: {
        backgroundColor: '#4f46e5',
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        backgroundColor: '#ffffff',
        borderBottomLeftRadius: 4,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    messageText: {
        fontSize: 14,
        lineHeight: 20,
    },
    myMessageText: {
        color: '#ffffff',
    },
    otherMessageText: {
        color: '#1e293b',
    },
    timeText: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    myTimeText: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    otherTimeText: {
        color: '#94a3b8',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#f1f5f9',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 14,
        color: '#0f172a',
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#4f46e5',
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
