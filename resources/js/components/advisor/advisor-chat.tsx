import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { useState } from 'react';

interface Message {
    text: string;
    sender: 'user' | 'bot';
}

const AdvisorChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { text: input, sender: 'user' };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post('/advisor', { text: input });
            const replyText = response.data.generated_content.candidates[0].content.parts[0].text;
            const botMessage: Message = { text: replyText, sender: 'bot' };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            const errorMessage: Message = { text: 'Failed to generate response.', sender: 'bot' };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        }

        setLoading(false);
    };

    return (
        <div className="mt-8 max-w-xl flex-col">
            <Card className="max-h-[70vh] min-h-[50vh] flex-1 overflow-y-auto rounded-2xl p-4 shadow-md">
                <CardContent>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-4 rounded-lg p-3 ${msg.sender === 'user' ? 'ml-auto bg-blue-500 text-white' : 'bg-green-600'}`}
                        >
                            {msg.text}
                        </motion.div>
                    ))}
                    {loading && <div className="text-gray-500">Typing...</div>}
                </CardContent>
            </Card>

            <div className="mt-4 flex items-center gap-2">
                <Input
                    value={input}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                    placeholder="Type your question..."
                    className="flex-1"
                />
                <Button onClick={sendMessage} disabled={loading || !input.trim()}>
                    <Send className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
};

export default AdvisorChat;
