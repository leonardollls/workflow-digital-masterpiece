import { useState, useRef, useEffect } from 'react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Button } from '@/components/ui/button'
import { Smile } from 'lucide-react'

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  className?: string
}

export const EmojiPicker = ({ onEmojiSelect, className }: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleEmojiSelect = (emoji: any) => {
    onEmojiSelect(emoji.native)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className || ''}`}>
      <Button
        ref={buttonRef}
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 text-slate-400 hover:text-yellow-400 hover:bg-slate-800"
        title="Inserir emoji"
      >
        <Smile className="w-5 h-5" />
      </Button>

      {isOpen && (
        <div
          ref={pickerRef}
          className="absolute bottom-full right-0 mb-2 z-50"
        >
          <Picker
            data={data}
            onEmojiSelect={handleEmojiSelect}
            theme="dark"
            locale="pt"
            previewPosition="none"
            skinTonePosition="search"
            navPosition="bottom"
            perLine={8}
            maxFrequentRows={2}
            icons="outline"
          />
        </div>
      )}
    </div>
  )
}

export default EmojiPicker
