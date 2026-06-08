"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export function usePaginatedQuery<T>(
  table: string,
  { orderBy = 'created_at', ascending = false, pageSize = 10 } = {}
) {
  const [data, setData]       = useState<T[]>([])
  const [count, setCount]     = useState(0)
  const [page, setPage]       = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPage() {
      setLoading(true)
      const from = (page - 1) * pageSize
      const to   = from + pageSize - 1

      const { data, count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .range(from, to)
        .order(orderBy, { ascending })

      if (!error) {
        setData(data ?? [])
        setCount(count ?? 0)
      }
      setLoading(false)
    }
    fetchPage()
  }, [table, page])

  const pageCount = Math.ceil(count / pageSize)

  return { data, page, setPage, pageCount, loading }
}