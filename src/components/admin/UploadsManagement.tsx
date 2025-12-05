import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import UploadCard from './UploadCard';
import {
  Upload,
  Search,
  Filter,
  Download,
  Users,
  HardDrive,
  FileText,
  Calendar,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

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

const UploadsManagement = () => {
  const [uploads, setUploads] = useState<ClientUpload[]>([]);
  const [filteredUploads, setFilteredUploads] = useState<ClientUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    loadUploads();
  }, []);

  useEffect(() => {
    filterUploads();
  }, [uploads, searchTerm, fileTypeFilter, statusFilter, dateFilter]);

  const loadUploads = async () => {
    try {
      console.log('🔄 Carregando uploads dos clientes...');
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('client_uploads')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(`Erro ao carregar uploads: ${fetchError.message}`);
      }

      console.log('✅ Uploads carregados:', data?.length || 0);
      setUploads(data || []);
    } catch (err) {
      console.error('❌ Erro ao carregar uploads:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const filterUploads = () => {
    let filtered = uploads;

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(upload =>
        upload.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upload.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upload.file_original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upload.client_company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upload.project_description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por tipo de arquivo
    if (fileTypeFilter !== 'all') {
      filtered = filtered.filter(upload => {
        const fileType = upload.file_type.toLowerCase();
        switch (fileTypeFilter) {
          case 'images':
            return fileType.startsWith('image/');
          case 'documents':
            return fileType.includes('pdf') || 
                   fileType.includes('word') || 
                   fileType.includes('document') ||
                   fileType.includes('text');
          case 'videos':
            return fileType.startsWith('video/');
          case 'others':
            return !fileType.startsWith('image/') && 
                   !fileType.startsWith('video/') &&
                   !fileType.includes('pdf') &&
                   !fileType.includes('word') &&
                   !fileType.includes('document');
          default:
            return true;
        }
      });
    }

    // Filtro por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(upload => upload.upload_status === statusFilter);
    }

    // Filtro por data
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(upload => 
            new Date(upload.created_at) >= filterDate
          );
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(upload => 
            new Date(upload.created_at) >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(upload => 
            new Date(upload.created_at) >= filterDate
          );
          break;
      }
    }

    setFilteredUploads(filtered);
  };

  const handleDeleteUpload = async (uploadId: string) => {
    try {
      console.log('🗑️ Excluindo upload:', uploadId);
      
      const { error } = await supabase
        .from('client_uploads')
        .delete()
        .eq('id', uploadId);

      if (error) {
        throw new Error(`Erro ao excluir upload: ${error.message}`);
      }

      // Remover do estado local
      setUploads(prev => prev.filter(upload => upload.id !== uploadId));
      console.log('✅ Upload excluído com sucesso');
    } catch (err) {
      console.error('❌ Erro ao excluir upload:', err);
      alert(`Erro ao excluir upload: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }
  };

  const getStats = () => {
    const totalUploads = uploads.length;
    const totalClients = new Set(uploads.map(u => u.client_email)).size;
    const totalSize = uploads.reduce((sum, upload) => sum + upload.file_size, 0);
    const completedUploads = uploads.filter(u => u.upload_status === 'completed').length;

    return {
      totalUploads,
      totalClients,
      totalSize: (totalSize / 1024 / 1024).toFixed(2), // MB
      completedUploads
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-slate-400">Carregando uploads...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Erro ao Carregar</h3>
          <p className="text-slate-400 mb-4">{error}</p>
          <Button onClick={loadUploads} className="bg-purple-600 hover:bg-purple-700">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total de Uploads</CardTitle>
            <Upload className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalUploads}</div>
            <p className="text-xs text-slate-400">
              {stats.completedUploads} concluídos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Clientes</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalClients}</div>
            <p className="text-xs text-slate-400">
              Únicos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Armazenamento</CardTitle>
            <HardDrive className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalSize} MB</div>
            <p className="text-xs text-slate-400">
              Total usado
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Taxa de Sucesso</CardTitle>
            <FileText className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">
              {stats.totalUploads > 0 ? 
                Math.round((stats.completedUploads / stats.totalUploads) * 100) : 0}%
            </div>
            <p className="text-xs text-slate-400">
              Uploads bem-sucedidos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-200">
            <Filter className="w-5 h-5" />
            Filtros de Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
              <Input
                placeholder="Buscar por cliente, arquivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
              />
            </div>

            <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                <SelectValue placeholder="Tipo de arquivo" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-slate-200 focus:bg-slate-700 focus:text-white">Todos os tipos</SelectItem>
                <SelectItem value="images" className="text-slate-200 focus:bg-slate-700 focus:text-white">Imagens</SelectItem>
                <SelectItem value="documents" className="text-slate-200 focus:bg-slate-700 focus:text-white">Documentos</SelectItem>
                <SelectItem value="videos" className="text-slate-200 focus:bg-slate-700 focus:text-white">Vídeos</SelectItem>
                <SelectItem value="others" className="text-slate-200 focus:bg-slate-700 focus:text-white">Outros</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-slate-200 focus:bg-slate-700 focus:text-white">Todos os status</SelectItem>
                <SelectItem value="completed" className="text-slate-200 focus:bg-slate-700 focus:text-white">Concluído</SelectItem>
                <SelectItem value="processing" className="text-slate-200 focus:bg-slate-700 focus:text-white">Processando</SelectItem>
                <SelectItem value="failed" className="text-slate-200 focus:bg-slate-700 focus:text-white">Falhou</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-slate-200 focus:bg-slate-700 focus:text-white">Todos os períodos</SelectItem>
                <SelectItem value="today" className="text-slate-200 focus:bg-slate-700 focus:text-white">Hoje</SelectItem>
                <SelectItem value="week" className="text-slate-200 focus:bg-slate-700 focus:text-white">Última semana</SelectItem>
                <SelectItem value="month" className="text-slate-200 focus:bg-slate-700 focus:text-white">Último mês</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Uploads */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          Uploads dos Clientes ({filteredUploads.length})
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadUploads} className="gap-2 border-slate-700 text-slate-300 hover:bg-slate-800">
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </Button>
          <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      {filteredUploads.length === 0 ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Upload className="w-12 h-12 text-slate-600 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              {uploads.length === 0 ? 'Nenhum upload encontrado' : 'Nenhum resultado nos filtros'}
            </h3>
            <p className="text-slate-400 text-center max-w-md">
              {uploads.length === 0
                ? 'Ainda não há uploads de clientes. Quando os clientes enviarem arquivos, eles aparecerão aqui.'
                : 'Nenhum upload corresponde aos filtros aplicados. Tente ajustar os critérios de busca.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUploads.map((upload) => (
            <UploadCard
              key={upload.id}
              upload={upload}
              onDelete={handleDeleteUpload}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadsManagement;
