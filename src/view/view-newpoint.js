import { createElement } from '../render.js';
import { humanizeDateTime } from '../presenter/util.js';
import { cities } from '../mock/point.js';
import { getOffers } from '../mock/offers.js';
import { pointType } from '../mock/point.js';

const offerTemplate = (title, price, checked) => (
  `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" ${checked}>

    <label class="event__offer-label" for="event-offer-luggage-1">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>
  `
);

const getAllOffersId = (type, offersInner) => {
  const listOfAllOffers = getOffers().find((offer) => offer.type === type).offers;

  let checked = null;
  const finalListOfOffers = [];

  for (let i = 0; i < listOfAllOffers.length; i++) {
    if (offersInner[i]) {
      checked = listOfAllOffers[i].id === offersInner[i].id ? 'checked' : '';
    } else {
      checked = '';
    }
    finalListOfOffers.push(offerTemplate(listOfAllOffers[i].title, listOfAllOffers[i].price, checked));
  }
  return finalListOfOffers.join('');
};

const offersTemplateContainer = (allOffers) => {
  if (allOffers !== '') {
    return (
      `
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${allOffers}
          </div>
        </section>
      `
    );
  }
  return '';
};

const iconsTypesMarking = (typeInner, checked) => (
  `
    <div class="event__type-item">
      <input id="event-type-${typeInner}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeInner}" ${checked}>
      <label class="event__type-label  event__type-label--${typeInner}" for="event-type-${typeInner}-1">${typeInner}</label>
    </div>
  `
);

const iconsTypesChecked = (typeInner) => {
  const iconsListMarking = [];
  let checked = '';
  for (let i = 0; i < pointType.length; i++) {
    checked = typeInner === pointType[i] ? 'checked' : '';
    iconsListMarking.push(iconsTypesMarking(pointType[i], checked));
  }
  return iconsListMarking.join('');
};

const createPictureTemplate = (photo) => (`
  <img class="event__photo" src="${photo.src}" alt="Event photo">
`);
const createphotoTemplate = (destination) => destination.photo.length ? destination.photo.map(createPictureTemplate).join('') : '';

const createCityTemplate = (city) => (`
    <option value="${city}"></option>
`);
const createCitiesTemplate = (city) => city.length ? city.map(createCityTemplate).join('') : '';

const createNewPointTemplate = (point) => {
  const { dateFrom, dateTo, destination, offers, type } = point;
  const allOffersByType = getAllOffersId(type, offers);
  const offersContainer = offersTemplateContainer(allOffersByType);
  const photoTemplate = createphotoTemplate(destination);

  return (`
<li class="trip-events__item">
<form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${iconsTypesChecked(type)}
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
      <datalist id="destination-list-1">
      ${createCitiesTemplate(cities)}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDateTime(dateFrom)}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDateTime(dateTo)}">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Cancel</button>
  </header>
  <section class="event__details">
  ${offersContainer}
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${photoTemplate}
        </div>
      </div>
    </section>
  </section>
</form>
</li>
`);
};

export default class NewPointView {
  constructor(point) {
    this.point = point;
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(createNewPointTemplate(this.point));
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
