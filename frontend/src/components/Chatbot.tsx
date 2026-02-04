import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User as UserIcon } from 'lucide-react';

interface Message {
    id: number;
    text: string;
    sender: 'bot' | 'user';
    timestamp: Date;
}

interface QuickReply {
    label: string;
    keywords: string[];
}

const chatbotData: Record<string, string> = {
    'return, refund, exchange': `Return Policy

You can return items within 7 days of delivery if:
• The item is unused and in original packaging
• Tags are still attached
• You have the original receipt

To initiate a return, contact us at shahela17@gmail.com or call +880 1777954044.`,

    'delivery, shipping, ship, courier': `Delivery Information

• Dhaka: 1-2 working days
• Outside Dhaka: 3-5 working days
• Free shipping on orders above ৳5,000

We use trusted courier services. You'll receive a tracking number once your order is shipped.`,

    'size, measurement, fit, sizing': `Size Guide

We follow standard size charts:
• S: Bust 32-34", Waist 26-28"
• M: Bust 36-38", Waist 30-32"
• L: Bust 40-42", Waist 34-36"
• XL: Bust 44-46", Waist 38-40"

For custom measurements, please mention in order notes or contact us.`,

    'payment, pay, cod, cash': `Payment Methods

We accept:
• Cash on Delivery (COD) - Pay when you receive
• bKash - Mobile banking
• Nagad - Mobile banking
• Bank Transfer - Direct deposit

All payments are secure and encrypted.`,

    'contact, support, help, email, phone': `Contact Us

Email: sifat.sai3@gmail.com, shahela17@gmail.com
Phone: +880 1758761248, +880 1777954044 
WhatsApp: +880 1758761248, +880 1777954044

Business Hours:
Saturday - Thursday: 10 AM - 8 PM
Friday: Closed

We typically respond within 2-4 hours during business hours.`,

    'hours, time, open, opening': `Opening Hours

Saturday - Thursday: 10:00 AM - 8:00 PM
Friday: Closed

Online orders can be placed 24/7!`,

    'default': `Hello! I'm here to help you with:

• Return & Exchange Policy
• Delivery Information
• Size Guide
• Payment Methods
• Contact Information
• Opening Hours

Please select a topic or type your question!`
};

const quickReplies: QuickReply[] = [
    { label: 'Return Policy', keywords: ['return'] },
    { label: 'Delivery Info', keywords: ['delivery'] },
    { label: 'Size Guide', keywords: ['size'] },
    { label: 'Payment Methods', keywords: ['payment'] },
    { label: 'Contact Us', keywords: ['contact'] },
    { label: 'Opening Hours', keywords: ['hours'] },
];

import { useLocation } from 'react-router-dom';

const MessageContent = ({ text, isBot }: { text: string, isBot: boolean }) => {
    const lines = text.split('\n');

    return (
        <div className="flex flex-col gap-1.5">
            {lines.map((line, index) => {
                const trimmedLine = line.trim();
                if (!trimmedLine) return <div key={index} className="h-1" />;

                // Check if it's a header (first line of a bot message usually)
                const isHeader = isBot && index === 0 && lines.length > 1;

                // Check if it's a list item
                const isBullet = trimmedLine.startsWith('•');

                return (
                    <p
                        key={index}
                        className={`
                            text-[13px] leading-relaxed
                            ${isHeader ? 'font-serif font-bold text-lg text-accent mb-1' : ''}
                            ${isBullet ? 'pl-4 relative' : ''}
                        `}
                    >
                        {isBullet && (
                            <span className="absolute left-0 text-accent font-bold">•</span>
                        )}
                        {isBullet ? trimmedLine.substring(1).trim() : trimmedLine}
                    </p>
                );
            })}
        </div>
    );
};

