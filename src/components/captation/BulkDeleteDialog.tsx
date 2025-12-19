import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { 
  Trash2,
  AlertTriangle,
  Loader2
} from 'lucide-react'

interface BulkDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
  onConfirmDelete: () => Promise<void>
  loading?: boolean
}

export const BulkDeleteDialog = ({ 
  open, 
  onOpenChange, 
  selectedCount, 
  onConfirmDelete,
  loading = false 
}: BulkDeleteDialogProps) => {
  const [confirmText, setConfirmText] = useState('')

  const handleClose = () => {
    if (!loading) {
      setConfirmText('')
      onOpenChange(false)
    }
  }

  const handleDelete = async () => {
    await onConfirmDelete()
    setConfirmText('')
  }

  const isConfirmed = confirmText.toLowerCase() === 'excluir'

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Trash2 className="w-5 h-5 text-red-500" />
            Excluir Sites em Massa
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Esta ação é irreversível e removerá permanentemente os sites selecionados.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Aviso de perigo */}
          <div className="p-4 bg-red-900/30 border border-red-800 rounded-md">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-300">
                  Atenção! Esta ação não pode ser desfeita.
                </p>
                <p className="text-xs text-red-400 mt-1">
                  Todos os dados relacionados aos sites selecionados serão permanentemente excluídos, incluindo histórico de status e tags associadas.
                </p>
              </div>
            </div>
          </div>

          {/* Resumo da seleção */}
          <div className="p-3 bg-slate-800 border border-slate-700 rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Sites a serem excluídos:</span>
              <Badge variant="destructive" className="text-lg px-3 py-1">
                {selectedCount}
              </Badge>
            </div>
          </div>

          {/* Campo de confirmação */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300">
              Digite <span className="font-bold text-red-400">excluir</span> para confirmar:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Digite 'excluir'"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose} 
            disabled={loading}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Cancelar
          </Button>
          <Button 
            type="button" 
            variant="destructive"
            onClick={handleDelete} 
            disabled={loading || !isConfirmed}
            className="gap-2 bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Excluir {selectedCount} site{selectedCount > 1 ? 's' : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
