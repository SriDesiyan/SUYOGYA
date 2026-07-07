import { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: keyof T | string
  header: React.ReactNode
  render?: (row: T, index: number) => React.ReactNode
  sortable?: boolean
  align?: 'left' | 'right' | 'center'
  width?: string
  sortAccessor?: (row: T) => number | string
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  rowKey: (row: T) => string
  onRowClick?: (row: T) => void
  className?: string
  dense?: boolean
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  onRowClick,
  className,
  dense,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' } | null>(null)

  const sorted = useMemo(() => {
    if (!sort) return data
    const col = columns.find((c) => String(c.key) === sort.key)
    if (!col) return data
    const accessor =
      col.sortAccessor ?? ((row: T) => (row as Record<string, unknown>)[String(col.key)] as number | string)
    return [...data].sort((a, b) => {
      const av = accessor(a)
      const bv = accessor(b)
      const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv))
      return sort.dir === 'asc' ? cmp : -cmp
    })
  }, [data, sort, columns])

  const toggleSort = (key: string) =>
    setSort((prev) =>
      prev?.key === key
        ? prev.dir === 'asc'
          ? { key, dir: 'desc' }
          : null
        : { key, dir: 'asc' },
    )

  const alignClass = { left: 'text-left', right: 'text-right', center: 'text-center' }

  return (
    <div className={cn('w-full overflow-x-auto rounded-2xl border border-line bg-surface', className)}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line">
            {columns.map((col) => {
              const key = String(col.key)
              const active = sort?.key === key
              return (
                <th
                  key={key}
                  style={{ width: col.width }}
                  className={cn(
                    'bg-ink-50/60 px-4 py-3 text-2xs font-semibold uppercase tracking-wider text-content-subtle',
                    alignClass[col.align ?? 'left'],
                  )}
                >
                  {col.sortable ? (
                    <button
                      onClick={() => toggleSort(key)}
                      className={cn(
                        'inline-flex items-center gap-1 transition-colors hover:text-content',
                        active && 'text-sbi-600',
                        col.align === 'right' && 'flex-row-reverse',
                      )}
                    >
                      {col.header}
                      {active ? (
                        sort.dir === 'asc' ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-3 w-3 opacity-40" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <motion.tr
              key={rowKey(row)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: Math.min(i * 0.02, 0.3) }}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'border-b border-line/70 transition-colors last:border-0',
                onRowClick && 'cursor-pointer hover:bg-sbi-50/40',
              )}
            >
              {columns.map((col) => {
                const key = String(col.key)
                return (
                  <td
                    key={key}
                    className={cn(
                      dense ? 'px-4 py-2.5' : 'px-4 py-3.5',
                      'text-content',
                      alignClass[col.align ?? 'left'],
                    )}
                  >
                    {col.render
                      ? col.render(row, i)
                      : String((row as Record<string, unknown>)[key] ?? '')}
                  </td>
                )
              })}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
