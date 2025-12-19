import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Check, X, Pencil, ExternalLink } from 'lucide-react'

interface EditableFieldProps {
  label: string
  value: string | undefined
  onSave: (value: string) => Promise<void>
  type?: 'text' | 'url' | 'textarea' | 'phone'
  placeholder?: string
  showLink?: boolean
}

export const EditableField = ({
  label,
  value,
  onSave,
  type = 'text',
  placeholder = 'Não informado',
  showLink = false
}: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value || '')
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  useEffect(() => {
    setEditValue(value || '')
  }, [value])

  const handleSave = async () => {
    try {
      setSaving(true)
      await onSave(editValue)
      setIsEditing(false)
    } catch (error) {
      console.error('Erro ao salvar:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditValue(value || '')
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      e.preventDefault()
      handleSave()
    }
    if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (isEditing) {
    return (
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-400">{label}</label>
        <div className="flex items-start gap-1">
          {type === 'textarea' ? (
            <Textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="bg-slate-800 border-slate-600 text-slate-200 text-sm min-h-[60px] resize-none"
              disabled={saving}
            />
          ) : (
            <Input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type={type === 'url' ? 'url' : 'text'}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="bg-slate-800 border-slate-600 text-slate-200 text-sm h-8"
              disabled={saving}
            />
          )}
          <div className="flex gap-1 flex-shrink-0">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSave}
              disabled={saving}
              className="h-8 w-8 p-0 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/30"
              title="Salvar"
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              disabled={saving}
              className="h-8 w-8 p-0 text-slate-400 hover:text-slate-300 hover:bg-slate-700"
              title="Cancelar"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group">
      <label className="text-sm font-medium text-slate-400">{label}</label>
      <div className="flex items-center gap-1">
        {value ? (
          <>
            {type === 'url' && showLink ? (
              <a 
                href={value} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:underline flex items-center gap-1"
              >
                Ver site <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <p className="text-sm text-slate-300 break-all">{value}</p>
            )}
          </>
        ) : (
          <p className="text-sm text-slate-500 italic">{placeholder}</p>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsEditing(true)}
          className="h-6 w-6 p-0 text-slate-500 hover:text-slate-300 hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
          title={`Editar ${label}`}
        >
          <Pencil className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}
