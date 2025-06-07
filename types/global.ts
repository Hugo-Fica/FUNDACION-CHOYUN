export interface BaseModel {
  id: string
  createdAt: Date
  updatedAt: Date
}

export type RouteParams = {
  params: {
    id: string
  }
}
