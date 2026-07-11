export interface Subcategory {
  id: number
  name: string
  slug: string
  category: string
}

export interface ProductImage {
  id: number
  imageUrl: string
  isPrimary: boolean
  sortOrder?: number
}

export interface Product {
  id: number
  name: string
  category: 'Wanita' | 'Pria' | 'Anak'
  subcategory?: Subcategory | null
  tagline: string
  description?: string
  ingredients?: string
  benefits?: string[]
  howToUse?: string[]
  images: ProductImage[]
  imageUrl?: string | null
  beforeImage?: string | null
  afterImage?: string | null
  sortOrder?: number
  isPromo?: boolean
  isNew?: boolean
  isFeatured?: boolean
  weight?: string
  dimensions?: string
  bpomNumber?: string
  certifications?: string[]
  halalCertified?: boolean
  warrantyInfo?: string
  price?: number
  originalPrice?: number
  rating?: number
  soldCount?: number
  shopeeUrl?: string
  tokopediaUrl?: string
  tiktokUrl?: string
}

export interface Testimonial {
  id: number
  name: string
  content: string
  rating: string
}

const subcatWanitaSerum: Subcategory = { id: 4, name: 'Serum', slug: 'serum', category: 'Wanita' }
const subcatWanitaMoisturizer: Subcategory = { id: 5, name: 'Moisturizer', slug: 'moisturizer', category: 'Wanita' }
const subcatWanitaCleanser: Subcategory = { id: 1, name: 'Cleanser', slug: 'cleanser', category: 'Wanita' }
const subcatPriaCleanser: Subcategory = { id: 17, name: 'Cleanser', slug: 'pria-cleanser', category: 'Pria' }
const subcatPriaMoisturizer: Subcategory = { id: 16, name: 'Moisturizer', slug: 'pria-moisturizer', category: 'Pria' }
const subcatAnakCleanser: Subcategory = { id: 24, name: 'Gentle Cleanser', slug: 'gentle-cleanser', category: 'Anak' }

export const fallbackSubcategories: Subcategory[] = [
  subcatWanitaSerum, subcatWanitaMoisturizer, subcatWanitaCleanser,
  subcatPriaCleanser, subcatPriaMoisturizer,
  subcatAnakCleanser,
]

