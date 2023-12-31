import { createElement } from '../render.js';
import { humanizeDate, humanizeTime } from '../util.js';

const createOfferTemplate = ({ title, price }) => (`
  <li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </li>
`);

const pattern = (offers) => offers.length ? offers.map(createOfferTemplate).join('') : '';

const createPointsTemplate = (point) => {
  const { basePrice, dateFrom, dateTo, destination, offers, type } = point;
  const offersTemplate = pattern(offers);

  return (`
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="2019-03-18">${humanizeDate('2019-03-18')}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T14:30">${humanizeTime(dateFrom)}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T16:05">${humanizeTime(dateTo)}</time>
          </p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersTemplate}
        </ul>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `);
};

export default class viewPoints {
  #element = null;

  constructor(point) {
    this.point = point;
  }

  get template() {
    return createPointsTemplate(this.point);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
