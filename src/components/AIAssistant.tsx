import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, Lightbulb, Code, FileText } from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  code?: string;
  language?: string;
}

const QUICK_ACTIONS = [
  { id: 'explain', label: 'Explain this code', icon: FileText },
  { id: 'optimize', label: 'Optimize performance', icon: Lightbulb },
  { id: 'debug', label: 'Help debug', icon: Code },
  { id: 'suggest', label: 'Suggest improvements', icon: Bot },
];

export function AIAssistant({ code, language }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your AI coding assistant. I can help explain code, suggest improvements, and answer programming questions. Try selecting some code and clicking \"Explain Code\" or ask me anything!",
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('explain') || lowerMessage.includes('what does')) {
      return `I can see you're asking about code explanation. Based on the ${language || 'JavaScript'} code you're working with, here's what I can help you understand:\n\n• Code structure and flow\n• Function purposes and parameters\n• Best practices and potential improvements\n• Common patterns and conventions\n\nFeel free to select specific code sections and I'll provide detailed explanations!`;
    }
    
    if (lowerMessage.includes('debug') || lowerMessage.includes('error') || lowerMessage.includes('fix')) {
      return `I'd be happy to help debug your code! Here's how I can assist:\n\n• Identify potential syntax errors\n• Suggest fixes for logical issues\n• Explain error messages\n• Recommend debugging strategies\n\nPlease share the specific error or issue you're encountering, and I'll help you resolve it.`;
    }
    
    if (lowerMessage.includes('optimize') || lowerMessage.includes('performance')) {
      return `Great question about optimization! For ${language || 'JavaScript'} code, I can help with:\n\n• Performance improvements\n• Memory usage optimization\n• Algorithm efficiency\n• Best practice recommendations\n\nShow me the code you'd like to optimize and I'll provide specific suggestions.`;
    }
    
    return `I understand you're asking: "${userMessage}"\n\nAs your AI coding assistant, I can help with:\n• Code explanation and documentation\n• Debugging and error resolution\n• Performance optimization\n• Best practices and code review\n• Algorithm suggestions\n\nHow can I specifically assist you with your ${language || 'JavaScript'} code today?`;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: simulateAIResponse(userMessage.content),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickAction = (actionId: string) => {
    const action = QUICK_ACTIONS.find(a => a.id === actionId);
    if (action) {
      setInput(action.label);
      textareaRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-full bg-ai-background border-editor-border">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-editor-border">
        <div className="p-2 bg-primary rounded-md">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-editor-foreground">AI Assistant</h3>
          <p className="text-sm text-editor-line-number">Ready to help with your code</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b border-editor-border">
        <div className="grid grid-cols-2 gap-2">
          {QUICK_ACTIONS.map((action) => (
            <Button
              key={action.id}
              variant="editor"
              size="sm"
              onClick={() => handleQuickAction(action.id)}
              className="justify-start text-xs h-8"
              aria-label={action.label}
            >
              <action.icon className="w-3 h-3 mr-1" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-3">
              <div className="flex-shrink-0">
                {message.type === 'user' ? (
                  <div className="p-2 bg-ai-message-user rounded-full">
                    <User className="w-3 h-3 text-white" />
                  </div>
                ) : (
                  <div className="p-2 bg-primary rounded-full">
                    <Bot className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="text-xs text-editor-line-number">
                  {message.type === 'user' ? 'You' : 'AI Assistant'} • {message.timestamp.toLocaleTimeString()}
                </div>
                <div className={`p-3 rounded-lg text-sm leading-relaxed ${
                  message.type === 'user' 
                    ? 'bg-ai-message-user text-white ml-8' 
                    : 'bg-ai-message-assistant text-editor-foreground'
                }`}>
                  <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3">
              <div className="p-2 bg-primary rounded-full">
                <Bot className="w-3 h-3 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-editor-line-number mb-1">AI Assistant • typing...</div>
                <div className="bg-ai-message-assistant p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-editor-line-number rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-editor-line-number rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-editor-line-number rounded-full animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-editor-border">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your code..."
            className="flex-1 bg-ai-input border-editor-border text-editor-foreground resize-none min-h-[2.5rem] max-h-32"
            aria-label="Message input"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
            variant="editor-primary"
            size="icon"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-editor-line-number mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </Card>
  );
}