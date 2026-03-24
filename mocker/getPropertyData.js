import {http, HttpResponse} from 'msw';

import {routes} from '../routes';

export const propertyData = [
  http.get(routes.getPropertyData, () => {
    return HttpResponse.json(
      {
        success: true,
        data: {
          id: '1',
          type: 'offices',
          name: 'Офис № 1',
          number: '130',
          area: '42',
          price: '390 000',
          layout: '/images/office.pdf',
        },
      },
      {status: 200},
    );
  }),
];
