"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export function usePaginatedQuery<T>(
  table: string,
  {
    orderBy = 'created_at',
    ascending = false,
    pageSize = 10,
    search = '',
    searchFields = [],
  }: {
    orderBy?: string
    ascending?: boolean
    pageSize?: number
    search?: string
    searchFields?: string[]
  } = {}
) {
  const [data, setData]       = useState<T[]>([])
  const [count, setCount]     = useState(0)
  const [page, setPage]       = useState(1)
  const [loading, setLoading] = useState(true)

  // Reset to page 1 whenever the search term changes
  useEffect(() => {
    setPage(1)
  }, [search])

  useEffect(() => {
    async function fetchPage() {
      setLoading(true)
      const from = (page - 1) * pageSize
      const to   = from + pageSize - 1

      let query = supabase
        .from(table)
        .select('*', { count: 'exact' })
        .range(from, to)
        .order(orderBy, { ascending })

      if (search && searchFields.length) {
        const orFilter = searchFields
          .map((field) => `${field}.ilike.%${search}%`)
          .join(',')
        query = query.or(orFilter)
      }

      const { data, count, error } = await query

      if (!error) {
        setData(data ?? [])
        setCount(count ?? 0)
      }
      setLoading(false)
    }
    fetchPage()
  }, [table, page, search, JSON.stringify(searchFields)])

  const pageCount = Math.ceil(count / pageSize)

  return { data, page, setPage, pageCount, loading }
}