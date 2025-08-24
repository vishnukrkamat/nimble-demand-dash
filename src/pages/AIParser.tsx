import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Upload, 
  FileText,
  Sparkles,
  Check,
  AlertCircle,
  Download,
  Zap
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ParsedData {
  id: string;
  type: string;
  content: any;
  confidence: number;
  timestamp: string;
}

export default function AIParser() {
  const [inputText, setInputText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedData[]>([]);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      toast({
        title: "File uploaded",
        description: `${selectedFile.name} is ready for processing`,
      });
    }
  };

  const handleParseText = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to parse",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Call Gemini API through edge function
      const { data, error } = await supabase.functions.invoke('ai-parser', {
        body: { 
          text: inputText,
          type: 'text_analysis'
        }
      });

      if (error) throw error;

      const newParsedData: ParsedData = {
        id: Date.now().toString(),
        type: 'Text Analysis',
        content: data.analysis,
        confidence: data.confidence || 85,
        timestamp: new Date().toISOString()
      };

      setParsedData(prev => [newParsedData, ...prev]);
      
      toast({
        title: "Success",
        description: "Text parsed successfully with AI",
      });
    } catch (error) {
      console.error('Error parsing text:', error);
      toast({
        title: "Error",
        description: "Failed to parse text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleParseFile = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to parse",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Convert file to base64 or handle file upload
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileContent = e.target?.result as string;
        
        const { data, error } = await supabase.functions.invoke('ai-parser', {
          body: { 
            text: fileContent,
            type: 'file_analysis',
            fileName: file.name,
            fileType: file.type
          }
        });

        if (error) throw error;

        const newParsedData: ParsedData = {
          id: Date.now().toString(),
          type: 'File Analysis',
          content: data.analysis,
          confidence: data.confidence || 80,
          timestamp: new Date().toISOString()
        };

        setParsedData(prev => [newParsedData, ...prev]);
        
        toast({
          title: "Success",
          description: `${file.name} parsed successfully`,
        });
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Error parsing file:', error);
      toast({
        title: "Error",
        description: "Failed to parse file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "success";
    if (confidence >= 70) return "warning";
    return "destructive";
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="space-y-6 animate-fade-up">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  AI Document Parser
                </h1>
                <p className="text-muted-foreground mt-1">
                  Extract structured data from text and documents using AI
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Zap className="h-3 w-3" />
                  <span>Powered by Gemini</span>
                </Badge>
              </div>
            </div>

            {/* Input Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Text Input */}
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>Text Input</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Enter text to parse (invoices, receipts, reports, etc.)"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                  <Button 
                    onClick={handleParseText}
                    disabled={loading || !inputText.trim()}
                    className="w-full"
                    variant="gradient"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    {loading ? "Processing..." : "Parse Text"}
                  </Button>
                </CardContent>
              </Card>

              {/* File Upload */}
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="h-5 w-5 text-primary" />
                    <span>File Upload</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <Input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".txt,.pdf,.doc,.docx,.csv"
                      className="hidden"
                      id="file-upload"
                    />
                    <label 
                      htmlFor="file-upload" 
                      className="cursor-pointer text-primary hover:text-primary/80"
                    >
                      Click to upload file
                    </label>
                    <p className="text-sm text-muted-foreground mt-2">
                      Supports TXT, PDF, DOC, CSV files
                    </p>
                    {file && (
                      <div className="mt-4 p-2 bg-primary/10 rounded-lg">
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    )}
                  </div>
                  <Button 
                    onClick={handleParseFile}
                    disabled={loading || !file}
                    className="w-full"
                    variant="gradient"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {loading ? "Processing..." : "Parse File"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <span>Parsed Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {parsedData.length === 0 ? (
                  <div className="text-center py-12">
                    <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No parsed data yet</h3>
                    <p className="text-muted-foreground">
                      Upload a file or enter text above to see AI-powered parsing results
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {parsedData.map((item) => (
                      <Card key={item.id} className="card-metric">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Check className="h-4 w-4 text-success" />
                              <span className="font-medium">{item.type}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={getConfidenceColor(item.confidence) as any}>
                                {item.confidence}% confidence
                              </Badge>
                              <Button size="sm" variant="outline">
                                <Download className="h-3 w-3 mr-1" />
                                Export
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-muted/30 rounded-lg p-4">
                            <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-64">
                              {typeof item.content === 'string' 
                                ? item.content 
                                : JSON.stringify(item.content, null, 2)
                              }
                            </pre>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Parsed on {new Date(item.timestamp).toLocaleString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}