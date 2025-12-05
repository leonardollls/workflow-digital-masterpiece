import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { downloadReconstructedFile, isMultipartFile } from '@/lib/supabase';
import { 
  FileText, 
  Download, 
  User, 
  Building, 
  Mail, 
  Calendar,
  HardDrive,
  ExternalLink,
  Trash2,
  Eye
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ClientUpload {
  id: string;
  client_name: string;
  client_email: string;
  client_company?: string;
  project_description?: string;
  file_name: string;
  file_original_name: string;
  file_size: number;
  file_type: string;
  file_url: string;
  storage_bucket: string;
  storage_path: string;
  upload_status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface UploadCardProps {
  upload: ClientUpload;
  onDelete: (uploadId: string) => void;
}

const UploadCard: React.FC<UploadCardProps> = ({ upload, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return '🖼️';
    } else if (fileType.startsWith('video/')) {
      return '🎥';
    } else if (fileType.includes('pdf')) {
      return '📄';
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return '📝';
    } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
      return '📊';
    } else {
      return '📎';
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // Verificar se é um arquivo dividido em partes
      const isMultipart = await isMultipartFile(upload.file_url);
      
      if (isMultipart) {
        console.log('📦 Detectado arquivo dividido, iniciando reconstrução...');
        await downloadReconstructedFile(upload.file_url);
      } else {
        console.log('📄 Arquivo simples, download direto...');
        window.open(upload.file_url, '_blank');
      }
    } catch (error) {
      console.error('❌ Erro no download:', error);
      alert('Erro ao baixar arquivo. Tente novamente.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir o arquivo "${upload.file_original_name}"?`)) {
      onDelete(upload.id);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(upload.created_at), {
    addSuffix: true,
    locale: ptBR
  });

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200 bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getFileTypeIcon(upload.file_type)}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate" title={upload.file_original_name}>
                {upload.file_original_name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                  {formatFileSize(upload.file_size)}
                </Badge>
                <Badge 
                  variant={upload.upload_status === 'completed' ? 'default' : 'destructive'} 
                  className={`text-xs ${upload.upload_status === 'completed' ? 'bg-emerald-900/50 text-emerald-400' : ''}`}
                >
                  {upload.upload_status === 'completed' ? 'Concluído' : upload.upload_status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Informações do Cliente */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-slate-500" />
            <span className="font-medium text-slate-200">{upload.client_name}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-slate-500" />
            <a 
              href={`mailto:${upload.client_email}`}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              {upload.client_email}
            </a>
          </div>

          {upload.client_company && (
            <div className="flex items-center gap-2 text-sm">
              <Building className="w-4 h-4 text-slate-500" />
              <span className="text-slate-400">{upload.client_company}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-slate-400">{timeAgo}</span>
          </div>
        </div>

        {/* Descrição do Projeto (se houver) */}
        {upload.project_description && (
          <div className="bg-slate-800 p-3 rounded-md">
            <p className="text-sm text-slate-300 line-clamp-3">
              <strong className="text-slate-200">Projeto:</strong> {upload.project_description}
            </p>
          </div>
        )}

        {/* Observações (se houver) */}
        {upload.notes && (
          <div className="bg-blue-900/30 p-3 rounded-md border border-blue-800">
            <p className="text-sm text-blue-300 line-clamp-2">
              <strong className="text-blue-200">Observações:</strong> {upload.notes}
            </p>
          </div>
        )}

        {/* Ações */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 gap-2 border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-500 border-t-blue-400 rounded-full animate-spin" />
                Baixando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download
              </>
            )}
          </Button>

          <Dialog open={showDetails} onOpenChange={setShowDetails}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 border-slate-700 text-slate-300 hover:bg-slate-800">
                <Eye className="w-4 h-4" />
                Detalhes
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-slate-900 border-slate-800">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-white">
                  <div className="text-2xl">{getFileTypeIcon(upload.file_type)}</div>
                  Detalhes do Upload
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  Informações completas sobre o arquivo enviado
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Informações do Arquivo */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-slate-200">
                    <FileText className="w-4 h-4" />
                    Arquivo
                  </h4>
                  <div className="bg-slate-800 p-4 rounded-lg space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium text-slate-300">Nome Original:</span>
                        <p className="text-slate-400 break-all">{upload.file_original_name}</p>
                      </div>
                      <div>
                        <span className="font-medium text-slate-300">Tamanho:</span>
                        <p className="text-slate-400">{formatFileSize(upload.file_size)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-slate-300">Tipo:</span>
                        <p className="text-slate-400">{upload.file_type}</p>
                      </div>
                      <div>
                        <span className="font-medium text-slate-300">Status:</span>
                        <Badge variant={upload.upload_status === 'completed' ? 'default' : 'destructive'} className={upload.upload_status === 'completed' ? 'bg-emerald-900/50 text-emerald-400' : ''}>
                          {upload.upload_status === 'completed' ? 'Concluído' : upload.upload_status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informações do Cliente */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-slate-200">
                    <User className="w-4 h-4" />
                    Cliente
                  </h4>
                  <div className="bg-blue-900/30 p-4 rounded-lg space-y-2 border border-blue-800">
                    <div className="text-slate-300"><strong className="text-slate-200">Nome:</strong> {upload.client_name}</div>
                    <div className="text-slate-300"><strong className="text-slate-200">Email:</strong> {upload.client_email}</div>
                    {upload.client_company && (
                      <div className="text-slate-300"><strong className="text-slate-200">Empresa:</strong> {upload.client_company}</div>
                    )}
                  </div>
                </div>

                {/* Projeto e Observações */}
                {(upload.project_description || upload.notes) && (
                  <div>
                    <h4 className="font-semibold mb-3 text-slate-200">Informações do Projeto</h4>
                    <div className="space-y-3">
                      {upload.project_description && (
                        <div className="bg-slate-800 p-4 rounded-lg">
                          <strong className="text-slate-200">Descrição do Projeto:</strong>
                          <p className="text-slate-400 mt-1">{upload.project_description}</p>
                        </div>
                      )}
                      {upload.notes && (
                        <div className="bg-amber-900/30 p-4 rounded-lg border border-amber-800">
                          <strong className="text-amber-200">Observações:</strong>
                          <p className="text-amber-300/80 mt-1">{upload.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Informações Técnicas */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-slate-200">
                    <HardDrive className="w-4 h-4" />
                    Informações Técnicas
                  </h4>
                  <div className="bg-slate-800 p-4 rounded-lg space-y-2 text-sm">
                    <div className="text-slate-400"><strong className="text-slate-300">ID do Upload:</strong> {upload.id}</div>
                    <div className="text-slate-400"><strong className="text-slate-300">Bucket:</strong> {upload.storage_bucket}</div>
                    <div className="text-slate-400"><strong className="text-slate-300">Caminho:</strong> {upload.storage_path}</div>
                    <div className="text-slate-400"><strong className="text-slate-300">Upload:</strong> {new Date(upload.created_at).toLocaleString('pt-BR')}</div>
                    <div className="text-slate-400"><strong className="text-slate-300">Atualização:</strong> {new Date(upload.updated_at).toLocaleString('pt-BR')}</div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-3">
                  <Button 
                    onClick={handleDownload} 
                    disabled={isDownloading}
                    className="gap-2 bg-purple-600 hover:bg-purple-700"
                  >
                    {isDownloading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-500 border-t-purple-400 rounded-full animate-spin" />
                        Baixando...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4" />
                        Baixar Arquivo
                      </>
                    )}
                  </Button>
                  <Button variant="destructive" onClick={handleDelete} className="gap-2">
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadCard;
