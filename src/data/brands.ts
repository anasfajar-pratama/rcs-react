export interface BrandConfig {
  key: string
  slug: string
  category: string
  name: string
  color: string
  colorLight: string
  colorDark: string
  gradient: string
  bgLight: string
  textColor: string
  accentColor: string
  tagline: string
  description: string
  about: string
  values: { icon: string; title: string; desc: string }[]
}

export const BRANDS: Record<string, BrandConfig> = {
  Wanita: {
    key: 'blisera',
    slug: 'blisera',
    category: 'Wanita',
    name: 'BLISERA',
    color: '#B76E79',
    colorLight: '#F2D5DA',
    colorDark: '#8B4C54',
    gradient: 'from-rose-200/30 via-amber-100/20 to-rose-100/30',
    bgLight: 'bg-rose-50',
    textColor: 'text-rose-700',
    accentColor: 'rose',
    tagline: 'Elegansi untuk Setiap Momen',
    description: 'Rangkaian perawatan kulit premium untuk wanita modern.',
    about: 'BLISERA lahir dari keyakinan bahwa setiap wanita berhak tampil percaya diri dengan kulit yang sehat dan bercahaya. Kami menghadirkan rangkaian perawatan yang terinspirasi dari ritual kecantikan klasik yang dipadukan dengan inovasi modern. Setiap produk BLISERA dirancang dengan cinta dan ketelitian untuk memberikan pengalaman mewah setiap hari — dari serum pencerah yang bekerja hingga ke lapisan terdalam, hingga pelembap yang menghidrasi sepanjang hari.',
    values: [
      { icon: 'Sparkles', title: 'Premium', desc: 'Bahan alami terbaik dengan kualitas tertinggi untuk hasil maksimal.' },
      { icon: 'Heart', title: 'Elegan', desc: 'Desain mewah yang membuat ritual kecantikan terasa istimewa setiap hari.' },
      { icon: 'Shield', title: 'Terpercaya', desc: 'Teruji klinis dan aman untuk semua jenis kulit.' },
    ],
  },
  Pria: {
    key: 'fokka',
    slug: 'fokka',
    category: 'Pria',
    name: 'FOKKA',
    color: '#4A5568',
    colorLight: '#CBD5E0',
    colorDark: '#2D3748',
    gradient: 'from-slate-300/30 via-blue-200/10 to-slate-400/20',
    bgLight: 'bg-slate-100',
    textColor: 'text-slate-700',
    accentColor: 'slate',
    tagline: 'Ketegasan dalam Gaya',
    description: 'Perawatan pria modern yang praktis dan menyegarkan.',
    about: 'FOKKA hadir untuk pria tangguh yang menginginkan perawatan praktis tanpa ribet. Kami percaya bahwa penampilan prima adalah investasi, bukan sekadar rutinitas. Dengan formula cepat meresap dan aroma maskulin yang menyegarkan, FOKKA dirancang untuk mengiringi setiap langkah dan tantangan Anda. Kemasan minimalis dan travel-friendly membuatnya mudah dibawa ke mana pun — karena priamodern tidak pernah berhenti bergerak.',
    values: [
      { icon: 'Zap', title: 'Praktis', desc: 'Formula cepat meresap untuk pria aktif yang tidak mau berlama-lama.' },
      { icon: 'Wind', title: 'Segar', desc: 'Aroma maskulin yang menyegarkan dan tahan sepanjang hari.' },
      { icon: 'Briefcase', title: 'Modern', desc: 'Kemasan minimalis yang cocok untuk gaya hidup dinamis.' },
    ],
  },
  Anak: {
    key: 'pijar_nala',
    slug: 'pijar-nala',
    category: 'Anak',
    name: 'PIJAR NALA',
    color: '#C3E6FC',
    colorLight: '#E8F4FD',
    colorDark: '#7FC4ED',
    gradient: 'from-sky-200/30 via-blue-100/20 to-cyan-100/30',
    bgLight: 'bg-sky-50',
    textColor: 'text-sky-700',
    accentColor: 'sky',
    tagline: 'Ceria dan Berkilau',
    description: 'Perawatan lembut dan aman untuk kulit si kecil.',
    about: 'Terinspirasi dari keceriaan dan tawa anak-anak, PIJAR NALA menghadirkan produk perawatan yang aman, lembut, dan menyenangkan. Setiap formula kami uji secara dermatologis untuk memastikan keamanan pada kulit sensitif si kecil. Dengan bahan alami pilihan dan aroma lembut yang menenangkan, waktu perawatan berubah menjadi momen bermain yang penuh kebahagiaan. Karena senyum mereka adalah prioritas utama kami.',
    values: [
      { icon: 'Leaf', title: 'Alami', desc: 'Bahan alami lembut yang aman untuk kulit sensitif bayi dan anak.' },
      { icon: 'Heart', title: 'Lembut', desc: 'Formula tear-free yang tidak pedih di mata, nyaman untuk si kecil.' },
      { icon: 'Smile', title: 'Ceria', desc: 'Aroma dan kemasan ceria yang membuat anak-anak betah.' },
    ],
  },
}

export function getBrandByCategory(category: string): BrandConfig | undefined {
  return BRANDS[category]
}

export function getBrandBySlug(slug: string): BrandConfig | undefined {
  return Object.values(BRANDS).find((b) => b.slug === slug)
}