export const fallbackProducts: Product[] = [
  {
    id: 1,
    name: 'Bright Glow Serum',
    category: 'Wanita',
    subcategory: subcatWanitaSerum,
    tagline: 'Cerahkan kulit dalam 7 hari',
    description: 'Serum pencerah dengan Niacinamide 10% yang bekerja efektif mencerahkan kulit kusam dan meratakan warna kulit.',
    ingredients: 'Niacinamide 10%, Vitamin C, Hyaluronic Acid, Aloe Vera Extract, Rose Hip Oil',
    benefits: ['Mencerahkan kulit kusam', 'Meratakan warna kulit', 'Melembapkan intensif', 'Anti penuaan dini'],
    howToUse: ['Bersihkan wajah terlebih dahulu', 'Oleskan 3-4 tetes serum ke wajah', 'Tepuk-tepuk hingga meresap sempurna', 'Lanjutkan dengan pelembap'],
    images: [],
    imageUrl: null,
    sortOrder: 1,
    isNew: true,
    isPromo: false,
    isFeatured: true,
    rating: 4.8,
    soldCount: 1240,
    weight: '30ml',
    dimensions: '3.5 x 3.5 x 10 cm',
    bpomNumber: 'NA18201200123',
    certifications: ['BPOM', 'Halal', 'Hypoallergenic'],
    halalCertified: true,
    warrantyInfo: 'Gunakan dalam 6 bulan setelah dibuka',
    price: 149000,
    originalPrice: 199000,
    shopeeUrl: 'https://shopee.co.id/bright-glow-serum',
    tokopediaUrl: 'https://tokopedia.com/bright-glow-serum',
    tiktokUrl: 'https://tiktok.com/@rindangcemarasukses',
  },
  {
    id: 2,
    name: 'Hydra Glow Moisturizer',
    category: 'Wanita',
    subcategory: subcatWanitaMoisturizer,
    tagline: 'Kelembapan tahan 24 jam',
    description: 'Pelembap dengan Hyaluronic Acid dan Ceramide yang memberikan hidrasi maksimal sepanjang hari.',
    ingredients: 'Hyaluronic Acid, Ceramide, Green Tea Extract, Panthenol, Peptide',
    benefits: ['Melembapkan sepanjang hari', 'Memperkuat skin barrier', 'Menghaluskan tekstur kulit', 'Mudah meresap'],
    howToUse: ['Gunakan setelah serum', 'Ambil secukupnya', 'Ratakan ke seluruh wajah dan leher', 'Gunakan pagi dan malam'],
    images: [],
    imageUrl: null,
    sortOrder: 2,
    isNew: false,
    isPromo: true,
    isFeatured: true,
    rating: 4.6,
    soldCount: 890,
    weight: '50ml',
    price: 179000,
    originalPrice: 229000,
    shopeeUrl: 'https://shopee.co.id/hydra-glow-moisturizer',
    tokopediaUrl: 'https://tokopedia.com/hydra-glow-moisturizer',
    tiktokUrl: 'https://tiktok.com/@rindangcemarasukses',
  },
  {
    id: 3,
    name: 'Gentle Face Wash',
    category: 'Wanita',
    subcategory: subcatWanitaCleanser,
    tagline: 'Bersih maksimal, kulit lembut',
    description: 'Pembersih wajah lembut yang mengangkat kotoran tanpa membuat kulit kering.',
    ingredients: 'Aloe Vera, Green Tea, Glycerin, Panthenol',
    benefits: ['Membersihkan kotoran dan debu', 'Menjaga kelembapan alami', 'Kulit terasa lembut setelah cuci', 'Cocok pagi dan malam'],
    howToUse: ['Basahi wajah dengan air hangat', 'Tuangkan sabun ke tangan', 'Pijat lembut ke wajah', 'Bilas hingga bersih'],
    images: [],
    imageUrl: null,
    sortOrder: 3,
    price: 89000,
  },
  {
    id: 4,
    name: "Men's Active Cleanser",
    category: 'Pria',
    subcategory: subcatPriaCleanser,
    tagline: 'Segar dan bersih seharian',
    description: 'Pembersih wajah dengan charcoal dan tea tree oil untuk kulit pria aktif.',
    ingredients: 'Charcoal Extract, Tea Tree Oil, Salicylic Acid, Glycerin, Menthol',
    benefits: ['Membersihkan pori terdalam', 'Mengurangi minyak berlebih', 'Mencegah jerawat', 'Menyegarkan kulit'],
    howToUse: ['Basahi wajah', 'Tuangkan secukupnya ke telapak tangan', 'Pijat lembut pada wajah', 'Bilas hingga bersih'],
    images: [],
    imageUrl: null,
    sortOrder: 4,
    isNew: true,
    isFeatured: true,
    price: 99000,
    originalPrice: 149000,
    shopeeUrl: 'https://shopee.co.id/mens-active-cleanser',
    tokopediaUrl: 'https://tokopedia.com/mens-active-cleanser',
    tiktokUrl: 'https://tiktok.com/@rindangcemarasukses',
  },
  {
    id: 5,
    name: "Men's Hydra Gel",
    category: 'Pria',
    subcategory: subcatPriaMoisturizer,
    tagline: 'Hidrasi tanpa rasa lengket',
    description: 'Gel pelembap ringan yang cepat meresap untuk kulit pria.',
    ingredients: 'Hyaluronic Acid, Aloe Vera, Vitamin E, Menthol',
    benefits: ['Hidrasi cepat meresap', 'Tidak lengket', 'Cocok kulit aktif', 'Aroma segar'],
    howToUse: ['Cuci wajah', 'Ambil seukuran kacang', 'Ratakan ke wajah', 'Biarkan meresap'],
    images: [],
    imageUrl: null,
    sortOrder: 5,
    price: 129000,
    isFeatured: true,
    rating: 4.7,
    soldCount: 560,
  },
  {
    id: 6,
    name: 'Kids Gentle Wash',
    category: 'Anak',
    subcategory: subcatAnakCleanser,
    tagline: 'Lembut untuk kulit si kecil',
    description: 'Sabun mandi lembut dengan oatmeal dan calendula untuk kulit sensitif anak.',
    ingredients: 'Oat Extract, Calendula, Chamomile, Aloe Vera, Vitamin E',
    benefits: ['Sangat lembut di kulit', 'Menenangkan kulit sensitif', 'Tear-free (tidak pedih di mata)', 'Menjaga kelembapan alami'],
    howToUse: ['Gunakan saat mandi', 'Usapkan dengan lembut ke seluruh tubuh', 'Bilas dengan air hangat', 'Keringkan dengan handuk lembut'],
    images: [],
    imageUrl: null,
    sortOrder: 6,
    isPromo: true,
    isFeatured: true,
    rating: 4.9,
    soldCount: 2100,
    price: 79000,
  },
  {
    id: 7,
    name: 'Brightening Toner',
    category: 'Wanita',
    subcategory: { id: 2, name: 'Toner', slug: 'toner', category: 'Wanita' },
    tagline: 'Segarkan dan cerahkan kulit',
    description: 'Toner dengan AHA dan Vitamin C untuk mengangkat sel kulit mati dan mencerahkan.',
    ingredients: 'AHA 5%, Vitamin C, Rose Water, Glycerin',
    benefits: ['Mengangkat sel kulit mati', 'Mengecilkan pori-pori', 'Menyegarkan kulit', 'Mempersiapkan kulit untuk serum'],
    howToUse: ['Tuangkan ke kapas', 'Usapkan lembut ke wajah', 'Hindari area mata', 'Gunakan setelah cleanser'],
    images: [],
    imageUrl: null,
    sortOrder: 7,
    isNew: true,
    isFeatured: true,
    price: 109000,
  },
  {
    id: 8,
    name: 'Baby Lotion Calm',
    category: 'Anak',
    subcategory: { id: 30, name: 'Baby Lotion', slug: 'baby-lotion', category: 'Anak' },
    tagline: 'Lembut dan menenangkan',
    description: 'Lotion bayi dengan shea butter dan chamomile untuk kulit lembut si kecil.',
    ingredients: 'Shea Butter, Chamomile Extract, Vitamin E, Almond Oil',
    benefits: ['Melembapkan kulit bayi', 'Menenangkan iritasi', 'Aroma lembut menenangkan', 'Cocok untuk kulit sensitif'],
    howToUse: ['Tuangkan secukupnya ke telapak tangan', 'Ratakan ke seluruh tubuh bayi', 'Pijat lembut dengan gerakan melingkar', 'Gunakan setelah mandi'],
    images: [],
    imageUrl: null,
    sortOrder: 8,
    isPromo: true,
    price: 65000,
  },
]

