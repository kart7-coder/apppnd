// Favoritos, progresso e histórico no Supabase (tabelas em supabase/schema.sql).
import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { useAuth } from './auth'

export type ItemType = 'song' | 'chord' | 'method' | 'lesson'

export function useFavorites(type: ItemType) {
  const { user } = useAuth()
  const [ids, setIds] = useState<string[]>([])

  useEffect(() => {
    if (!user) return
    supabase
      .from('favorites')
      .select('item_id')
      .eq('user_id', user.id)
      .eq('item_type', type)
      .then(({ data }) => setIds(((data as { item_id: string }[] | null) ?? []).map((d) => d.item_id)))
  }, [user, type])

  const toggle = useCallback(
    async (id: string) => {
      if (!user) return
      const isFav = ids.includes(id)
      setIds((prev) => (isFav ? prev.filter((x) => x !== id) : [...prev, id]))
      const q = isFav
        ? supabase.from('favorites').delete().match({ user_id: user.id, item_type: type, item_id: id })
        : supabase.from('favorites').insert({ user_id: user.id, item_type: type, item_id: id })
      const { error } = await q
      if (error) setIds((prev) => (isFav ? [...prev, id] : prev.filter((x) => x !== id)))
    },
    [user, ids, type],
  )

  return { ids, isFav: (id: string) => ids.includes(id), toggle }
}

export interface ProgressData {
  plays?: number
  completions?: number
  bestSpeed?: number
  practicedSec?: number
  done?: boolean
  lastAt?: string
}

export async function saveProgress(userId: string, type: ItemType, id: string, patch: (old: ProgressData) => ProgressData) {
  const { data } = await supabase
    .from('progress')
    .select('data')
    .match({ user_id: userId, item_type: type, item_id: id })
    .maybeSingle()
  const next = { ...patch(((data as { data: ProgressData } | null)?.data ?? {}) as ProgressData), lastAt: new Date().toISOString() }
  await supabase.from('progress').upsert({ user_id: userId, item_type: type, item_id: id, data: next, updated_at: new Date().toISOString() })
  return next
}

export function useProgress(type: ItemType) {
  const { user } = useAuth()
  const [map, setMap] = useState<Record<string, ProgressData>>({})
  useEffect(() => {
    if (!user) return
    supabase
      .from('progress')
      .select('item_id,data')
      .eq('user_id', user.id)
      .eq('item_type', type)
      .then(({ data }) => {
        const m: Record<string, ProgressData> = {}
        for (const r of (data as { item_id: string; data: ProgressData }[] | null) ?? []) m[r.item_id] = r.data
        setMap(m)
      })
  }, [user, type])
  return map
}

export async function logHistory(userId: string, type: ItemType, id: string, title: string) {
  await supabase.from('history').insert({ user_id: userId, item_type: type, item_id: id, title })
}

export interface HistoryRow {
  item_type: ItemType
  item_id: string
  title: string
  seen_at: string
}

export function useHistory(limit = 20) {
  const { user } = useAuth()
  const [rows, setRows] = useState<HistoryRow[]>([])
  useEffect(() => {
    if (!user) return
    supabase
      .from('history')
      .select('item_type,item_id,title,seen_at')
      .eq('user_id', user.id)
      .order('seen_at', { ascending: false })
      .limit(limit * 3)
      .then(({ data }) => {
        const seen = new Set<string>()
        const out: HistoryRow[] = []
        for (const r of (data as HistoryRow[] | null) ?? []) {
          const k = r.item_type + r.item_id
          if (seen.has(k)) continue
          seen.add(k)
          out.push(r)
          if (out.length >= limit) break
        }
        setRows(out)
      })
  }, [user, limit])
  return rows
}
