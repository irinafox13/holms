import { http, HttpResponse } from 'msw'

import { routes } from '../routes'

export const exampleHandlers = [
  http.get(routes.example, () => {
    return HttpResponse.json({
      title: 'Сборка проекта на Vite',
    }, { status: 200 })
  })
]