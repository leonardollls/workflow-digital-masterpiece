import { useState, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Upload, 
  FileJson, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Loader2,
  FileUp,
  Building2,
  MapPin,
  Phone,
  Globe,
  Star,
  Trash2
} from 'lucide-react'
import type { State, Category } from '@/types/captation'
import {
  validateGoogleMapsJson,
  parseGoogleMapsJson,
  bulkImportSites,
  type GoogleMapsEntry,
  type PreviewItem,
  type ImportResult
} from '@/services/jsonImportService'

interface JsonImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  states: State[]
  categories: Category[]
  onImportComplete: () => void
}

type ImportStep = 'upload' | 'preview' | 'importing' | 'complete'

export const JsonImportDialog = ({
  open,
  onOpenChange,
  states,
  categories,
  onImportComplete
}: JsonImportDialogProps) => {
  const [step, setStep] = useState<ImportStep>('upload')
  const [fileName, setFileName] = useState<string>('')
  const [rawData, setRawData] = useState<GoogleMapsEntry[]>([])
  const [previewItems, setPreviewItems] = useState<PreviewItem[]>([])
  const [selectedStateId, setSelectedStateId] = useState<string>('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [importProgress, setImportProgress] = useState(0)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetDialog = useCallback(() => {
    setStep('upload')
    setFileName('')
    setRawData([])
    setPreviewItems([])
    setSelectedStateId('')
    setSelectedCategoryId('')
    setImportProgress(0)
    setImportResult(null)
    setError(null)
    setIsProcessing(false)
    setIsDragging(false)
  }, [])

  const handleClose = () => {
    if (!isProcessing) {
      resetDialog()
      onOpenChange(false)
    }
  }

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.json')) {
      setError('Por favor, selecione um arquivo JSON válido')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('O arquivo é muito grande. Limite máximo: 5MB')
      return
    }

    try {
      setIsProcessing(true)
      setError(null)
      
      const text = await file.text()
      const data = JSON.parse(text)
      
      if (!validateGoogleMapsJson(data)) {
        setError('O formato do JSON não é compatível. Certifique-se de que o arquivo segue o formato do Google Maps.')
        setIsProcessing(false)
        return
      }
      
      if (data.length > 500) {
        setError('O arquivo contém mais de 500 registros. Por favor, divida em arquivos menores.')
        setIsProcessing(false)
        return
      }
      
      setFileName(file.name)
      setRawData(data)
      
      // Processar preview
      const previews = await parseGoogleMapsJson(data)
      setPreviewItems(previews)
      setStep('preview')
      
    } catch (err) {
      setError('Erro ao processar o arquivo. Verifique se é um JSON válido.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleStartImport = async () => {
    if (!selectedCategoryId) {
      setError('Por favor, selecione uma categoria padrão')
      return
    }
    
    setStep('importing')
    setImportProgress(0)
    setIsProcessing(true)
    
    try {
      const result = await bulkImportSites(
        previewItems,
        selectedCategoryId,
        (current, total) => {
          setImportProgress(Math.round((current / total) * 100))
        }
      )
      
      setImportResult(result)
      setStep('complete')
      
    } catch (err) {
      setError('Erro durante a importação. Alguns registros podem não ter sido importados.')
      setStep('preview')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFinish = () => {
    onImportComplete()
    handleClose()
  }

  const removePreviewItem = (index: number) => {
    setPreviewItems(prev => prev.filter((_, i) => i !== index))
  }

  const validItems = previewItems.filter(item => !item.error && !item.isDuplicate)
  const errorItems = previewItems.filter(item => item.error)
  const duplicateItems = previewItems.filter(item => item.isDuplicate)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <FileJson className="w-5 h-5 text-purple-500" />
            Importar Estabelecimentos via JSON
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {step === 'upload' && 'Carregue um arquivo JSON exportado do Google Maps para importar estabelecimentos em massa.'}
            {step === 'preview' && 'Revise os dados antes de importar. Selecione a categoria padrão para os estabelecimentos.'}
            {step === 'importing' && 'Importando estabelecimentos...'}
            {step === 'complete' && 'Importação concluída!'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {/* Step: Upload */}
          {step === 'upload' && (
            <div className="space-y-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
                  transition-all duration-200 ease-in-out
                  ${isDragging 
                    ? 'border-purple-500 bg-purple-900/30 scale-[1.02]' 
                    : 'border-slate-600 hover:border-purple-400 hover:bg-slate-800'
                  }
                  ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                <div className="flex flex-col items-center gap-4">
                  {isProcessing ? (
                    <Loader2 className="w-16 h-16 text-purple-500 animate-spin" />
                  ) : (
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Upload className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-slate-800 rounded-lg shadow-md flex items-center justify-center">
                        <FileJson className="w-5 h-5 text-purple-400" />
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {isProcessing ? 'Processando arquivo...' : 'Arraste o arquivo JSON aqui'}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      ou clique para selecionar
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="px-2 py-1 bg-slate-800 rounded">JSON</span>
                    <span>•</span>
                    <span>Máximo 500 registros</span>
                    <span>•</span>
                    <span>Até 5MB</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-900/30 border border-red-800 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <div className="bg-slate-800 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">Formato esperado:</h4>
                <pre className="text-xs text-slate-400 overflow-x-auto">
{`[
  {
    "name": "Nome do Estabelecimento",
    "category": "Barbearia",
    "address": "Rua X, 123 - Bairro, Cidade - RS, 00000-000",
    "phone": "5199999999",
    "website": "https://exemplo.com",
    "rating": 4.8,
    "reviewsCount": 150
  }
]`}
                </pre>
              </div>
            </div>
          )}

          {/* Step: Preview */}
          {step === 'preview' && (
            <div className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-slate-800 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-white">{previewItems.length}</p>
                  <p className="text-xs text-slate-400">Total</p>
                </div>
                <div className="bg-emerald-900/30 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-400">{validItems.length}</p>
                  <p className="text-xs text-emerald-400">Válidos</p>
                </div>
                <div className="bg-yellow-900/30 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-yellow-400">{duplicateItems.length}</p>
                  <p className="text-xs text-yellow-400">Duplicados</p>
                </div>
                <div className="bg-red-900/30 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-red-400">{errorItems.length}</p>
                  <p className="text-xs text-red-400">Erros</p>
                </div>
              </div>

              {/* Category Selection */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-slate-200 mb-1 block">
                    Categoria Padrão *
                  </label>
                  <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
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
                  <p className="text-xs text-slate-500 mt-1">
                    Será usada quando o JSON não especificar categoria
                  </p>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-900/30 border border-red-800 rounded-lg">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              {/* Preview Table */}
              <div className="border border-slate-700 rounded-lg overflow-hidden">
                <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-200">
                    Preview dos dados ({fileName})
                  </span>
                  <Badge variant="outline" className="border-slate-600 text-slate-300">{validItems.length} serão importados</Badge>
                </div>
                <ScrollArea className="h-[300px]">
                  <div className="divide-y divide-slate-700">
                    {previewItems.map((item, index) => (
                      <div 
                        key={index}
                        className={`p-3 ${
                          item.error 
                            ? 'bg-red-900/20' 
                            : item.isDuplicate 
                              ? 'bg-yellow-900/20' 
                              : 'hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {item.error ? (
                                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                              ) : item.isDuplicate ? (
                                <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                              )}
                              <span className="font-medium text-white truncate">
                                {item.parsed.companyName}
                              </span>
                              {item.parsed.category && (
                                <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                                  {item.parsed.category}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-400">
                              {item.parsed.city && item.parsed.state && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {item.parsed.city} - {item.parsed.state}
                                </span>
                              )}
                              {item.parsed.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {item.parsed.phone}
                                </span>
                              )}
                              {(item.parsed.website || item.parsed.contactLink) && (
                                <span className="flex items-center gap-1">
                                  <Globe className="w-3 h-3" />
                                  {item.parsed.website ? 'Website' : 'WhatsApp'}
                                </span>
                              )}
                              {item.original.rating && (
                                <span className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-yellow-500" />
                                  {item.original.rating} ({item.original.reviewsCount})
                                </span>
                              )}
                            </div>
                            
                            {item.error && (
                              <p className="text-xs text-red-400 mt-1">
                                Erro: {item.error}
                              </p>
                            )}
                            {item.isDuplicate && (
                              <p className="text-xs text-yellow-400 mt-1">
                                Já existe no sistema
                              </p>
                            )}
                          </div>
                          
                          {!item.error && !item.isDuplicate && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removePreviewItem(index)}
                              className="text-slate-400 hover:text-red-400 hover:bg-slate-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}

          {/* Step: Importing */}
          {step === 'importing' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <FileUp className="w-12 h-12 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">
                Importando estabelecimentos...
              </h3>
              <p className="text-slate-400 mb-6">
                Por favor, aguarde enquanto processamos os dados.
              </p>
              
              <div className="w-full max-w-md">
                <Progress value={importProgress} className="h-3" />
                <p className="text-center text-sm text-slate-400 mt-2">
                  {importProgress}% concluído
                </p>
              </div>
            </div>
          )}

          {/* Step: Complete */}
          {step === 'complete' && importResult && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">
                Importação Concluída!
              </h3>
              
              <div className="grid grid-cols-3 gap-4 w-full max-w-md my-6">
                <div className="bg-emerald-900/30 rounded-lg p-4 text-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-emerald-400">{importResult.success}</p>
                  <p className="text-xs text-emerald-400">Importados</p>
                </div>
                <div className="bg-yellow-900/30 rounded-lg p-4 text-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-yellow-400">{importResult.duplicates}</p>
                  <p className="text-xs text-yellow-400">Duplicados</p>
                </div>
                <div className="bg-red-900/30 rounded-lg p-4 text-center">
                  <XCircle className="w-6 h-6 text-red-400 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-red-400">{importResult.errors}</p>
                  <p className="text-xs text-red-400">Erros</p>
                </div>
              </div>

              {importResult.errorMessages.length > 0 && (
                <div className="w-full max-w-md">
                  <details className="bg-red-900/30 rounded-lg p-3">
                    <summary className="text-sm font-medium text-red-300 cursor-pointer">
                      Ver detalhes dos erros ({importResult.errorMessages.length})
                    </summary>
                    <ScrollArea className="h-32 mt-2">
                      <ul className="text-xs text-red-400 space-y-1">
                        {importResult.errorMessages.map((msg, i) => (
                          <li key={i}>• {msg}</li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </details>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          {step === 'upload' && (
            <Button variant="outline" onClick={handleClose} className="border-slate-700 text-slate-300 hover:bg-slate-800">
              Cancelar
            </Button>
          )}
          
          {step === 'preview' && (
            <>
              <Button variant="outline" onClick={() => setStep('upload')} className="border-slate-700 text-slate-300 hover:bg-slate-800">
                Voltar
              </Button>
              <Button 
                onClick={handleStartImport}
                disabled={validItems.length === 0 || !selectedCategoryId}
                className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <FileUp className="w-4 h-4" />
                Importar {validItems.length} estabelecimentos
              </Button>
            </>
          )}
          
          {step === 'complete' && (
            <Button onClick={handleFinish} className="gap-2 bg-purple-600 hover:bg-purple-700 text-white">
              <CheckCircle2 className="w-4 h-4" />
              Concluir
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

