import { MathQuestion } from './mathGenerator'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL_ID = 'google/gemini-3-flash-preview'

export const OPENROUTER_API_KEY_STORAGE = 'openrouter-api-key'

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function resizeImageIfNeeded(dataUrl: string, maxWidth = 1024): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      if (img.width <= maxWidth) {
        resolve(dataUrl)
        return
      }
      const scale = maxWidth / img.width
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(dataUrl)
        return
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = () => resolve(dataUrl)
    img.src = dataUrl
  })
}

interface RawQuestion {
  question: string
  correctAnswer: number
  options: number[]
}

function parseQuestionsFromText(text: string): RawQuestion[] {
  // Try to extract a JSON array from the response
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) {
    throw new Error('AI response did not contain a valid JSON array of questions.')
  }
  const parsed = JSON.parse(jsonMatch[0])
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('AI returned an empty or invalid question list.')
  }
  return parsed as RawQuestion[]
}

export async function generateQuestionsFromImages(
  files: File[],
  apiKey: string
): Promise<MathQuestion[]> {
  // Convert and resize all images
  const imageDataUrls = await Promise.all(
    files.map(async (file) => {
      const dataUrl = await fileToDataUrl(file)
      return resizeImageIfNeeded(dataUrl)
    })
  )

  const prompt = `You are a math teacher. Look at the provided image(s) and create exactly 10 multiple-choice math quiz questions based on the content in the images.

Requirements:
- Each question must have exactly 4 answer options (integers only)
- One option must be the correct answer
- Questions should be relevant to the mathematical content shown in the images
- Vary the difficulty and topics covered
- Return ONLY a valid JSON array (no markdown, no explanation), in this exact format:

[
  {
    "question": "What is 5 + 3?",
    "correctAnswer": 8,
    "options": [8, 5, 11, 6]
  }
]

Generate exactly 10 questions.`

  type ContentPart =
    | { type: 'text'; text: string }
    | { type: 'image_url'; image_url: { url: string } }

  const content: ContentPart[] = [
    { type: 'text', text: prompt },
    ...imageDataUrls.map(
      (url): ContentPart => ({
        type: 'image_url',
        image_url: { url },
      })
    ),
  ]

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Math Learning Advent',
    },
    body: JSON.stringify({
      model: MODEL_ID,
      messages: [{ role: 'user', content }],
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenRouter API error (${response.status}): ${errorText}`)
  }

  const data = await response.json()
  const text: string = data?.choices?.[0]?.message?.content ?? ''

  const rawQuestions = parseQuestionsFromText(text)

  return rawQuestions.slice(0, 10).map((q) => ({
    display: q.question,
    correctAnswer: Number(q.correctAnswer),
    options: (q.options as number[]).map(Number),
    operation: '+' as const,
  }))
}
