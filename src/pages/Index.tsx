import { useState } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { AIAssistant } from "@/components/AIAssistant";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [currentCode, setCurrentCode] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState("javascript");

  const handleCodeChange = (code: string) => {
    setCurrentCode(code);
  };

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
  };

  const handleFormat = () => {
    toast({
      title: "Code Formatted",
      description: "Your code has been formatted according to best practices.",
    });
  };

  const handleExplain = () => {
    toast({
      title: "AI Explanation",
      description: "The AI assistant will explain your code in detail.",
    });
  };

  const handleRun = () => {
    toast({
      title: "Code Execution",
      description: `Running ${currentLanguage} code...`,
    });
  };

  return (
    <div className="min-h-screen bg-editor-background text-editor-foreground">
      <div className="flex h-screen">
        {/* Code Editor Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          <CodeEditor
            onCodeChange={handleCodeChange}
            onLanguageChange={handleLanguageChange}
            onFormat={handleFormat}
            onExplain={handleExplain}
            onRun={handleRun}
          />
        </div>

        {/* AI Assistant Panel */}
        <div className="w-96 border-l border-editor-border bg-ai-background">
          <AIAssistant 
            code={currentCode}
            language={currentLanguage}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
