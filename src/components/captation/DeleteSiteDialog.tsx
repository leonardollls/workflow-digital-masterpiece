import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { 
  Trash2,
  AlertTriangle,
  Loader2
} from 'lucide-react'

interface DeleteSiteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  siteName: string
  onConfirmDelete: () => Promise<void>
  loading?: boolean
}

export const DeleteSiteDialog = ({ 
  open, 
  onOpenChange, 
  siteName,
  onConfirmDelete,
  loading = false 
}: DeleteSiteDialogProps) => {

  const handleClose = () => {
    if (!loading) {
      onOpenChange(false)
    }
  }

  const handleDelete = async () => {
    await onConfirmDelete()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Trash2 className="w-5 h-5 text-red-500" />
            Excluir Site Captado
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Esta ação é irreversível e removerá permanentemente o site selecionado.
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
                  O histórico de status e tags associadas também serão removidos.
                </p>
              </div>
            </div>
          </div>

          {/* Nome do site */}
          <div className="p-3 bg-slate-800 border border-slate-700 rounded-md">
            <p className="text-sm text-slate-300">
              <span className="text-slate-400">Site a ser excluído:</span>
            </p>
            <p className="text-lg font-semibold text-white mt-1">{siteName}</p>
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
            disabled={loading}
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
                Excluir Site
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