const Chatbot = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const location = useLocation();

    // Check if user is admin on component mount and when storage changes
    useEffect(() => {
        const checkAdminStatus = () => {
            const userType = localStorage.getItem("userType");
            setIsAdmin(userType === "admin");
        };

        // Check initially
        checkAdminStatus();

        // Listen for storage changes (in case user logs in/out in another tab)
        const handleStorageChange = () => {
            checkAdminStatus();
        };

        window.addEventListener('storage', handleStorageChange);

        // Also check on any localStorage changes in the same tab
        const interval = setInterval(checkAdminStatus, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: chatbotData['default'],
            sender: 'bot',
            timestamp: new Date(),
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const findResponse = (userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase();

        for (const [keywords, response] of Object.entries(chatbotData)) {
            if (keywords === 'default') continue;

            const keywordList = keywords.split(', ');
            if (keywordList.some(keyword => lowerMessage.includes(keyword))) {
                return response;
            }
        }

        return `I'm not sure about that. Here are some topics I can help with:\n\n${chatbotData['default']}`;
    };

    const handleSendMessage = (message?: string) => {
        const textToSend = message || inputValue.trim();
        if (!textToSend) return;

        // Add user message
        const userMessage: Message = {
            id: Date.now(),
            text: textToSend,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        // Bot response after a short delay
        setTimeout(() => {
            const botResponse: Message = {
                id: Date.now() + 1,
                text: findResponse(textToSend),
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, botResponse]);
        }, 500);
    };

    const handleQuickReply = (keywords: string[]) => {
        handleSendMessage(keywords[0]);
    };

    // Don't render anything if user is admin or on admin route
    if (isAdmin || location.pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <>
            {/* Chat Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all"
                        style={{ backgroundColor: '#795e1a', color: '#ffffff' }}
                    >
                        <MessageCircle size={20} />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[380px] h-[70vh] sm:h-[600px] bg-card rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 flex items-center justify-between" style={{ backgroundColor: '#795e1a', color: '#ffffff' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                                    <Bot size={24} />
                                </div>
                                <div>
                                    <h3 className="font-serif text-lg font-bold">Petal & Pearl</h3>
                                    <p className="text-xs opacity-90">Customer Support</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-full transition-colors"
                                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-background/95">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${message.sender === 'bot'
                                        ? 'bg-accent text-accent-foreground'
                                        : 'bg-muted text-muted-foreground'
                                        }`}>
                                        {message.sender === 'bot' ? <Bot size={16} /> : <UserIcon size={16} />}
                                    </div>
                                    <div className={`max-w-[80%] ${message.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1.5`}>
                                        <div className={`px-4 py-3 rounded-2xl shadow-sm border ${message.sender === 'bot'
                                            ? 'bg-card border-border rounded-tl-none text-card-foreground'
                                            : 'bg-accent text-accent-foreground border-transparent rounded-tr-none'
                                            }`}>
                                            {message.sender === 'bot' ? (
                                                <MessageContent text={message.text} isBot={true} />
                                            ) : (
                                                <p className="text-[13px] leading-relaxed">{message.text}</p>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground/70 px-1 font-medium italic">
                                            {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Replies */}
                        <div className="p-3 border-t border-border bg-card/50">
                            <div className="flex flex-wrap gap-2 mb-1 px-1">
                                {quickReplies.map((reply, index) => (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.05, backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleQuickReply(reply.keywords)}
                                        className="px-3 py-1.5 bg-background text-accent text-[11px] font-medium rounded-full transition-all border border-accent/20 shadow-sm"
                                    >
                                        {reply.label}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-border bg-card">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Type your question..."
                                    className="flex-1 bg-background border border-border rounded-2xl px-4 py-2.5 text-[13px] text-foreground focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all placeholder:text-muted-foreground/50"
                                />
                                <button
                                    onClick={() => handleSendMessage()}
                                    className="p-2.5 bg-accent text-accent-foreground rounded-2xl hover:bg-accent/90 shadow-md hover:shadow-lg transition-all"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;