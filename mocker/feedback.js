import {http, HttpResponse} from 'msw';

import {routes} from '../routes';

export const feedbackForm = [
  http.post(routes.feedback, () => {
    return HttpResponse.json(
      {
        success: true,
        title: 'Заявка отправлена',
        message: 'Мы свяжемся с вами в ближайшее время',
      },
      {status: 200},
    );
  }),
];
