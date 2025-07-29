import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Code2, FileText, Play, Download, Upload } from "lucide-react";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
];

interface CodeEditorProps {
  onCodeChange?: (code: string) => void;
  onLanguageChange?: (language: string) => void;
  onFormat?: () => void;
  onExplain?: () => void;
  onRun?: () => void;
}

export function CodeEditor({ 
  onCodeChange, 
  onLanguageChange, 
  onFormat, 
  onExplain,
  onRun 
}: CodeEditorProps) {
  const [code, setCode] = useState(`// Welcome to the Accessible AI Code Editor
// Type your code here...

function greetUser(name) {
  console.log(\`Hello, \${name}! Welcome to our accessible code editor.\`);
  return \`Greeting sent to \${name}\`;
}

greetUser("Developer");`);
  
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [lineNumbers, setLineNumbers] = useState(true);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    onLanguageChange?.(language);
  };

  const codeLines = code.split('\n');

  return (
    <div className="flex flex-col h-full bg-editor-background border border-editor-border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 bg-ai-background border-b border-editor-border">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-editor-foreground flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            Accessible AI Code Editor
          </h2>
          
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger 
              className="w-36 bg-editor-border border-editor-border text-editor-foreground"
              aria-label="Select programming language"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-ai-background border-editor-border">
              {LANGUAGES.map((lang) => (
                <SelectItem 
                  key={lang.value} 
                  value={lang.value}
                  className="text-editor-foreground hover:bg-editor-border focus:bg-editor-border"
                >
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="editor" 
            size="sm"
            onClick={onRun}
            aria-label="Run code"
          >
            <Play className="w-4 h-4" />
            Run
          </Button>
          <Button 
            variant="editor-primary" 
            size="sm"
            onClick={onFormat}
            aria-label="Format code"
          >
            <FileText className="w-4 h-4" />
            Format
          </Button>
          <Button 
            variant="editor-primary" 
            size="sm"
            onClick={onExplain}
            aria-label="Explain code with AI"
          >
            <Code2 className="w-4 h-4" />
            Explain Code
          </Button>
          <Button 
            variant="editor" 
            size="sm"
            aria-label="Upload file"
          >
            <Upload className="w-4 h-4" />
          </Button>
          <Button 
            variant="editor" 
            size="sm"
            aria-label="Download file"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Line Numbers */}
        {lineNumbers && (
          <div 
            className="flex flex-col bg-ai-background text-editor-line-number text-sm font-mono border-r border-editor-border py-4 px-3 min-w-[3rem] user-select-none"
            aria-hidden="true"
          >
            {codeLines.map((_, index) => (
              <div key={index} className="leading-6 text-right">
                {index + 1}
              </div>
            ))}
          </div>
        )}

        {/* Code Input */}
        <div className="flex-1 relative">
          <Textarea
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="w-full h-full bg-transparent border-0 text-editor-foreground font-mono text-sm leading-6 resize-none p-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset rounded-none"
            placeholder="Start typing your code..."
            spellCheck={false}
            aria-label="Code editor textarea"
            aria-describedby="editor-description"
          />
          <div id="editor-description" className="sr-only">
            Code editor for {selectedLanguage}. Use Tab to indent, Shift+Tab to outdent. 
            Press Ctrl+/ to toggle comments. Use the toolbar buttons to format or explain your code.
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-ai-background border-t border-editor-border text-sm text-editor-line-number">
        <div className="flex items-center gap-4">
          <span>Lines: {codeLines.length}</span>
          <span>Language: {LANGUAGES.find(l => l.value === selectedLanguage)?.label}</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLineNumbers(!lineNumbers)}
            className="hover:text-editor-foreground transition-colors"
            aria-label={`${lineNumbers ? 'Hide' : 'Show'} line numbers`}
          >
            Line Numbers: {lineNumbers ? 'On' : 'Off'}
          </button>
        </div>
      </div>
    </div>
  );
}