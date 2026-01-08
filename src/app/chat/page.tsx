'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/stores/user-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Send, Sparkles, Loader2, Bot, User as UserIcon } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi ${user?.name || 'there'}! I'm your AI fitness coach. I can help you with workout advice, exercise form tips, nutrition guidance, and answer any fitness questions you have. What would you like to know?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/ai-coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context: {
            name: user?.name,
            fitnessLevel: user?.fitnessLevel,
            goals: user?.goals ? JSON.parse(user.goals) : [],
            equipment: user?.equipment ? JSON.parse(user.equipment) : [],
            injuries: user?.injuries ? JSON.parse(user.injuries) : [],
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error && error.message.includes('ZHIPU_API_KEY')
        ? '⚠️ API Key Missing: Your ZHIPU_API_KEY needs to be added to Vercel environment variables. Please add it and redeploy.'
        : "I'm sorry, I'm having trouble connecting right now. Please check your internet connection and try again.";

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    'What exercises target chest?',
    'How do I improve my squat form?',
    'Best exercises for beginners?',
    'How often should I workout?',
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/80 border-b border-white/10">
        <div className="container mx-auto px-6 py-4 max-w-4xl">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/')}
              className="rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-xl">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AI Fitness Coach</h1>
                <p className="text-sm text-white/50">Ask me anything</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8 max-w-4xl space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-purple-400" />
                </div>
              )}
              <Card
                className={`max-w-[80%] border-0 ${
                  message.role === 'user'
                    ? 'bg-emerald-500/20 border-emerald-500/20'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <CardContent className="p-4">
                  <p className="text-white/90 whitespace-pre-wrap">{message.content}</p>
                </CardContent>
              </Card>
              {message.role === 'user' && (
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-emerald-400" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-4 justify-start">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-purple-400" />
              </div>
              <Card className="max-w-[80%] border-0 bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                    <p className="text-white/50">Thinking...</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="container mx-auto px-6 pb-4 max-w-4xl">
          <p className="text-sm text-white/50 mb-3">Quick questions:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput(question);
                }}
                className="justify-start text-left h-auto py-3 px-4 bg-white/5 border-white/10 hover:bg-white/10 hover:border-emerald-500/40"
              >
                <span className="text-sm">{question}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="sticky bottom-0 backdrop-blur-xl bg-black/80 border-t border-white/10">
        <div className="container mx-auto px-6 py-4 max-w-4xl">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about workouts, form, nutrition..."
              disabled={loading}
              className="flex-1 bg-white/5 border-white/10 focus:border-purple-500/40 h-12 rounded-full px-6"
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              size="icon"
              className="h-12 w-12 rounded-full bg-purple-500 hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
