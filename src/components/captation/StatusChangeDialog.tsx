import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DollarSign } from 'lucide-react'
import type { ProposalStatus } from '@/types/captation'

interface StatusChangeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentStatus: ProposalStatus
  onStatusChange: (newStatus: ProposalStatus, serviceValue?: number) => void
  companyName: string
}

export const StatusChangeDialog = ({ 
  open, 
  onOpenChange, 
  currentStatus, 
  onStatusChange,
  companyName 
}: StatusChangeDialogProps) => {
  const [selectedStatus, setSelectedStatus] = useState<ProposalStatus>(currentStatus)
  const [serviceValue, setServiceValue] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      
      const numericValue = selectedStatus === 'paid' && serviceValue 
        ? parseFloat(serviceValue.replace(/[^\d,]/g, '').replace(',', '.'))
        : undefined

      await onStatusChange(selectedStatus, numericValue)
      onOpenChange(false)
      
      // Reset form
      setSelectedStatus(currentStatus)
      setServiceValue('')
    } catch (error) {
      console.error('Erro ao alterar status:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: string) => {
    // Remove caracteres não numéricos exceto vírgula
    const numericValue = value.replace(/[^\d,]/g, '')
    
    // Adiciona formatação de moeda
    if (numericValue) {
      const parts = numericValue.split(',')
      const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      const decimalPart = parts[1] ? `,${parts[1].slice(0, 2)}` : ''
      return `R$ ${integerPart}${decimalPart}`
    }
    return ''
  }

  const handleValueChange = (value: string) => {
    const formatted = formatCurrency(value)
    setServiceValue(formatted)
  }

  const getStatusLabel = (status: ProposalStatus) => {
    switch (status) {
      case 'pending': return 'Pendente'
      case 'to_send': return 'A Enviar'
      case 'accepted': return 'Aceita'
      case 'rejected': return 'Negada'
      case 'in_progress': return 'Em Execução'
      case 'paid': return 'Projeto Pago'
      default: return status
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alterar Status da Proposta</DialogTitle>
          <p className="text-sm text-gray-600">
            Empresa: <span className="font-medium">{companyName}</span>
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Novo Status</Label>
            <Select 
              value={selectedStatus} 
              onValueChange={(value: ProposalStatus) => setSelectedStatus(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="to_send">A Enviar</SelectItem>
                <SelectItem value="accepted">Aceita</SelectItem>
                <SelectItem value="rejected">Negada</SelectItem>
                <SelectItem value="in_progress">Em Execução</SelectItem>
                <SelectItem value="paid">Projeto Pago</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedStatus === 'paid' && (
            <div className="space-y-2">
              <Label htmlFor="serviceValue" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Valor do Serviço *
              </Label>
              <Input
                id="serviceValue"
                type="text"
                placeholder="R$ 0,00"
                value={serviceValue}
                onChange={(e) => handleValueChange(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">
                Informe o valor total do projeto para contabilização
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={loading || (selectedStatus === 'paid' && !serviceValue)}
          >
            {loading ? 'Salvando...' : 'Salvar Alteração'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 