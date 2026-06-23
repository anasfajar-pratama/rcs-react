import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Shield, Leaf, Heart } from 'lucide-react'
import { Badge } from '../components/ui/badge'
import api from '../lib/api'

const valueIcons = [Sparkles, Shield, Leaf, Heart]

function getInitials(name: string) {
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

export default function About() {
  const [content, setContent] = useState<Record<string, string>>({})

  useEffect(() => {
    api.get('/about-content').then((res) => {
      if (res.data) setContent(res.data)
    }).catch(() => {})
  }, [])

  const values = [
    { title: content.about_value_1_title || 'Inovasi', desc: content.about_value_1_desc || 'Kami terus menghadirkan teknologi terkini untuk hasil kecantikan maksimal.' },
    { title: content.about_value_2_title || 'Kualitas', desc: content.about_value_2_desc || 'Setiap produk melewati kontrol kualitas ketat dengan material premium.' },
    { title: content.about_value_3_title || 'Keberlanjutan', desc: content.about_value_3_desc || 'Komitmen kami pada lingkungan dengan kemasan ramah lingkungan.' },
    { title: content.about_value_4_title || 'Kepuasan Pelanggan', desc: content.about_value_4_desc || 'Pelanggan adalah prioritas utama kami dalam setiap inovasi.' },
  ]

  const team = [
    { name: content.about_team_1_name || 'Dr. Maya Wijaya', role: content.about_team_1_role || 'Founder & CEO' },
    { name: content.about_team_2_name || 'Rina Kusuma', role: content.about_team_2_role || 'Head of Product' },
    { name: content.about_team_3_name || 'Budi Santoso', role: content.about_team_3_role || 'Lead Engineer' },
    { name: content.about_team_4_name || 'Sari Indah', role: content.about_team_4_role || 'Quality Control' },
  ]

  return (
    <div className="pt-24 pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Tentang Rindang Cemara Sukses</Badge>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-balance">
            {content.about_hero_title || 'Kecantikan dengan Teknologi'}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            {content.about_hero_subtitle || 'Rindang Cemara Sukses adalah brand alat kecantikan yang menggabungkan inovasi teknologi dengan desain elegan untuk membantu Anda tampil percaya diri setiap hari.'}
          </p>
        </motion.div>

        {/* Story */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/[0.04] to-accent/[0.04]"
          >
            {content.about_story_image ? (
              <img src={content.about_story_image} alt="Cerita Rindang Cemara Sukses" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-heading text-8xl font-bold text-primary/20">RCS</span>
              </div>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-6">{content.about_story_heading || 'Cerita Kami'}</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>{content.about_story_text1 || 'Berawal dari keprihatinan akan minimnya alat kecantikan berkualitas di Indonesia, Rindang Cemara Sukses didirikan dengan visi menghadirkan alat kecantikan premium yang terjangkau.'}</p>
              <p>{content.about_story_text2 || 'Kami bekerja sama dengan para ahli dermatologi dan engineer untuk mengembangkan produk-produk yang tidak hanya efektif tetapi juga aman dan nyaman digunakan sehari-hari.'}</p>
              <p>{content.about_story_text3 || 'Setiap produk Rindang Cemara Sukses melewati serangkaian uji kualitas dan keamanan sebelum sampai ke tangan pelanggan tercinta.'}</p>
            </div>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-center mb-12">
            {content.about_values_title || 'Nilai-Nilai Kami'}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = valueIcons[i] || Sparkles
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-white border border-border text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-center mb-12">
            {content.about_team_title || 'Tim Kami'}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
                  <span className="font-heading text-2xl font-bold text-primary">{getInitials(m.name)}</span>
                </div>
                <h3 className="font-heading font-semibold">{m.name}</h3>
                <p className="text-sm text-muted-foreground">{m.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
