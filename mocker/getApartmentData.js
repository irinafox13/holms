import {http, HttpResponse} from 'msw';

import {routes} from '../routes';

export const apartmentData = [
  http.get(routes.getApartmentData, () => {
    return HttpResponse.json(
      {
        success: true,
        data: {
          id: '1',
          type: 'apartment',
          info: [
            {
              name: 'Квартира',
              value: '№ 18',
            },
            {
              name: 'Площадь',
              value: '78.50 м2',
            },
            {
              name: 'Этаж',
              value: '4',
            },
            {
              name: 'Отделка',
              value: 'Чистовая',
            },
          ],
          price: '17 450 000 ₽',
          images: ['/images/office.png', '/images/office.png', '/images/office.png'],
        },
      },
      {status: 200},
    );
  }),
];
