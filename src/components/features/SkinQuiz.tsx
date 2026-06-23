import { useState } from 'react'
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'

const questions = [
  {
    id: 1,
    question: 'Apa jenis kulitmu?',
    options: [
      { value: 'berminyak', label: 'Berminyak', emoji: '✨' },
      { value: 'kering', label: 'Kering', emoji: '🌵' },
      { value: 'kombinasi', label: 'Kombinasi', emoji: '🌀' },
      { value: 'sensitif', label: 'Sensitif', emoji: '🌸' },
    ],
  },
  {
    id: 2,
    question: 'Apa masalah kulit utama yang kamu hadapi?',
    options: [
      { value: 'jerawat', label: 'Jerawat', emoji: '🔴' },
      { value: 'penuaan', label: 'Tanda Penuaan', emoji: '⏳' },
      { value: 'kusam', label: 'Kulit Kusam', emoji: '🌫️' },
      { value: 'pori', label: 'Pori Besar', emoji: '🔍' },
    ],
  },
  {
    id: 3,
    question: 'Apa tujuan perawatanmu?',
    options: [
      { value: 'kencang', label: 'Mengencangkan', emoji: '💪' },
      { value: 'cerah', label: 'Mencerahkan', emoji: '☀️' },
      { value: 'lembab', label: 'Melembabkan', emoji: '💧' },
      { value: 'relaksasi', label: 'Relaksasi', emoji: '🧘' },
    ],
  },
]

interface SkinQuizProps {
  onComplete?: (answers: Record<string, string>) => void
}

export function SkinQuiz({ onComplete }: SkinQuizProps) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResult, setShowResult] = useState(false)

  const currentQuestion = questions[step]
  const isLast = step === questions.length - 1
  const progress = ((step + 1) / questions.length) * 100

  const handleSelect = (value: string) => {
    setAnswers({ ...answers, [currentQuestion.id.toString()]: value })
  }

  const handleNext = () => {
    if (isLast) {
      setShowResult(true)
      onComplete?.(answers)
    } else {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const handleRestart = () => {
    setStep(0)
    setAnswers({})
    setShowResult(false)
  }

  if (showResult) {
    return (
      <Card className="text-center p-8">
        <CardContent className="pt-6 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-heading text-xl font-bold">Hasil Quiz!</h3>
          <p className="text-muted-foreground">
            Berdasarkan jawabanmu, kami merekomendasikan produk-produk berikut untukmu.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {Object.entries(answers).map(([key, value]) => (
              <Badge key={key} variant="secondary">
                {questions[Number(key) - 1]?.options.find((o) => o.value === value)?.label || value}
              </Badge>
            ))}
          </div>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={handleRestart}>
              Ulangi Quiz
            </Button>
            <Button onClick={() => window.location.href = '/'}>
              Lihat Koleksi
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!currentQuestion) return null

  const selectedValue = answers[currentQuestion.id.toString()]

  return (
    <Card>
      <CardContent className="p-6 sm:p-8 space-y-6">
        <div className="w-full bg-muted/20 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Pertanyaan {step + 1} dari {questions.length}
          </p>
          <h3 className="font-heading text-xl font-bold">
            {currentQuestion.question}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`p-4 rounded-xl border text-center transition-all duration-200 ${
                selectedValue === option.value
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border hover:border-primary/50 hover:bg-primary/5'
              }`}
            >
              <span className="text-2xl mb-2 block">{option.emoji}</span>
              <span className={`text-sm font-medium ${selectedValue === option.value ? 'text-primary' : 'text-foreground'}`}>
                {option.label}
              </span>
            </button>
          ))}
        </div>

        <div className="flex gap-3 justify-between">
          <Button variant="ghost" onClick={handleBack} disabled={step === 0}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
          </Button>
          <Button onClick={handleNext} disabled={!selectedValue}>
            {isLast ? 'Lihat Hasil' : 'Selanjutnya'}{' '}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
