import './css/styles.css';

import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  const query = e.target.value.trim();
  if (query === '') {
    e.target.value = '';
    resetSearchResult();
    return Notiflix.Notify.warning('Search query is empty!');
  }
  fetchCountries(query).then(resolve, rejected);
}

function resolve(response) {
  if (response.length > 10) {
    resetSearchResult();
    return Notiflix.Notify.info('"Too many matches found. Please enter a more specific name."');
  } else if (response.length > 1) {
    resetSearchResult();
    refs.countryList.innerHTML = countryListMarkup(response);
  } else if (response.length === 1) {
    resetSearchResult();
    refs.countryInfo.innerHTML = countryInfoMarkup(response);
  }
}

function rejected(result) {
  resetSearchResult();
  Notiflix.Notify.failure(result);
}

function resetSearchResult() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}

function countryListMarkup(list) {
  return list
    .map(
      country =>
        `<li class="country-item">
        <p class="country-item__name"><img src="${country.flags.svg}">${country.name.official}</p>
      </li>`
    )
    .join('');
}

function countryInfoMarkup(info) {
  return info.map(country => {
    return `<p class="country-item__name">
				<img src="${country.flags.svg}">
				${country.name.official}
			</p>
			<ul class="country-info__list">
				<li class="country-info__row">
					<p>
						<span class="country-info__head">Capital: </span>
						${country.capital}
					</p>
				</li>
				<li class="country-info__row">
					<p>
						<span class="country-info__head">Population: </span>
						${country.population}
					</p>
				</li>
				<li class="country-info__row">
					<p>
						<span class="country-info__head">Languages: </span>
						${Object.values(country.languages).join(',')}
					</p>
				</li>
			</ul>`;
  });
}
