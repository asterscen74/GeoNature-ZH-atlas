export interface Image {
  label: string
  url: string
}

export interface ZoneHumide {
  id: number
  nom: string
  slug: string
  code: string
  date: Date
  type: string
  type_code: number
  bassin_versant: string[]
  superficie: number
  operateur: string
  criteres_delim: string[]
  images: Image[]
  communes: string[]
}
