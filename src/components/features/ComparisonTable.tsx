import { X } from 'lucide-react'
import { Button } from '../ui/button'
import type { Product } from '../../data/products'

interface ComparisonTableProps {
  products: Product[]
  onRemove: (id: number) => void
}

export function ComparisonTable({ products, onRemove }: ComparisonTableProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Pilih produk untuk dibandingkan</p>
      </div>
    )
  }

  const rows = [
    { label: 'Kategori', value: (p: Product) => p.category },
    { label: 'Tagline', value: (p: Product) => p.tagline },
    { label: 'Manfaat', value: (p: Product) => p.benefits?.join(', ') || '-' },
    { label: 'Cara Pakai', value: (p: Product) => p.howToUse?.join(', ') || '-' },
    { label: 'Material', value: (p: Product) => p.ingredients || '-' },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left p-3 font-medium text-muted-foreground w-32" />
            {products.map((p) => (
              <th key={p.id} className="p-3 text-left min-w-[200px]">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-semibold">{p.name}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onRemove(p.id)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-border">
              <td className="p-3 font-medium text-muted-foreground">{row.label}</td>
              {products.map((p) => (
                <td key={p.id} className="p-3 text-foreground">
                  {row.value(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
