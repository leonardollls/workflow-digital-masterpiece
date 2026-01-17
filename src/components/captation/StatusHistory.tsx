import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Clock, 
  Send, 
  CheckCircle, 
  XCircle, 
  PlayCircle, 
  DollarSign,
  Phone,
  ArrowRight,
  Loader2,
  History
} from 'lucide-react'
import type { StatusHistoryEntry, ProposalStatus } from '@/types/captation'
import { getStatusHistory } from '@/services/captationService'

interface StatusHistoryProps {
  siteId: string
}

const statusConfig: Record<ProposalStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending: { label: 'Pendente', color: 'bg-gray-500', icon: Clock },
  to_send: { label: 'A Enviar', color: 'bg-orange-500', icon: Send },
  accepted: { label: 'Aceita', color: 'bg-green-500', icon: CheckCircle },
  rejected: { label: 'Negada', color: 'bg-red-500', icon: XCircle },
  in_progress: { label: 'Em Execução', color: 'bg-blue-500', icon: PlayCircle },
  paid: { label: 'Pago', color: 'bg-purple-500', icon: DollarSign },
  contact_no_site: { label: 'Entrar em Contato (Sem site)', color: 'bg-cyan-500', icon: Phone },
}

export const StatusHistory = ({ siteId }: StatusHistoryProps) => {
  const [history, setHistory] = useState<StatusHistoryEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [siteId])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const data = await getStatusHistory(siteId)
      setHistory(data)
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const StatusBadge = ({ status }: { status: ProposalStatus }) => {
    const config = statusConfig[status]
    const Icon = config.icon
    return (
      <Badge className={`${config.color} text-white gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-4">
        <History className="w-8 h-8 text-slate-500 mx-auto mb-2" />
        <p className="text-sm text-slate-400">Nenhum histórico de alterações</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <History className="w-4 h-4 text-slate-400" />
        <span className="text-sm font-medium text-slate-200">Histórico de Status</span>
      </div>
      
      <ScrollArea className="h-[200px] pr-4">
        <div className="relative">
          {/* Linha vertical do timeline */}
          <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-slate-600" />
          
          <div className="space-y-4">
            {history.map((entry, index) => (
              <div key={entry.id} className="relative pl-8">
                {/* Ponto do timeline */}
                <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-slate-800 ${
                  index === 0 ? 'bg-purple-500' : 'bg-slate-500'
                }`} />
                
                <div className="bg-slate-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {entry.old_status && (
                      <>
                        <StatusBadge status={entry.old_status} />
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </>
                    )}
                    <StatusBadge status={entry.new_status} />
                  </div>
                  
                  <p className="text-xs text-slate-400 mt-2">
                    {formatDate(entry.changed_at)}
                  </p>
                  
                  {entry.notes && (
                    <p className="text-sm text-slate-300 mt-1 italic">
                      "{entry.notes}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

