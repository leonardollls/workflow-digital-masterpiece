import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Download, 
  FileSpreadsheet, 
  FileText,
  Loader2,
  CheckCircle2
} from 'lucide-react'
import * as XLSX from 'xlsx'
import type { CaptationSite } from '@/types/captation'

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sites: CaptationSite[]
  fileName?: string
}

type ExportFormat = 'xlsx' | 'csv'

interface ExportColumn {
  key: keyof CaptationSite | 'city_name' | 'state_name' | 'category_name'
  label: string
  checked: boolean
}

const defaultColumns: ExportColumn[] = [
  { key: 'company_name', label: 'Nome da Empresa', checked: true },
  { key: 'category_name', label: 'Categoria', checked: true },
  { key: 'city_name', label: 'Cidade', checked: true },
  { key: 'state_name', label: 'Estado', checked: true },
  { key: 'phone', label: 'Telefone', checked: true },
  { key: 'email', label: 'E-mail', checked: true },
  { key: 'website_url', label: 'Website', checked: true },
  { key: 'contact_person', label: 'Pessoa de Contato', checked: true },
  { key: 'proposal_status', label: 'Status', checked: true },
  { key: 'service_value', label: 'Valor do Serviço', checked: true },
  { key: 'google_rating', label: 'Avaliação Google', checked: true },
  { key: 'google_reviews_count', label: 'Qtd. Avaliações', checked: true },
  { key: 'google_maps_url', label: 'Link Google Maps', checked: false },
  { key: 'contact_link', label: 'Link de Contato', checked: false },
  { key: 'proposal_link', label: 'Link da Proposta', checked: false },
  { key: 'notes', label: 'Observações', checked: false },
  { key: 'created_at', label: 'Data de Cadastro', checked: true },
]

const statusLabels: Record<string, string> = {
  pending: 'Pendente',
  to_send: 'A Enviar',
  accepted: 'Aceita',
  rejected: 'Negada',
  in_progress: 'Em Execução',
  paid: 'Pago'
}

export const ExportDialog = ({ 
  open, 
  onOpenChange, 
  sites,
  fileName = 'captacao-sites'
}: ExportDialogProps) => {
  const [format, setFormat] = useState<ExportFormat>('xlsx')
  const [columns, setColumns] = useState<ExportColumn[]>(defaultColumns)
  const [exporting, setExporting] = useState(false)
  const [exported, setExported] = useState(false)

  const toggleColumn = (key: string) => {
    setColumns(prev => 
      prev.map(col => 
        col.key === key ? { ...col, checked: !col.checked } : col
      )
    )
  }

  const selectAllColumns = () => {
    setColumns(prev => prev.map(col => ({ ...col, checked: true })))
  }

  const deselectAllColumns = () => {
    setColumns(prev => prev.map(col => ({ ...col, checked: false })))
  }

  const getValue = (site: CaptationSite, key: string): string | number => {
    switch (key) {
      case 'city_name':
        return site.city?.name || ''
      case 'state_name':
        return site.city?.state?.abbreviation || ''
      case 'category_name':
        return site.category?.name || ''
      case 'proposal_status':
        return statusLabels[site.proposal_status] || site.proposal_status
      case 'service_value':
        return site.service_value ? `R$ ${site.service_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : ''
      case 'google_rating':
        return site.google_rating ? `${site.google_rating}/5` : ''
      case 'created_at':
        return site.created_at ? new Date(site.created_at).toLocaleDateString('pt-BR') : ''
      default:
        const value = site[key as keyof CaptationSite]
        return value !== undefined && value !== null ? String(value) : ''
    }
  }

  const handleExport = async () => {
    setExporting(true)
    
    try {
      const selectedColumns = columns.filter(col => col.checked)
      
      // Preparar dados
      const data = sites.map(site => {
        const row: Record<string, string | number> = {}
        selectedColumns.forEach(col => {
          row[col.label] = getValue(site, col.key)
        })
        return row
      })

      // Criar workbook
      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Sites Captados')

      // Ajustar largura das colunas
      const colWidths = selectedColumns.map(col => ({
        wch: Math.max(
          col.label.length,
          ...data.map(row => String(row[col.label] || '').length)
        ) + 2
      }))
      ws['!cols'] = colWidths

      // Gerar arquivo
      const fileExtension = format === 'xlsx' ? 'xlsx' : 'csv'
      const timestamp = new Date().toISOString().split('T')[0]
      const fullFileName = `${fileName}-${timestamp}.${fileExtension}`

      if (format === 'xlsx') {
        XLSX.writeFile(wb, fullFileName)
      } else {
        XLSX.writeFile(wb, fullFileName, { bookType: 'csv' })
      }

      setExported(true)
      setTimeout(() => {
        setExported(false)
        onOpenChange(false)
      }, 1500)
    } catch (error) {
      console.error('Erro ao exportar:', error)
    } finally {
      setExporting(false)
    }
  }

  const handleClose = () => {
    if (!exporting) {
      setExported(false)
      onOpenChange(false)
    }
  }

  const selectedCount = columns.filter(col => col.checked).length

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Download className="w-5 h-5 text-purple-500" />
            Exportar Dados
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Exporte {sites.length} site{sites.length !== 1 ? 's' : ''} para Excel ou CSV.
          </DialogDescription>
        </DialogHeader>

        {exported ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <p className="text-lg font-medium text-white">Exportação concluída!</p>
            <p className="text-sm text-slate-400">O arquivo foi baixado automaticamente.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Formato */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-200">Formato do arquivo</Label>
              <RadioGroup 
                value={format} 
                onValueChange={(v) => setFormat(v as ExportFormat)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="xlsx" id="xlsx" className="border-slate-600 text-purple-500" />
                  <Label htmlFor="xlsx" className="flex items-center gap-2 cursor-pointer text-slate-200">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    Excel (.xlsx)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="csv" id="csv" className="border-slate-600 text-purple-500" />
                  <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer text-slate-200">
                    <FileText className="w-4 h-4 text-blue-400" />
                    CSV (.csv)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Colunas */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-slate-200">
                  Colunas a exportar ({selectedCount} de {columns.length})
                </Label>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={selectAllColumns}
                    className="text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    Todos
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={deselectAllColumns}
                    className="text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    Nenhum
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto p-2 border border-slate-700 rounded-lg bg-slate-800">
                {columns.map(col => (
                  <div key={col.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={col.key}
                      checked={col.checked}
                      onCheckedChange={() => toggleColumn(col.key)}
                    />
                    <Label 
                      htmlFor={col.key} 
                      className="text-sm cursor-pointer text-slate-300"
                    >
                      {col.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!exported && (
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={exporting} className="border-slate-700 text-slate-300 hover:bg-slate-800">
              Cancelar
            </Button>
            <Button 
              type="button" 
              onClick={handleExport} 
              disabled={exporting || selectedCount === 0}
              className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {exporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Exportar {sites.length} sites
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

