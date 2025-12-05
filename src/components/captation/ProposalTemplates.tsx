import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit2, 
  Loader2,
  Copy,
  Check,
  Star
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Category } from '@/types/captation'

interface ProposalTemplate {
  id: string
  category_id: string | null
  name: string
  content: string
  is_default: boolean
  created_at: string
  category?: Category
}

interface ProposalTemplatesProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
}

export const ProposalTemplates = ({ open, onOpenChange, categories }: ProposalTemplatesProps) => {
  const [templates, setTemplates] = useState<ProposalTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<ProposalTemplate | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    category_id: 'all',
    is_default: false
  })

  useEffect(() => {
    if (open) {
      loadTemplates()
    }
  }, [open])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('proposal_templates')
        .select(`
          *,
          category:categories(*)
        `)
        .order('is_default', { ascending: false })
        .order('name')

      if (error) throw error
      setTemplates(data || [])
    } catch (error) {
      console.error('Erro ao carregar templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.content.trim()) return

    try {
      setSaving(true)
      
      const templateData = {
        name: formData.name.trim(),
        content: formData.content.trim(),
        category_id: formData.category_id === 'all' ? null : formData.category_id,
        is_default: formData.is_default
      }

      if (editingTemplate) {
        const { error } = await supabase
          .from('proposal_templates')
          .update({ ...templateData, updated_at: new Date().toISOString() })
          .eq('id', editingTemplate.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('proposal_templates')
          .insert(templateData)

        if (error) throw error
      }

      // Reset form
      setFormData({ name: '', content: '', category_id: 'all', is_default: false })
      setEditingTemplate(null)
      await loadTemplates()
    } catch (error) {
      console.error('Erro ao salvar template:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este template?')) return

    try {
      const { error } = await supabase
        .from('proposal_templates')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadTemplates()
    } catch (error) {
      console.error('Erro ao deletar template:', error)
    }
  }

  const handleEdit = (template: ProposalTemplate) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      content: template.content,
      category_id: template.category_id || 'all',
      is_default: template.is_default
    })
  }

  const handleCopy = async (template: ProposalTemplate) => {
    try {
      await navigator.clipboard.writeText(template.content)
      setCopiedId(template.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Erro ao copiar:', error)
    }
  }

  const cancelEdit = () => {
    setEditingTemplate(null)
    setFormData({ name: '', content: '', category_id: 'all', is_default: false })
  }

  // Variáveis disponíveis para substituição
  const variables = [
    { key: '{nome_empresa}', label: 'Nome da Empresa' },
    { key: '{cidade}', label: 'Cidade' },
    { key: '{estado}', label: 'Estado' },
    { key: '{categoria}', label: 'Categoria' },
    { key: '{telefone}', label: 'Telefone' },
    { key: '{website}', label: 'Website' },
  ]

  const insertVariable = (variable: string) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content + variable
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <FileText className="w-5 h-5 text-purple-500" />
            Templates de Proposta
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Crie e gerencie templates de mensagem para enviar propostas aos estabelecimentos.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Formulário */}
          <div className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white">
                  {editingTemplate ? 'Editar Template' : 'Novo Template'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="template-name" className="text-slate-200">Nome do Template</Label>
                  <Input
                    id="template-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Proposta para Barbearias"
                    className="bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-category" className="text-slate-200">Categoria (opcional)</Label>
                  <Select 
                    value={formData.category_id} 
                    onValueChange={(v) => setFormData(prev => ({ ...prev, category_id: v }))}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="all" className="text-slate-200 focus:bg-slate-700 focus:text-white">Todas as categorias</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id} className="text-slate-200 focus:bg-slate-700 focus:text-white">
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

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="template-content" className="text-slate-200">Conteúdo</Label>
                    <div className="flex gap-1 flex-wrap">
                      {variables.slice(0, 3).map(v => (
                        <Button
                          key={v.key}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-6 text-xs border-slate-600 text-slate-300 hover:bg-slate-700"
                          onClick={() => insertVariable(v.key)}
                        >
                          {v.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Textarea
                    id="template-content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Digite o conteúdo do template...

Use variáveis como {nome_empresa} que serão substituídas automaticamente."
                    rows={8}
                    className="font-mono text-sm bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-500"
                  />
                  <p className="text-xs text-slate-500">
                    Variáveis disponíveis: {variables.map(v => v.key).join(', ')}
                  </p>
                </div>

                <div className="flex gap-2">
                  {editingTemplate && (
                    <Button type="button" variant="outline" onClick={cancelEdit} className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700">
                      Cancelar
                    </Button>
                  )}
                  <Button 
                    type="button" 
                    onClick={handleSave} 
                    disabled={saving || !formData.name.trim() || !formData.content.trim()}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : editingTemplate ? (
                      'Atualizar'
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Template
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de templates */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-200">Templates Existentes ({templates.length})</Label>
            <ScrollArea className="h-[400px] pr-2">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </div>
              ) : templates.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Nenhum template criado ainda</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {templates.map(template => (
                    <Card 
                      key={template.id} 
                      className={`bg-slate-800 border-slate-700 ${editingTemplate?.id === template.id ? 'ring-2 ring-purple-500' : ''}`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm truncate text-white">{template.name}</h4>
                              {template.is_default && (
                                <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                                  <Star className="w-3 h-3 mr-1" />
                                  Padrão
                                </Badge>
                              )}
                            </div>
                            {template.category && (
                              <Badge 
                                variant="outline" 
                                className="mt-1 text-xs"
                                style={{ borderColor: template.category.color, color: template.category.color }}
                              >
                                {template.category.name}
                              </Badge>
                            )}
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                              {template.content.substring(0, 100)}...
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCopy(template)}
                              title="Copiar conteúdo"
                              className="hover:bg-slate-700"
                            >
                              {copiedId === template.id ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4 text-slate-400" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(template)}
                              title="Editar"
                              className="hover:bg-slate-700"
                            >
                              <Edit2 className="w-4 h-4 text-slate-400" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(template.id)}
                              title="Excluir"
                              className="hover:bg-slate-700"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-slate-700 text-slate-300 hover:bg-slate-800">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

