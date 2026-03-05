import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { generateQuestionsFromImages, OPENROUTER_API_KEY_STORAGE } from '@/lib/imageQuizGenerator'
import { MathQuestion } from '@/lib/mathGenerator'
import { UploadSimple, CheckCircle, XCircle, SpinnerGap, Image } from '@phosphor-icons/react'

interface ImageUploadModalProps {
  onQuestionsReady: (questions: MathQuestion[]) => void
}

type UploadState = 'idle' | 'loading' | 'success' | 'error'

export function ImageUploadSection({ onQuestionsReady }: ImageUploadModalProps) {
  const [apiKey, setApiKey] = useState('')
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [generatedCount, setGeneratedCount] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const savedKey = localStorage.getItem(OPENROUTER_API_KEY_STORAGE) ?? ''
    setApiKey(savedKey)
  }, [])

  const handleApiKeyChange = (value: string) => {
    setApiKey(value)
    localStorage.setItem(OPENROUTER_API_KEY_STORAGE, value)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return

    // Reset input so the same file can be re-selected later
    e.target.value = ''

    setSelectedFiles(files)
    setUploadState('loading')
    setIsDialogOpen(true)
    setErrorMessage('')

    try {
      const questions = await generateQuestionsFromImages(files, apiKey)
      setGeneratedCount(questions.length)
      setUploadState('success')
      // Store questions so the Start button can pass them up
      setSelectedFiles([])
      // Keep a ref for the start handler
      pendingQuestionsRef.current = questions
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setErrorMessage(message)
      setUploadState('error')
    }
  }

  // Ref to hold generated questions until user clicks Start
  const pendingQuestionsRef = useRef<MathQuestion[]>([])

  const handleStart = () => {
    setIsDialogOpen(false)
    onQuestionsReady(pendingQuestionsRef.current)
    pendingQuestionsRef.current = []
  }

  const handleRetry = () => {
    setIsDialogOpen(false)
    setUploadState('idle')
    // Re-try with same files if still in memory
    if (selectedFiles.length > 0) {
      handleRetryWithFiles(selectedFiles)
    }
  }

  const handleRetryWithFiles = async (files: File[]) => {
    setUploadState('loading')
    setIsDialogOpen(true)
    setErrorMessage('')

    try {
      const questions = await generateQuestionsFromImages(files, apiKey)
      setGeneratedCount(questions.length)
      setUploadState('success')
      setSelectedFiles([])
      pendingQuestionsRef.current = questions
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setErrorMessage(message)
      setUploadState('error')
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.25 }}
        className="mt-4 rounded-xl border-2 border-dashed border-coral/40 bg-coral/5 p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Image weight="fill" className="w-5 h-5 text-coral" />
          <p className="text-sm font-semibold text-coral">AI Quiz from Image</p>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Upload image(s) from your study material and our AI will create a quiz for you.
        </p>

        <div className="mb-3">
          <label className="text-xs font-medium text-foreground block mb-1">
            OpenRouter API Key
          </label>
          <Input
            type="password"
            placeholder="sk-or-..."
            value={apiKey}
            onChange={(e) => handleApiKeyChange(e.target.value)}
            className="h-8 text-sm"
          />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFilesSelected}
        />

        <Button
          onClick={handleUploadClick}
          disabled={!apiKey.trim()}
          variant="outline"
          size="sm"
          className="w-full border-coral text-coral hover:bg-coral hover:text-white disabled:opacity-40"
        >
          <UploadSimple weight="bold" className="w-4 h-4 mr-2" />
          Upload Image(s)
        </Button>

        {!apiKey.trim() && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Enter your API key above to enable upload.
          </p>
        )}
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        // Prevent closing while loading
        if (uploadState === 'loading') return
        setIsDialogOpen(open)
      }}>
        <DialogContent className="max-w-sm" onPointerDownOutside={(e) => {
          if (uploadState === 'loading') e.preventDefault()
        }}>
          <DialogHeader>
            <DialogTitle>
              {uploadState === 'loading' && 'Creating Quiz…'}
              {uploadState === 'success' && 'Quiz Ready!'}
              {uploadState === 'error' && 'Something Went Wrong'}
            </DialogTitle>
            <DialogDescription asChild>
              <div>
                <AnimatePresence mode="wait">
                  {uploadState === 'loading' && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-4 py-6"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <SpinnerGap weight="bold" className="w-12 h-12 text-primary" />
                      </motion.div>
                      <p className="text-base font-medium text-foreground text-center">
                        Analyzing image(s) and generating questions…
                      </p>
                      <p className="text-sm text-muted-foreground text-center">
                        This may take a few seconds.
                      </p>
                    </motion.div>
                  )}

                  {uploadState === 'success' && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-4 py-6"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                      >
                        <CheckCircle weight="fill" className="w-16 h-16 text-green-500" />
                      </motion.div>
                      <p className="text-base font-semibold text-foreground text-center">
                        {generatedCount} questions created successfully!
                      </p>
                      <p className="text-sm text-muted-foreground text-center">
                        Your quiz is ready. Press Start to begin!
                      </p>
                      <Button
                        onClick={handleStart}
                        size="lg"
                        className="w-full mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Start! 🚀
                      </Button>
                    </motion.div>
                  )}

                  {uploadState === 'error' && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-4 py-6"
                    >
                      <XCircle weight="fill" className="w-16 h-16 text-destructive" />
                      <p className="text-base font-semibold text-foreground text-center">
                        Failed to generate questions
                      </p>
                      <p className="text-sm text-muted-foreground text-center break-words max-w-xs">
                        {errorMessage}
                      </p>
                      <Button
                        onClick={handleRetry}
                        variant="outline"
                        size="lg"
                        className="w-full mt-2"
                      >
                        Try Again
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
