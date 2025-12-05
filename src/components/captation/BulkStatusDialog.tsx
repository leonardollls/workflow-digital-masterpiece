import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Clock, 
  Send, 
  CheckCircle, 
  XCircle, 
  PlayCircle, 
  DollarSign,
  CheckSquare,
  Loader2,
  AlertTriangle
} from 'lucide-react'

interface BulkStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
  onStatusChange: (status: 'pending' | 'to_send' | 'accepted' | 'rejected' | 'in_progress' | 'paid', serviceValue?: number) => void
  loading?: boolean
}

const statusOptions = [
  { value: 'pending', label: 'Pendente', icon: Clock, color: 'text-slate-600', bgColor: 'bg-gray-100' },
  { value: 'to_send', label: 'A Enviar', icon: Send, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  { value: 'accepted', label: 'Aceita', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
  { value: 'rejected', label: 'Negada', icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
  { value: 'in_progress', label: 'Em Execução', icon: PlayCircle, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { value: 'paid', label: 'Projeto Pago', icon: DollarSign, color: 'text-purple-600', bgColor: 'bg-purple-100' }
]

export const BulkStatusDialog = ({ 
  open, 
  onOpenChange, 
  selectedCount, 
  onStatusChange,
  loading = false 
}: BulkStatusDialogProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [serviceValue, setServiceValue] = useState('')

  const handleSubmit = () => {
    if (!selectedStatus) return
    
    const value = selectedStatus === 'paid' && serviceValue ? parseFloat(serviceValue) : undefined
    onStatusChange(selectedStatus as 'pending' | 'to_send' | 'accepted' | 'rejected' | 'in_progress' | 'paid', value)
  }

  const handleClose = () => {
    if (!loading) {
      setSelectedStatus('')
      setServiceValue('')
      onOpenChange(false)
    }
  }

  const selectedOption = statusOptions.find(opt => opt.value === selectedStatus)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <CheckSquare className="w-5 h-5 text-purple-500" />
            Alterar Status em Massa
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Altere o status de múltiplos estabelecimentos de uma só vez.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Resumo da seleção */}
          <div className="p-3 bg-blue-900/30 border border-blue-800 rounded-md flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-sm font-medium text-blue-300">
                {selectedCount} estabelecimento{selectedCount > 1 ? 's' : ''} selecionado{selectedCount > 1 ? 's' : ''}
              </p>
              <p className="text-xs text-blue-400">
                Esta ação será aplicada a todos os itens selecionados
              </p>
            </div>
          </div>

          {/* Seleção de Status */}
          <div className="space-y-2">
            <Label className="text-slate-200">Novo Status</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                <SelectValue placeholder="Selecionar novo status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {statusOptions.map(option => {
                  const Icon = option.icon
                  return (
                    <SelectItem key={option.value} value={option.value} className="text-slate-200 focus:bg-slate-700 focus:text-white">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${option.color}`} />
                        {option.label}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Preview do status selecionado */}
          {selectedOption && (
            <div className="p-3 rounded-md bg-slate-800 border border-slate-700 flex items-center gap-2">
              <selectedOption.icon className={`w-5 h-5 ${selectedOption.color}`} />
              <span className={`font-medium ${selectedOption.color}`}>
                {selectedOption.label}
              </span>
            </div>
          )}

          {/* Valor do serviço (apenas para status "paid") */}
          {selectedStatus === 'paid' && (
            <div className="space-y-2">
              <Label htmlFor="service-value" className="text-slate-200">Valor do Serviço (R$)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                  R$
                </span>
                <Input
                  id="service-value"
                  type="number"
                  placeholder="0,00"
                  value={serviceValue}
                  onChange={(e) => setServiceValue(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
                  step="0.01"
                  min="0"
                />
              </div>
              <p className="text-xs text-slate-500">
                O valor será aplicado a todos os {selectedCount} estabelecimentos selecionados
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={loading} className="border-slate-700 text-slate-300 hover:bg-slate-800">
            Cancelar
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit} 
            disabled={loading || !selectedStatus}
            className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              <>
                <CheckSquare className="w-4 h-4" />
                Atualizar {selectedCount} item{selectedCount > 1 ? 's' : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

