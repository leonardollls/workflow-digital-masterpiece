import React, { useState } from 'react';
import { Upload, X, File, Image, Video } from 'lucide-react';

interface FileUploadProps {
  id: string;
  accept: string;
  multiple?: boolean;
  onChange: (files: FileList | null) => void;
  label: string;
  description: string;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  id,
  accept,
  multiple = false,
  onChange,
  label,
  description,
  className = ""
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(fileArray);
      onChange(files);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    
    // Criar novo FileList
    const dt = new DataTransfer();
    newFiles.forEach(file => dt.items.add(file));
    onChange(dt.files);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-4 h-4 text-blue-500" />;
    } else if (file.type.startsWith('video/')) {
      return <Video className="w-4 h-4 text-purple-500" />;
    } else {
      return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-workflow-deep mb-2">
        {label}
      </label>
      
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        id={id}
        onChange={handleFileChange}
      />
      
      <label 
        htmlFor={id} 
        className="block border-2 border-dashed border-workflow-deep/20 rounded-lg p-6 text-center hover:border-workflow-energy/50 transition-colors cursor-pointer hover:bg-workflow-energy/5"
      >
        <Upload className="w-8 h-8 text-workflow-deep/40 mx-auto mb-2" />
        <span className="text-sm text-workflow-deep/70 block">
          Clique para fazer upload ou arraste arquivos aqui
        </span>
        <p className="text-xs text-workflow-deep/50 mt-1">
          {description}
        </p>
      </label>

      {/* Lista de arquivos selecionados */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-workflow-deep">
            Arquivos selecionados ({selectedFiles.length}):
          </p>
          <div className="max-h-32 overflow-y-auto space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-workflow-energy/10 rounded-lg border border-workflow-energy/20"
              >
                {getFileIcon(file)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-workflow-deep truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-workflow-deep/60">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-red-100 rounded-full transition-colors"
                  title="Remover arquivo"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 