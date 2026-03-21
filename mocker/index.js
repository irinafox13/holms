import {setupWorker} from 'msw/browser';

import {exampleHandlers} from './example.js';
import {feedbackForm} from './feedback.js';

export const example = setupWorker(...exampleHandlers);
export const feedback = setupWorker(...feedbackForm);