export const fallbackTestimonials: Testimonial[] = [
  { id: 1, name: 'Siti A.', content: 'Kulit saya tidak pernah secerah ini. Serum glow-nya benar-benar bekerja!', rating: '5' },
  { id: 2, name: 'Budi P.', content: 'Produk pria sangat praktis. Tidak lengket dan menyegarkan setelah olahraga.', rating: '5' },
  { id: 3, name: 'Rina M.', content: 'Sabun mandi anak sangat lembut, anak saya tidak pernah komplain pedih di mata lagi.', rating: '5' },
  { id: 4, name: 'Dewi K.', content: 'Pengalaman mewah dengan harga yang sangat sepadan. Kemasannya sangat cantik.', rating: '5' },
]

export const fallbackHomepageContent: Record<string, string> = {
  section_kategori_title: 'Koleksi Berdasarkan Kategori',
  section_kategori_subtitle: 'Temukan alat kecantikan yang sesuai dengan kebutuhanmu',
  section_unggulan_title: 'Pilihan Terbaik Kami',
  section_unggulan_subtitle: 'Rekomendasi produk terbaik yang wajib kamu coba',
  section_promo_title: 'Penawaran Terbatas',
  section_promo_subtitle: 'Dapatkan produk favorit dengan harga spesial sebelum kehabisan!',
  section_terbaru_title: '  ',
  section_terbaru_subtitle: 'Kenalan dengan produk-produk baru kami',
  section_features_title: 'Mengapa Rindang Cemara Sukses?',
  section_features_subtitle: 'Kami berkomitmen menghadirkan yang terbaik untuk kecantikan Anda',
  section_testimonials_title: 'Apa Kata Mereka',
  section_testimonials_subtitle: 'Testimoni dari pelanggan setia Rindang Cemara Sukses',
  about_title: 'Inovasi untuk Kecantikan',
  about_text1: 'Rindang Cemara Sukses menghadirkan alat kecantikan berkualitas tinggi yang menggabungkan teknologi modern dengan desain elegan.',
  about_text2: 'Setiap produk dirancang dengan teliti menggunakan material terbaik untuk hasil maksimal.',
  about_quote: 'Kecantikan sejati memancar ketika Anda merasa nyaman dengan kulit Anda sendiri.',
  newsletter_title: 'Dapatkan Update Terbaru',
  newsletter_subtitle: 'Berlangganan untuk info produk baru dan penawaran eksklusif.',
}

export function formatPrice(price?: number | null): string {
  if (price == null) return ''
  return 'Rp ' + price.toLocaleString('id-ID')
}
