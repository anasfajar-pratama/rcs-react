import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Shield, Leaf, Heart, Zap, Wind, Briefcase, Smile, Star, Award, Crown, Gift, Trophy, Sun, Moon, Users, Globe, Palette, ThumbsUp, Diamond, FileText, Download } from 'lucide-react'
import { Badge } from '../components/ui/badge'
import api from '../lib/api'

const iconMap: Record<string, typeof Sparkles> = {
  Sparkles, Shield, Leaf, Heart, Zap, Wind, Briefcase, Smile, Star, Award,
  Crown, Gift, Trophy, Sun, Moon, Users, Globe, Palette, ThumbsUp, Diamond,
}

const defaultIcons = [Sparkles, Shield, Leaf, Heart]

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
    { icon: content.about_value_1_icon, title: content.about_value_1_title || 'Inovasi', desc: content.about_value_1_desc || 'Kami terus menghadirkan teknologi terkini untuk hasil kecantikan maksimal.' },
    { icon: content.about_value_2_icon, title: content.about_value_2_title || 'Kualitas', desc: content.about_value_2_desc || 'Setiap produk melewati kontrol kualitas ketat dengan material premium.' },
    { icon: content.about_value_3_icon, title: content.about_value_3_title || 'Keberlanjutan', desc: content.about_value_3_desc || 'Komitmen kami pada lingkungan dengan kemasan ramah lingkungan.' },
    { icon: content.about_value_4_icon, title: content.about_value_4_title || 'Kepuasan Pelanggan', desc: content.about_value_4_desc || 'Pelanggan adalah prioritas utama kami dalam setiap inovasi.' },
  ]

  const permits = [
    { title: content.about_permit_1_title, url: content.about_permit_1_url },
    { title: content.about_permit_2_title, url: content.about_permit_2_url },
    { title: content.about_permit_3_title, url: content.about_permit_3_url },
    { title: content.about_permit_4_title, url: content.about_permit_4_url },
    { title: content.about_permit_5_title, url: content.about_permit_5_url },
    { title: content.about_permit_6_title, url: content.about_permit_6_url },
  ].filter((p) => p.url)

  const team = [
    { image: content.about_team_1_image, name: content.about_team_1_name || 'Dr. Maya Wijaya', role: content.about_team_1_role || 'Founder & CEO' },
    { image: content.about_team_2_image, name: content.about_team_2_name || 'Rina Kusuma', role: content.about_team_2_role || 'Head of Product' },
    { image: content.about_team_3_image, name: content.about_team_3_name || 'Alex Kosasih', role: content.about_team_3_role || 'Lead Engineer' },
    { image: content.about_team_4_image, name: content.about_team_4_name || 'Sari Indah', role: content.about_team_4_role || 'Quality Control' },
  ]

  return (
    <div className="pt-28 pb-20 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-28">
          <Badge variant="outline" className="mb-5 tracking-[0.15em] text-[11px] uppercase px-4 py-1.5 rounded-full border-primary/20 text-primary">
            Tentang Rindang Cemara Sukses
          </Badge>
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-balance mb-6">
            {content.about_hero_title || 'Kecantikan dengan Teknologi'}
          </h1>
          <div className="w-16 h-0.5 bg-primary/20 mx-auto mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed font-light">
            {content.about_hero_subtitle || 'Rindang Cemara Sukses adalah brand alat kecantikan yang menggabungkan inovasi teknologi dengan desain elegan untuk membantu Anda tampil percaya diri setiap hari.'}
          </p>
        </motion.div>

        {/* Story */}
        <div className="grid md:grid-cols-2 gap-16 lg:gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-primary/[0.04] to-accent/[0.04] shadow-sm"
          >
            {content.about_story_image ? (
              <img src={content.about_story_image} alt="Cerita Rindang Cemara Sukses" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-heading text-8xl font-bold text-primary/[0.07] tracking-tight">RCS</span>
              </div>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-4 tracking-[0.15em] text-[11px] uppercase px-4 py-1.5 rounded-full border-primary/20 text-primary">
              Cerita Kami
            </Badge>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight mb-8 text-balance">
              {content.about_story_heading || 'Cerita Kami'}
            </h2>
            <div className="w-12 h-px bg-primary/30 mb-8" />
            <div className="text-muted-foreground leading-[1.9] text-[15.5px] sm:text-base text-justify [&_p]:mb-5" dangerouslySetInnerHTML={{ __html: content.about_story_text || `${content.about_story_text1 || 'Berawal dari keprihatinan akan minimnya alat kecantikan berkualitas di Indonesia, Rindang Cemara Sukses didirikan dengan visi menghadirkan alat kecantikan premium yang terjangkau.'}<br/><br/>${content.about_story_text2 || 'Kami bekerja sama dengan para ahli dermatologi dan engineer untuk mengembangkan produk-produk yang tidak hanya efektif tetapi juga aman dan nyaman digunakan sehari-hari.'}<br/><br/>${content.about_story_text3 || 'Setiap produk Rindang Cemara Sukses melewati serangkaian uji kualitas dan keamanan sebelum sampai ke tangan pelanggan tercinta.'}` }} />
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-32"
        >
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 tracking-[0.15em] text-[11px] uppercase px-4 py-1.5 rounded-full border-primary/20 text-primary">
              Filosofi
            </Badge>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight text-balance">
              {content.about_values_title || 'Nilai-Nilai Kami'}
            </h2>
            <div className="w-12 h-0.5 bg-primary/20 mx-auto mt-6" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = (v.icon && iconMap[v.icon]) || defaultIcons[i] || Sparkles
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group p-7 rounded-2xl bg-white border border-border hover:border-primary/20 hover:shadow-sm transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/[0.08] flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2 text-lg">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 tracking-[0.15em] text-[11px] uppercase px-4 py-1.5 rounded-full border-primary/20 text-primary">
              Tim
            </Badge>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight text-balance">
              {content.about_team_title || 'Tim Kami'}
            </h2>
            <div className="w-12 h-0.5 bg-primary/20 mx-auto mt-6" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center group"
              >
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center mx-auto mb-5 overflow-hidden ring-1 ring-black/[0.03] group-hover:ring-primary/20 transition-all">
                  {m.image ? (
                    <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-heading text-3xl font-bold text-primary/40">{getInitials(m.name)}</span>
                  )}
                </div>
                <h3 className="font-heading font-semibold text-lg mb-1">{m.name}</h3>
                <p className="text-sm text-muted-foreground">{m.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Perizinan — di atas footer */}
        {permits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-32"
          >
            <div className="relative mb-20">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center">
                <Badge variant="outline" className="tracking-[0.15em] text-[11px] uppercase px-5 py-1.5 rounded-full border-primary/20 text-primary bg-white">
                  Legal
                </Badge>
              </div>
            </div>
            <div className="text-center mb-14">
              <h2 className="font-heading text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight text-balance">
                {content.about_permit_title || 'Perizinan'}
              </h2>
              <div className="w-12 h-0.5 bg-primary/20 mx-auto mt-5" />
            </div>
            <div className="max-w-5xl mx-auto space-y-12">
              {permits.map((p, i) => (
                <motion.div
                  key={p.title || i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm"
                >
                  <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-destructive/5 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-destructive" />
                      </div>
                      <h3 className="font-heading font-semibold">{p.title || `Dokumen ${i + 1}`}</h3>
                    </div>
                    <a
                      href={p.url}
                      download
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  </div>
                  <div className="bg-muted/10">
                    <iframe
                      src={`${p.url}#toolbar=0`}
                      className="w-full border-0"
                      style={{ height: 'min(80vh, 700px)' }}
                      title={p.title || `Dokumen ${i + 1}`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
