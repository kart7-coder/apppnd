import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { registerShapes } from '../../music/chordDb'
import type { ChordShape } from '../../music/types'
import { TONE_DO } from './do'
import { FREE_TONE, type MethodTone } from './types'

export * from './types'

registerShapes(allToneShapes(TONE_DO))

const cache = new Map<string, MethodTone>([[TONE_DO.id, TONE_DO]])
const listeners = new Set<() => void>()

export function allToneShapes(t: MethodTone): ChordShape[] {
  return [...t.degrees.flatMap((d) => d.shapes), ...t.sequences.flatMap((s) => s.options.flat())]
}

export type ToneState = { status: 'loading' } | { status: 'ok'; tone: MethodTone } | { status: 'locked' } | { status: 'error'; message: string }

/**
 * Tom de Dó vem no app (amostra grátis). Os demais ficam na tabela premium_content
 * do Supabase, protegidos por RLS: só quem tem o produto consegue ler.
 */
export function useMethodTone(id: string): ToneState {
  const [state, setState] = useState<ToneState>(() => {
    const t = cache.get(id)
    return t ? { status: 'ok', tone: t } : { status: 'loading' }
  })
  useEffect(() => {
    const cached = cache.get(id)
    if (cached) return setState({ status: 'ok', tone: cached })
    if (id === FREE_TONE || id.startsWith('__')) return
    let alive = true
    setState({ status: 'loading' })
    supabase
      .from('premium_content')
      .select('data')
      .eq('id', `method-${id}`)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!alive) return
        if (error) return setState({ status: 'error', message: 'Não foi possível carregar. Verifique sua conexão.' })
        if (!data) return setState({ status: 'locked' })
        const tone = (data as { data: MethodTone }).data
        cache.set(id, tone)
        registerShapes(allToneShapes(tone))
        listeners.forEach((l) => l())
        setState({ status: 'ok', tone })
      })
    return () => {
      alive = false
    }
  }, [id])
  return state
}

/** Formas do método já carregadas (para o dicionário de acordes). */
export function useMethodShapes(): ChordShape[] {
  const [, force] = useState(0)
  useEffect(() => {
    const l = () => force((x) => x + 1)
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  }, [])
  return [...cache.values()].flatMap(allToneShapes)
}
