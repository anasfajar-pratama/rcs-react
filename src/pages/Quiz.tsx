import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Badge } from '../components/ui/badge'
import { SkinQuiz } from '../components/features/SkinQuiz'

export default function Quiz() {
  return (
    <div className="pt-24 pb-16 sm:pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <Badge variant="outline" className="mb-3">Skin Quiz</Badge>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-2">
            Temukan Alat Kecantikan <span className="text-primary">Tepat untukmu</span>
          </h1>
          <p className="text-muted-foreground">
            Jawab 3 pertanyaan sederhana dan dapatkan rekomendasi produk yang sesuai dengan kebutuhan kulitmu.
          </p>
        </motion.div>
        <SkinQuiz />
      </div>
    </div>
  )
}
