import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  MessageSquare,
  Plus,
  Search,
  FileText,
  Copy,
  Trash2,
  BarChart3,
  GitBranch,
  Layers,
  MessageCircle,
  ExternalLink,
  Download,
  Upload,
  Filter,
  SortAsc,
  X,
  FileJson
} from 'lucide-react'
import type { WhatsAppScript, ScriptStats } from '@/types/scripts'
import {
  getScripts,
  createScript,
  deleteScript,
  duplicateScript,
  getScriptStats,
  getMessagesByScript,
  exportScript,
  importScript,
  ScriptExportData
} from '@/services/scriptsService'
import { ScriptMindMap } from './ScriptMindMap'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'

interface Category {
  id: string
  name: string
  color: string
}

type SortOption = 'newest' | 'oldest' | 'name' | 'messages'

export const WhatsAppScriptsDashboard = () => {
  const [scripts, setScripts] = useState<WhatsAppScript[]>([])
  const [stats, setStats] = useState<ScriptStats | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedScript, setSelectedScript] = useState<WhatsAppScript | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [newScriptName, setNewScriptName] = useState('')
  const [newScriptDescription, setNewScriptDescription] = useState('')
  const [newScriptCategory, setNewScriptCategory] = useState<string>('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [showFilters, setShowFilters] = useState(false)
  
  // Import - suporta múltiplos formatos
  const [importData, setImportData] = useState<any>(null)
  const [importFormat, setImportFormat] = useState<'standard' | 'playbook' | null>(null)
  const [importName, setImportName] = useState('')
  const [importMessageCount, setImportMessageCount] = useState(0)
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [scriptsData, statsData, categoriesData] = await Promise.all([
        getScripts(true),
        getScriptStats(),
        supabase.from('categories').select('id, name, color').order('name')
      ])
      setScripts(scriptsData)
      setStats(statsData)
      setCategories(categoriesData.data || [])
      setError(null)
    } catch (err: any) {
      console.error('Erro ao carregar dados:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateScript = async () => {
    if (!newScriptName.trim()) return
    
    try {
      setCreating(true)
      const newScript = await createScript({
        name: newScriptName.trim(),
        description: newScriptDescription.trim() || undefined,
        category_id: newScriptCategory || undefined,
        is_template: true
      })
      
      setScripts(prev => [newScript, ...prev])
      setNewScriptName('')
      setNewScriptDescription('')
      setNewScriptCategory('')
      setShowCreateDialog(false)
      setSelectedScript(newScript)
    } catch (err: any) {
      console.error('Erro ao criar script:', err)
      alert('Erro ao criar script: ' + err.message)
    } finally {
      setCreating(false)
    }
  }

  const handleDuplicateScript = async (script: WhatsAppScript) => {
    try {
      const newScript = await duplicateScript(script.id, `${script.name} (Cópia)`)
      setScripts(prev => [newScript, ...prev])
    } catch (err: any) {
      console.error('Erro ao duplicar script:', err)
      alert('Erro ao duplicar script: ' + err.message)
    }
  }

  const handleDeleteScript = async (scriptId: string) => {
    try {
      await deleteScript(scriptId)
      setScripts(prev => prev.filter(s => s.id !== scriptId))
      if (selectedScript?.id === scriptId) {
        setSelectedScript(null)
      }
    } catch (err: any) {
      console.error('Erro ao deletar script:', err)
      alert('Erro ao deletar script: ' + err.message)
    }
  }

  const handleExportScript = async (script: WhatsAppScript) => {
    try {
      const data = await exportScript(script.id)
      const jsonString = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `script-${script.name.toLowerCase().replace(/\s+/g, '-')}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err: any) {
      console.error('Erro ao exportar script:', err)
      alert('Erro ao exportar script: ' + err.message)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        
        // Detectar formato: Playbook (nodes array) ou Standard (version + script + messages)
        if (data.playbook_title && Array.isArray(data.nodes)) {
          // Formato Playbook
          setImportFormat('playbook')
          setImportData(data)
          setImportName(data.playbook_title)
          setImportMessageCount(data.nodes.length)
          setShowImportDialog(true)
        } else if (data.version && data.script && Array.isArray(data.messages)) {
          // Formato Standard
          setImportFormat('standard')
          setImportData(data)
          setImportName(data.script.name)
          setImportMessageCount(data.messages.length)
          setShowImportDialog(true)
        } else {
          throw new Error('Formato não reconhecido')
        }
      } catch (err) {
        alert('Arquivo inválido. Use o formato padrão do sistema ou o formato Playbook (com playbook_title e nodes).')
      }
    }
    reader.readAsText(file)
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleImport = async () => {
    if (!importData) return

    try {
      setImporting(true)
      const newScript = await importScript(importData, importName)
      setScripts(prev => [newScript, ...prev])
      setShowImportDialog(false)
      setImportData(null)
      setImportName('')
      alert('Script importado com sucesso!')
    } catch (err: any) {
      console.error('Erro ao importar script:', err)
      alert('Erro ao importar script: ' + err.message)
    } finally {
      setImporting(false)
    }
  }

  // Filter and sort scripts
  const filteredScripts = scripts
    .filter(script => {
      const matchesSearch = script.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        script.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || 
        script.category_id === categoryFilter ||
        (categoryFilter === 'none' && !script.category_id)
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
        case 'name':
          return a.name.localeCompare(b.name)
        case 'newest':
        default:
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      }
    })

  const clearFilters = () => {
    setSearchTerm('')
    setCategoryFilter('all')
    setSortBy('newest')
  }

  const hasActiveFilters = searchTerm || categoryFilter !== 'all' || sortBy !== 'newest'

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (selectedScript) {
    return (
      <ScriptMindMap
        script={selectedScript}
        onBack={() => {
          setSelectedScript(null)
          loadData()
        }}
        onUpdate={(updatedScript) => {
          setScripts(prev => prev.map(s => s.id === updatedScript.id ? updatedScript : s))
          setSelectedScript(updatedScript)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-green-500" />
            Scripts de WhatsApp
          </h2>
          <p className="text-slate-400 mt-1">
            Crie e gerencie fluxos de mensagens para abordagem de clientes
          </p>
        </div>
        <div className="flex gap-2">
          {/* Import Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="gap-2 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
          >
            <Upload className="w-4 h-4" />
            Importar
          </Button>
          
          {/* Create Button */}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4" />
                Novo Script
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-white">Criar Novo Script</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="script-name" className="text-slate-300">Nome do Script</Label>
                  <Input
                    id="script-name"
                    value={newScriptName}
                    onChange={(e) => setNewScriptName(e.target.value)}
                    placeholder="Ex: Abordagem Clínicas de Saúde"
                    className="mt-1 bg-slate-800 border-slate-700 text-slate-200"
                  />
                </div>
                <div>
                  <Label htmlFor="script-category" className="text-slate-300">Categoria (opcional)</Label>
                  <Select value={newScriptCategory} onValueChange={setNewScriptCategory}>
                    <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-slate-200">
                      <SelectValue placeholder="Selecione uma categoria..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="none" className="text-slate-200">Sem categoria</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id} className="text-slate-200">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: cat.color }}
                            />
                            {cat.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="script-description" className="text-slate-300">Descrição (opcional)</Label>
                  <Textarea
                    id="script-description"
                    value={newScriptDescription}
                    onChange={(e) => setNewScriptDescription(e.target.value)}
                    placeholder="Descreva o objetivo deste script..."
                    className="mt-1 bg-slate-800 border-slate-700 text-slate-200"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                    className="bg-slate-800 border-slate-700 text-slate-300"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreateScript}
                    disabled={creating || !newScriptName.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {creating ? 'Criando...' : 'Criar Script'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <FileJson className="w-5 h-5 text-green-500" />
              Importar Script
            </DialogTitle>
          </DialogHeader>
          {importData && (
            <div className="space-y-4 pt-4">
              <div className="p-3 bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm text-slate-400">Arquivo detectado:</p>
                  <Badge 
                    variant="outline" 
                    className={importFormat === 'playbook' ? 'border-purple-500 text-purple-400' : 'border-green-500 text-green-400'}
                  >
                    {importFormat === 'playbook' ? 'Formato Playbook' : 'Formato Padrão'}
                  </Badge>
                </div>
                <p className="text-white font-medium">{importName}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {importMessageCount} mensagens
                  {importFormat === 'standard' && importData.exportedAt && (
                    <> • Exportado em {new Date(importData.exportedAt).toLocaleDateString('pt-BR')}</>
                  )}
                </p>
              </div>
              <div>
                <Label className="text-slate-300">Nome do Script (pode alterar)</Label>
                <Input
                  value={importName}
                  onChange={(e) => setImportName(e.target.value)}
                  className="mt-1 bg-slate-800 border-slate-700 text-slate-200"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowImportDialog(false)
                    setImportData(null)
                    setImportFormat(null)
                  }}
                  className="bg-slate-800 border-slate-700 text-slate-300"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={importing || !importName.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {importing ? 'Importando...' : 'Importar Script'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Total de Scripts</CardTitle>
              <FileText className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.total_scripts}</div>
              <p className="text-xs text-slate-400">{stats.total_templates} templates</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Atribuições</CardTitle>
              <GitBranch className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{stats.total_assignments}</div>
              <p className="text-xs text-slate-400">scripts em uso</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Mais Usado</CardTitle>
              <BarChart3 className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-white truncate">
                {stats.most_used_scripts[0]?.script_name || 'Nenhum'}
              </div>
              <p className="text-xs text-slate-400">
                {stats.most_used_scripts[0]?.usage_count || 0} usos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Categorias</CardTitle>
              <Layers className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">
                {stats.scripts_by_category.length}
              </div>
              <p className="text-xs text-slate-400">categorias com scripts</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
                <Input
                  placeholder="Buscar scripts por nome ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`gap-2 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 ${showFilters ? 'border-green-500' : ''}`}
              >
                <Filter className="w-4 h-4" />
                Filtros
                {hasActiveFilters && (
                  <Badge className="bg-green-600 text-white text-xs ml-1">!</Badge>
                )}
              </Button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="flex flex-wrap gap-4 p-4 bg-slate-800/50 rounded-lg">
                {/* Category Filter */}
                <div className="flex-1 min-w-[200px]">
                  <Label className="text-xs text-slate-400 mb-1 block">Categoria</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="all" className="text-slate-200">Todas as categorias</SelectItem>
                      <SelectItem value="none" className="text-slate-200">Sem categoria</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id} className="text-slate-200">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: cat.color }}
                            />
                            {cat.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort Options */}
                <div className="flex-1 min-w-[200px]">
                  <Label className="text-xs text-slate-400 mb-1 block">Ordenar por</Label>
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="newest" className="text-slate-200">
                        <div className="flex items-center gap-2">
                          <SortAsc className="w-4 h-4" />
                          Mais recentes
                        </div>
                      </SelectItem>
                      <SelectItem value="oldest" className="text-slate-200">
                        <div className="flex items-center gap-2">
                          <SortAsc className="w-4 h-4 rotate-180" />
                          Mais antigos
                        </div>
                      </SelectItem>
                      <SelectItem value="name" className="text-slate-200">
                        <div className="flex items-center gap-2">
                          <SortAsc className="w-4 h-4" />
                          Nome (A-Z)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <div className="flex items-end">
                    <Button
                      variant="ghost"
                      onClick={clearFilters}
                      className="gap-2 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                      Limpar filtros
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Active Filters Summary */}
            {hasActiveFilters && !showFilters && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span>Filtros ativos:</span>
                {searchTerm && (
                  <Badge variant="outline" className="border-slate-600">
                    Busca: "{searchTerm}"
                  </Badge>
                )}
                {categoryFilter !== 'all' && (
                  <Badge variant="outline" className="border-slate-600">
                    Categoria: {categoryFilter === 'none' ? 'Sem categoria' : categories.find(c => c.id === categoryFilter)?.name}
                  </Badge>
                )}
                {sortBy !== 'newest' && (
                  <Badge variant="outline" className="border-slate-600">
                    Ordenação: {sortBy === 'oldest' ? 'Mais antigos' : 'Nome'}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-6 px-2 text-xs text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3 mr-1" />
                  Limpar
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Scripts Grid */}
      {error ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="text-center py-8">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={loadData} variant="outline" className="bg-slate-800 border-slate-700 text-slate-300">
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      ) : filteredScripts.length === 0 ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              {scripts.length === 0 ? 'Nenhum script criado' : 'Nenhum script encontrado'}
            </h3>
            <p className="text-slate-400 mb-6">
              {scripts.length === 0
                ? 'Comece criando seu primeiro script de WhatsApp para abordagem de clientes.'
                : 'Tente ajustar sua busca ou filtros para encontrar scripts.'}
            </p>
            {scripts.length === 0 && (
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
                Criar Primeiro Script
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredScripts.map(script => (
            <ScriptCard
              key={script.id}
              script={script}
              onOpen={() => setSelectedScript(script)}
              onDuplicate={() => handleDuplicateScript(script)}
              onDelete={() => handleDeleteScript(script.id)}
              onExport={() => handleExportScript(script)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface ScriptCardProps {
  script: WhatsAppScript
  onOpen: () => void
  onDuplicate: () => void
  onDelete: () => void
  onExport: () => void
}

const ScriptCard = ({ script, onOpen, onDuplicate, onDelete, onExport }: ScriptCardProps) => {
  const [messageCount, setMessageCount] = useState<number>(0)

  useEffect(() => {
    const loadCount = async () => {
      try {
        const messages = await getMessagesByScript(script.id)
        setMessageCount(messages.length)
      } catch {
        setMessageCount(0)
      }
    }
    loadCount()
  }, [script.id])

  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-green-600/50 transition-colors group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-500" />
              {script.name}
            </CardTitle>
            {script.description && (
              <CardDescription className="text-slate-400 text-sm line-clamp-2">
                {script.description}
              </CardDescription>
            )}
          </div>
          {script.is_template && (
            <Badge variant="secondary" className="bg-green-900/50 text-green-400 text-xs">
              Template
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-slate-400">
            <MessageCircle className="w-4 h-4" />
            <span>{messageCount} mensagens</span>
          </div>
          {script.category && (
            <Badge
              variant="outline"
              style={{ borderColor: script.category.color, color: script.category.color }}
              className="text-xs"
            >
              {script.category.name}
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onOpen}
            className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
          >
            <ExternalLink className="w-4 h-4" />
            Abrir
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onExport}
            className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            title="Exportar"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onDuplicate}
            className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            title="Duplicar"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="bg-slate-800 border-slate-700 text-red-400 hover:bg-red-900/30 hover:text-red-300"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-900 border-slate-800">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Excluir Script</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  Tem certeza que deseja excluir o script "{script.name}"? 
                  Esta ação não pode ser desfeita e todas as mensagens serão perdidas.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <p className="text-xs text-slate-500">
          Criado em {script.created_at ? new Date(script.created_at).toLocaleDateString('pt-BR') : 'N/A'}
        </p>
      </CardContent>
    </Card>
  )
}

export default WhatsAppScriptsDashboard
