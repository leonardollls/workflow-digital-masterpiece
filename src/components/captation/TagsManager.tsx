import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { 
  Tags, 
  Plus, 
  Trash2, 
  Edit2, 
  Loader2,
  Check,
  X
} from 'lucide-react'
import type { Tag } from '@/types/captation'
import { getTags, createTag, updateTag, deleteTag } from '@/services/captationService'

interface TagsManagerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTagsUpdated: () => void
}

const colorOptions = [
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#6B7280', // Gray
]

export const TagsManager = ({ open, onOpenChange, onTagsUpdated }: TagsManagerProps) => {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState('#6366F1')
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      loadTags()
    }
  }, [open])

  const loadTags = async () => {
    try {
      setLoading(true)
      const data = await getTags()
      setTags(data)
    } catch (error) {
      console.error('Erro ao carregar tags:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return

    try {
      setSaving(true)
      await createTag(newTagName.trim(), newTagColor)
      setNewTagName('')
      setNewTagColor('#6366F1')
      await loadTags()
      onTagsUpdated()
    } catch (error) {
      console.error('Erro ao criar tag:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateTag = async () => {
    if (!editingTag || !editingTag.name.trim()) return

    try {
      setSaving(true)
      await updateTag(editingTag.id, editingTag.name.trim(), editingTag.color)
      setEditingTag(null)
      await loadTags()
      onTagsUpdated()
    } catch (error) {
      console.error('Erro ao atualizar tag:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteTag = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta tag?')) return

    try {
      await deleteTag(id)
      await loadTags()
      onTagsUpdated()
    } catch (error) {
      console.error('Erro ao deletar tag:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Tags className="w-5 h-5 text-purple-500" />
            Gerenciar Tags
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Crie e gerencie tags para organizar seus estabelecimentos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Criar nova tag */}
          <div className="space-y-3 p-4 bg-slate-800 rounded-lg">
            <Label className="text-sm font-medium text-slate-200">Nova Tag</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Nome da tag"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="flex-1 bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-500"
              />
              <Button
                onClick={handleCreateTag}
                disabled={!newTagName.trim() || saving}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map(color => (
                <button
                  key={color}
                  onClick={() => setNewTagColor(color)}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    newTagColor === color ? 'ring-2 ring-offset-2 ring-offset-slate-800 ring-slate-400 scale-110' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Lista de tags */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-200">Tags Existentes ({tags.length})</Label>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
              </div>
            ) : tags.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">
                Nenhuma tag criada ainda.
              </p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {tags.map(tag => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between p-2 bg-slate-800 border border-slate-700 rounded-lg"
                  >
                    {editingTag?.id === tag.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editingTag.name}
                          onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                          className="h-8 text-sm bg-slate-700 border-slate-600 text-slate-200"
                        />
                        <div className="flex gap-1">
                          {colorOptions.slice(0, 5).map(color => (
                            <button
                              key={color}
                              onClick={() => setEditingTag({ ...editingTag, color })}
                              className={`w-5 h-5 rounded-full ${
                                editingTag.color === color ? 'ring-2 ring-offset-1 ring-offset-slate-800 ring-slate-400' : ''
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleUpdateTag}
                          disabled={saving}
                          className="hover:bg-slate-700"
                        >
                          <Check className="w-4 h-4 text-green-500" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingTag(null)}
                          className="hover:bg-slate-700"
                        >
                          <X className="w-4 h-4 text-slate-400" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Badge 
                          style={{ backgroundColor: tag.color }}
                          className="text-white"
                        >
                          {tag.name}
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingTag(tag)}
                            className="hover:bg-slate-700"
                          >
                            <Edit2 className="w-4 h-4 text-slate-400" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteTag(tag.id)}
                            className="hover:bg-slate-700"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
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

