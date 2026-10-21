// Tipos centrais de dados musicais. Nada aqui conhece a interface.

/** Casa por corda, da 6ª (Mi grave) à 1ª (Mi agudo). -1 = não tocar, 0 = solta. */
export type Frets = [number, number, number, number, number, number]
/** Dedo por corda (1 indicador … 4 mínimo), 0 = sem dedo. */
export type Fingers = [number, number, number, number, number, number]

export interface Barre {
  fret: number
  /** Corda inicial e final da pestana (6 = Mi grave, 1 = Mi agudo). */
  fromString: number
  toString: number
  finger: number
}

export interface ChordShape {
  /** Identificador único da forma, ex. "C@x32010". */
  id: string
  /** Nome exibido, como aparece no material. */
  name: string
  frets: Frets
  fingers: Fingers
  barres?: Barre[]
  /** Corda do baixo/fundamental marcada no material (6..1), se houver. */
  rootString?: number
  /** De onde veio a forma. */
  source: string
  /** Observações de revisão (ambiguidades encontradas no material). */
  note?: string
}

export type SyncStatus =
  /** Áudio gravado e tempos marcados sobre ele. */
  | 'synced'
  /** Sem áudio: tempo de cada troca estimado pela posição na cifra; segue o metrônomo. */
  | 'estimated'
  /** Só a cifra, sem dados de tempo. */
  | 'chords-only'

export interface ChordAt {
  chord: string
  /** Posição do acorde em caracteres sobre a linha da letra. */
  col: number
}

export interface SongLine {
  lyric: string
  chords: ChordAt[]
  /** Compassos que a linha ocupa (padrão da música se ausente). */
  bars?: number
}

export interface SongSection {
  name: string
  lines: SongLine[]
}

export interface StrumPattern {
  name: string
  /** Ex.: "B C B C" ou setas "↓ ↑ ↓ ↑"; uma entrada por subdivisão. */
  strokes: string[]
  source: string
}

export interface Song {
  id: string
  title: string
  artist?: string
  category: 'harpa' | 'louvor' | 'corinho' | 'exercicio'
  /** Número na Harpa Cristã, quando houver. */
  harpa?: number
  difficulty: 1 | 2 | 3
  key: string
  bpm: number
  beatsPerBar: number
  /** Compassos por linha de letra quando a linha não especifica. */
  barsPerLine: number
  source: { file: string; page?: number }
  sync: SyncStatus
  audio?: { url: string; offsetSec: number }
  strum?: StrumPattern
  /** Forma preferida para cada acorde (nome → id da forma). */
  shapes?: Record<string, string>
  sections: SongSection[]
  /** Ordem de execução por nome de seção (ex.: refrão após cada estrofe). Ausente = ordem impressa. */
  arrangement?: string[]
  /** Produto que libera a música; ausente = grátis. */
  product?: string
  reviewNotes?: string[]
}

/** Evento de troca de acorde na linha do tempo, em batidas desde o início. */
export interface ChordEvent {
  chord: string
  beat: number
  durationBeats: number
  sectionIndex: number
  lineIndex: number
}

export interface LyricEvent {
  beat: number
  durationBeats: number
  sectionIndex: number
  lineIndex: number
  sectionName: string
  line: SongLine
}

export interface Timeline {
  chords: ChordEvent[]
  lines: LyricEvent[]
  totalBeats: number
  beatsPerBar: number
}
