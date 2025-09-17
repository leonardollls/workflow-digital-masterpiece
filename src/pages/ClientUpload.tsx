import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileUpload } from '@/components/ui/FileUpload';
import { supabase, uploadFile, uploadFileResumable, uploadLargeFileInParts } from '@/lib/supabase';
import { 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  FileText,
  User,
  Building,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface UploadFormData {
  clientName: string;
  clientCompany: string;
  projectDescription: string;
  notes: string;
}

interface UploadedFile {
  file: File;
  url?: string;
  uploading: boolean;
  error?: string;
  progress?: number; // Adicionar progresso para uploads resumíveis
}

const ClientUpload = () => {
  const [formData, setFormData] = useState<UploadFormData>({
    clientName: '',
    clientCompany: '',
    projectDescription: '',
    notes: ''
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (
    field: keyof UploadFormData,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelection = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      file,
      uploading: false,
      error: undefined
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFileToStorage = async (fileData: UploadedFile, index: number): Promise<string> => {
    const { file } = fileData;
    
    // Atualizar status para uploading
    setUploadedFiles(prev => prev.map((f, i) => 
      i === index ? { ...f, uploading: true, error: undefined, progress: 0 } : f
    ));

    try {
      const timestamp = Date.now();
      const sanitizedName = file.name
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .replace(/_{2,}/g, '_')
        .toLowerCase();
      
      const fileName = `${timestamp}_${sanitizedName}`;
      const filePath = `uploads/${fileName}`;

      console.log('📁 Iniciando upload:', { fileName, size: `${(file.size / 1024 / 1024).toFixed(2)}MB` });

      // Estratégia de upload baseada no tamanho do arquivo
      const fileSize = file.size;
      const fileSizeMB = fileSize / 1024 / 1024;
      let publicUrl: string;
      
      if (fileSize > 200 * 1024 * 1024) { // >200MB - Upload em partes
        console.log(`🔄 Arquivo muito grande detectado (${fileSizeMB.toFixed(2)}MB), usando upload em partes`);
        
        publicUrl = await uploadLargeFileInParts(
          file, 
          'client-uploads', 
          filePath,
          (bytesUploaded, bytesTotal) => {
            // Atualizar progresso
            const progress = Math.round((bytesUploaded / bytesTotal) * 100);
            setUploadedFiles(prev => prev.map((f, i) => 
              i === index ? { ...f, progress } : f
            ));
          }
        );
      } else if (fileSize > 50 * 1024 * 1024) { // 50-200MB - Upload resumível
        console.log(`📦 Arquivo grande detectado (${fileSizeMB.toFixed(2)}MB), usando upload resumível`);
        
        try {
          publicUrl = await uploadFileResumable(
            file, 
            'client-uploads', 
            filePath,
            (bytesUploaded, bytesTotal) => {
              // Atualizar progresso
              const progress = Math.round((bytesUploaded / bytesTotal) * 100);
              setUploadedFiles(prev => prev.map((f, i) => 
                i === index ? { ...f, progress } : f
              ));
            }
          );
        } catch (tusError) {
          console.log(`⚠️ TUS falhou, tentando upload em partes...`);
          // Fallback para upload em partes se TUS falhar
          publicUrl = await uploadLargeFileInParts(
            file, 
            'client-uploads', 
            filePath,
            (bytesUploaded, bytesTotal) => {
              const progress = Math.round((bytesUploaded / bytesTotal) * 100);
              setUploadedFiles(prev => prev.map((f, i) => 
                i === index ? { ...f, progress } : f
              ));
            }
          );
        }
      } else { // <50MB - Upload padrão
        console.log(`📄 Arquivo pequeno (${fileSizeMB.toFixed(2)}MB), usando upload padrão`);
        
        // Upload para o Supabase Storage
        await uploadFile(file, 'client-uploads', filePath);
        
        // Obter URL pública
        const { data } = supabase.storage
          .from('client-uploads')
          .getPublicUrl(filePath);
        
        publicUrl = data.publicUrl;
      }

      // Atualizar status para sucesso
      setUploadedFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, uploading: false, url: publicUrl, progress: 100 } : f
      ));

      console.log('✅ Upload concluído:', publicUrl);
      return publicUrl;

    } catch (error) {
      console.error('❌ Erro no upload:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      // Atualizar status para erro
      setUploadedFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, uploading: false, error: errorMessage, progress: 0 } : f
      ));

      throw error;
    }
  };

  const saveUploadRecord = async (file: File, fileUrl: string) => {
    const uploadRecord = {
      client_name: formData.clientName,
      client_email: null, // Campo removido do formulário
      client_company: formData.clientCompany || null,
      project_description: formData.projectDescription || null,
      file_name: file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase(),
      file_original_name: file.name,
      file_size: file.size,
      file_type: file.type,
      file_url: fileUrl,
      storage_bucket: 'client-uploads',
      storage_path: `uploads/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase()}`,
      upload_status: 'completed',
      notes: formData.notes || null
    };

    const { error } = await supabase
      .from('client_uploads')
      .insert(uploadRecord);

    if (error) {
      throw new Error(`Erro ao salvar registro: ${error.message}`);
    }

    console.log('✅ Registro salvo no banco de dados');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!formData.clientName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe seu nome completo.",
        variant: "destructive"
      });
      return;
    }

    if (uploadedFiles.length === 0) {
      toast({
        title: "Arquivos obrigatórios",
        description: "Por favor, selecione pelo menos um arquivo para upload.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      console.log('🚀 Iniciando processo de upload...', {
        cliente: formData.clientName,
        arquivos: uploadedFiles.length
      });

      // Upload todos os arquivos
      const uploadPromises = uploadedFiles.map((fileData, index) => 
        uploadFileToStorage(fileData, index)
      );

      const fileUrls = await Promise.all(uploadPromises);

      // Salvar registros no banco de dados
      const savePromises = uploadedFiles.map((fileData, index) => 
        saveUploadRecord(fileData.file, fileUrls[index])
      );

      await Promise.all(savePromises);

      console.log('✅ Todos os uploads foram concluídos com sucesso!');
      
      setSubmitSuccess(true);
      toast({
        title: "Upload realizado com sucesso!",
        description: `${uploadedFiles.length} arquivo(s) enviado(s). Nossa equipe analisará os arquivos.`,
        variant: "default"
      });

      // Limpar formulário
      setFormData({
        clientName: '',
        clientCompany: '',
        projectDescription: '',
        notes: ''
      });
      setUploadedFiles([]);

    } catch (error) {
      console.error('❌ Erro no processo de upload:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setSubmitError(errorMessage);
      
      toast({
        title: "Erro no upload",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Upload Concluído!
              </h2>
              <p className="text-gray-600 mb-6">
                Seus arquivos foram enviados com sucesso. Nossa equipe analisará os materiais e dará continuidade ao projeto.
              </p>
              <Button 
                onClick={() => {
                  setSubmitSuccess(false);
                  setSubmitError(null);
                }}
                className="w-full"
              >
                Enviar Novos Arquivos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          {/* Logo centralizada acima do título */}
          <div className="flex justify-center mb-6">
            <img 
              src="/Images/logo-workflow-sem-fundo.png" 
              alt="Workflow Services Logo" 
              className="h-40 w-auto max-w-xs"
            />
          </div>
          
          {/* Título e subtítulo */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload de Arquivos</h1>
            <p className="text-lg text-gray-600">Workflow Services</p>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Envie seus arquivos, materiais e documentos relacionados ao seu projeto. 
            Nossa equipe analisará e entrará em contato para dar continuidade ao desenvolvimento.
          </p>
        </div>

        {submitError && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700">
              {submitError}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="clientName">Nome Completo *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  placeholder="Seu nome completo"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="clientCompany">Empresa (Opcional)</Label>
                <Input
                  id="clientCompany"
                  value={formData.clientCompany}
                  onChange={(e) => handleInputChange('clientCompany', e.target.value)}
                  placeholder="Nome da sua empresa"
                />
              </div>
            </CardContent>
          </Card>

          {/* Informações do Projeto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Informações do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="projectDescription">Descrição do Projeto</Label>
                <Textarea
                  id="projectDescription"
                  value={formData.projectDescription}
                  onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                  placeholder="Descreva brevemente o que você precisa..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="notes">Observações Adicionais</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Alguma informação adicional que queira compartilhar..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Upload de Arquivos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Arquivos do Projeto *
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                id="project-files"
                accept="*/*"
                multiple={true}
                onChange={handleFileSelection}
                label="Selecione seus arquivos"
                description="Qualquer tipo de arquivo é aceito. Tamanho máximo: 1GB por arquivo."
                className="mb-6"
              />

              {/* Lista de arquivos selecionados */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">
                    Arquivos Selecionados ({uploadedFiles.length})
                  </h4>
                  <div className="space-y-2">
                    {uploadedFiles.map((fileData, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border"
                      >
                        <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {fileData.file.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        
                        {fileData.uploading && (
                          <div className="flex items-center gap-2">
                            {fileData.progress !== undefined && fileData.progress > 0 ? (
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-blue-500 transition-all duration-300"
                                    style={{ width: `${fileData.progress}%` }}
                                  />
                                </div>
                                <span className="text-xs text-blue-600 font-medium">
                                  {fileData.progress}%
                                </span>
                              </div>
                            ) : (
                              <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                            )}
                          </div>
                        )}
                        
                        {fileData.url && !fileData.uploading && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        
                        {fileData.error && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}

                        {!isSubmitting && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remover
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Botão de Envio */}
          <div className="text-center">
            <Button
              type="submit"
              disabled={isSubmitting || uploadedFiles.length === 0}
              className="px-8 py-3 text-lg min-w-48"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Enviar Arquivos
                </>
              )}
            </Button>
            
            {uploadedFiles.length > 0 && (
              <p className="text-sm text-gray-500 mt-3">
                {uploadedFiles.length} arquivo(s) selecionado(s)
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientUpload;
