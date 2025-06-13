import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { DollarSign, Save, X } from 'lucide-react'
import type { ClientBriefing } from '@/lib/supabase'
import { addProposalValue } from '@/services/briefingService'

interface ProposalValueDialogProps {
  briefing: ClientBriefing
  onUpdate: (updatedBriefing: ClientBriefing) => void
}

export const ProposalValueDialog = ({ briefing, onUpdate }: ProposalValueDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState(briefing.proposal_value?.toString() || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const numericValue = parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.'))
      
      if (isNaN(numericValue) || numericValue <= 0) {
        alert('Por favor, insira um valor válido')
        return
      }

      const updatedBriefing = await addProposalValue(briefing.id!, numericValue)
      onUpdate(updatedBriefing)
      setIsOpen(false)
      console.log('✅ Valor da proposta adicionado com sucesso')
    } catch (error) {
      console.error('❌ Erro ao adicionar valor da proposta:', error)
      alert('Erro ao adicionar valor da proposta. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (value: string) => {
    // Remove tudo que não é dígito
    const numericValue = value.replace(/\D/g, '')
    
    // Converte para número e formata
    const number = parseFloat(numericValue) / 100
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(number)
  }

  const handleValueChange = (inputValue: string) => {
    const formatted = formatCurrency(inputValue)
    setValue(formatted)
  }

  const currentValue = briefing.proposal_value 
    ? new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(briefing.proposal_value)
    : null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={briefing.proposal_value ? "default" : "outline"} 
          size="sm" 
          className="gap-2"
        >
          <DollarSign className="w-4 h-4" />
          {briefing.proposal_value ? 'Editar Proposta' : 'Adicionar Proposta'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            {briefing.proposal_value ? 'Editar' : 'Adicionar'} Valor da Proposta
          </DialogTitle>
          <DialogDescription>
            {briefing.proposal_value 
              ? `Valor atual: ${currentValue}` 
              : `Defina o valor da proposta para ${briefing.company_name}`
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="proposal_value">Valor da Proposta *</Label>
              <Input
                id="proposal_value"
                value={value}
                onChange={(e) => handleValueChange(e.target.value)}
                placeholder="R$ 0,00"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Digite o valor em reais (ex: 5000 para R$ 5.000,00)
              </p>
            </div>

            {briefing.proposal_date && (
              <div className="text-sm text-gray-600">
                <strong>Última atualização:</strong> {new Date(briefing.proposal_date).toLocaleDateString('pt-BR')}
              </div>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Salvando...' : 'Salvar Proposta'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 