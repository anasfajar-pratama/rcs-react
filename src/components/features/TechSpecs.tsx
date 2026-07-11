interface TechSpecsProps {
  specs: { label: string; value: string }[]
}

export function TechSpecs({ specs }: TechSpecsProps) {
  return (
    <div className="space-y-3">
      <h4 className="font-heading font-semibold text-sm">Spesifikasi Teknis</h4>
      <div className="rounded-xl border border-border divide-y divide-border">
        {specs.map((spec) => (
          <div key={spec.label} className="flex items-center justify-between gap-4 px-4 py-3">
            <span className="text-sm text-muted-foreground">{spec.label}</span>
            <span className="text-sm font-medium text-justify">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
