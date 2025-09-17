import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

  const handleDownload = () => {
    window.open(upload.file_url, '_blank');
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
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getFileTypeIcon(upload.file_type)}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate" title={upload.file_original_name}>
                {upload.file_original_name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {formatFileSize(upload.file_size)}
                </Badge>
                <Badge 
                  variant={upload.upload_status === 'completed' ? 'default' : 'destructive'} 
                  className="text-xs"
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
            <User className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-900">{upload.client_name}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-gray-500" />
            <a 
              href={`mailto:${upload.client_email}`}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              {upload.client_email}
            </a>
          </div>

          {upload.client_company && (
            <div className="flex items-center gap-2 text-sm">
              <Building className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">{upload.client_company}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{timeAgo}</span>
          </div>
        </div>

        {/* Descrição do Projeto (se houver) */}
        {upload.project_description && (
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-700 line-clamp-3">
              <strong>Projeto:</strong> {upload.project_description}
            </p>
          </div>
        )}

        {/* Observações (se houver) */}
        {upload.notes && (
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-700 line-clamp-2">
              <strong>Observações:</strong> {upload.notes}
            </p>
          </div>
        )}

        {/* Ações */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="flex-1 gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>

          <Dialog open={showDetails} onOpenChange={setShowDetails}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Eye className="w-4 h-4" />
                Detalhes
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="text-2xl">{getFileTypeIcon(upload.file_type)}</div>
                  Detalhes do Upload
                </DialogTitle>
                <DialogDescription>
                  Informações completas sobre o arquivo enviado
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Informações do Arquivo */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Arquivo
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium">Nome Original:</span>
                        <p className="text-gray-600 break-all">{upload.file_original_name}</p>
                      </div>
                      <div>
                        <span className="font-medium">Tamanho:</span>
                        <p className="text-gray-600">{formatFileSize(upload.file_size)}</p>
                      </div>
                      <div>
                        <span className="font-medium">Tipo:</span>
                        <p className="text-gray-600">{upload.file_type}</p>
                      </div>
                      <div>
                        <span className="font-medium">Status:</span>
                        <Badge variant={upload.upload_status === 'completed' ? 'default' : 'destructive'}>
                          {upload.upload_status === 'completed' ? 'Concluído' : upload.upload_status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informações do Cliente */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Cliente
                  </h4>
                  <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                    <div><strong>Nome:</strong> {upload.client_name}</div>
                    <div><strong>Email:</strong> {upload.client_email}</div>
                    {upload.client_company && (
                      <div><strong>Empresa:</strong> {upload.client_company}</div>
                    )}
                  </div>
                </div>

                {/* Projeto e Observações */}
                {(upload.project_description || upload.notes) && (
                  <div>
                    <h4 className="font-semibold mb-3">Informações do Projeto</h4>
                    <div className="space-y-3">
                      {upload.project_description && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <strong>Descrição do Projeto:</strong>
                          <p className="text-gray-700 mt-1">{upload.project_description}</p>
                        </div>
                      )}
                      {upload.notes && (
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <strong>Observações:</strong>
                          <p className="text-gray-700 mt-1">{upload.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Informações Técnicas */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <HardDrive className="w-4 h-4" />
                    Informações Técnicas
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                    <div><strong>ID do Upload:</strong> {upload.id}</div>
                    <div><strong>Bucket:</strong> {upload.storage_bucket}</div>
                    <div><strong>Caminho:</strong> {upload.storage_path}</div>
                    <div><strong>Upload:</strong> {new Date(upload.created_at).toLocaleString('pt-BR')}</div>
                    <div><strong>Atualização:</strong> {new Date(upload.updated_at).toLocaleString('pt-BR')}</div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-3">
                  <Button onClick={handleDownload} className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Abrir Arquivo
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
