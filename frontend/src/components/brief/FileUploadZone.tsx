import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadZoneProps {
  onFileUpload: (file: File) => void;
  onTextPaste: (text: string) => void;
  onClear: () => void;
  className?: string;
}

interface UploadedFile {
  file: File;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

const ACCEPTED_FILE_TYPES = {
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'text/plain': '.txt'
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileUpload,
  onTextPaste,
  onClear,
  className
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [activeTab, setActiveTab] = useState('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file type
    if (!Object.keys(ACCEPTED_FILE_TYPES).includes(file.type)) {
      return {
        isValid: false,
        error: `File type not supported. Please upload: ${Object.values(ACCEPTED_FILE_TYPES).join(', ')}`
      };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File size too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      };
    }

    return { isValid: true };
  };

  const handleFileUpload = useCallback((file: File) => {
    const validation = validateFile(file);
    
    if (!validation.isValid) {
      setUploadedFile({
        file,
        status: 'error',
        error: validation.error
      });
      return;
    }

    setUploadedFile({
      file,
      status: 'success'
    });
    onFileUpload(file);
  }, [onFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleTextPaste = () => {
    if (pastedText.trim()) {
      onTextPaste(pastedText.trim());
    }
  };

  const handleClear = () => {
    setUploadedFile(null);
    setPastedText('');
    onClear();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn("w-full", className)}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload File</TabsTrigger>
          <TabsTrigger value="paste">Paste Text</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                  isDragOver
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50",
                  uploadedFile && "border-green-500 bg-green-50"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {!uploadedFile ? (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Upload Project Brief
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Drag and drop your file here, or click to browse
                    </p>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-muted-foreground">
                        Supported formats: PDF, DOC, DOCX, TXT
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Maximum size: 10MB
                      </p>
                    </div>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-4"
                    >
                      Choose File
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={Object.values(ACCEPTED_FILE_TYPES).join(',')}
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      {uploadedFile.status === 'success' ? (
                        <CheckCircle className="h-12 w-12 text-green-500" />
                      ) : (
                        <AlertCircle className="h-12 w-12 text-red-500" />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">
                        {uploadedFile.status === 'success' ? 'File Uploaded Successfully' : 'Upload Failed'}
                      </h3>
                      
                      <div className="flex items-center justify-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{uploadedFile.file.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {formatFileSize(uploadedFile.file.size)}
                        </Badge>
                      </div>

                      {uploadedFile.error && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{uploadedFile.error}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={handleClear}
                        className="flex items-center space-x-2"
                      >
                        <X className="h-4 w-4" />
                        Remove File
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paste" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Paste Project Brief</h3>
                  <p className="text-muted-foreground mb-4">
                    Copy and paste your project brief text here
                  </p>
                </div>

                <Textarea
                  placeholder="Paste your project brief here...&#10;&#10;Example:&#10;We need a modern e-commerce platform for our retail business. The platform should include:&#10;- User authentication and profiles&#10;- Product catalog with search and filtering&#10;- Shopping cart and checkout process&#10;- Payment integration&#10;- Admin dashboard for inventory management&#10;&#10;Budget: $50,000 - $100,000&#10;Timeline: 3-4 months"
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  className="min-h-[200px] resize-none"
                />

                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {pastedText.length} characters
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setPastedText('')}
                      disabled={!pastedText}
                    >
                      Clear
                    </Button>
                    <Button
                      onClick={handleTextPaste}
                      disabled={!pastedText.trim()}
                    >
                      Use This Text
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 