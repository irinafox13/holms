import {setupWorker} from 'msw/browser';

import {feedbackForm} from './feedback.js';
import {bookingForm} from './booking.js';
import {propertyData} from './getPropertyData.js';
import {apartmentData} from './getApartmentData.js';

export const feedback = setupWorker(...feedbackForm);
export const booking = setupWorker(...bookingForm);
export const getPropertyData = setupWorker(...propertyData);
export const getApartmentData = setupWorker(...apartmentData);
