'use strict';

const main = document.querySelector('main');
const cards = document.querySelector('.cards');
const onloadPara = document.querySelector('.onload');
const loader = document.querySelector('.loader');
const search = document.querySelector('.search');

search.addEventListener('focus', (e) => {
	search.setAttribute('placeholder', `Search title...`);
});

search.addEventListener('focusout', (e) => {
	search.removeAttribute('placeholder');
});

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
	e.preventDefault();
	let value = search.value.trim().replaceAll(' ', '+');
	cards.innerHTML = '';

	// Creates loading circle
	const loader = document.createElement('div');
	loader.classList.add('loader');
	main.appendChild(loader);

	// Removes the paragraph that is displayed on initial page load
	onloadPara.remove();

	fetch(`https://www.googleapis.com/books/v1/volumes?q=${value}&maxResults=40&key=AIzaSyDVUUbEMD8Fj4JB5wajI7V-Us_cvsqKM80`)
		.then((res) => res.json())
		.then((data) => {
			const books = data.items;

			function showMore(span, button, first, last) {
				span.innerHTML = first + last;
				button.removeEventListener('click', showMore.bind(null, span, button, first, last));
				button.addEventListener('click', showLess.bind(null, span, button, first, last));
				button.textContent = '-----------------Show less-----------------';
				button.style.position = 'static';
				button.style.height = 'unset';
			}

			function showLess(span, button, first, last) {
				span.innerHTML = first + '...';
				button.removeEventListener('click', showLess.bind(null, span, button, first, last));
				button.addEventListener('click', showMore.bind(null, span, button, first, last));
				button.textContent = '-----------------Show more-----------------';
				button.style.position = 'absolute';
				button.style.height = '5rem';
			}

			books.forEach((book) => {
				let info = book.volumeInfo;
				const div = document.createElement('div');
				div.classList.add('card');

				div.innerHTML = `
                    <img src=${info.imageLinks?.thumbnail || './assets/No_Image_Available.jpg'} alt="cover photo">
					<div>
                        <p>${info.title}</p>
                        <p><b>Author: </b>${info.authors ? info.authors.join(', ') : 'Unlisted'}</p>
                        <p><b>Publisher:</b> ${info.publisher || 'Unlisted'}</p>
                        <p><b>Pages:</b> ${info.pageCount || 'Unlisted'}</p>
                        <p><b>Language:</b> ${info.language || 'Unlisted'}</p>
                        <p><b>Categories:</b> ${info.categories ? info.categories.join(', ') : 'Unlisted'}</p>
                        <p><b>Date published:</b> ${info.publishedDate || 'Unlisted'}</p>
                    </div>
                    <p class="description"> <span>${info.description || 'Unlisted'}</span></p>
                `;

				if (info.description?.length > 500) {
					let first = info.description.slice(0, 520);
					let last = info.description.slice(520);

					const span = div.querySelector('span');
					const p = div.querySelector('.description');
					const button = document.createElement('button');

					showLess.call(null, span, button, first, last);
					button.addEventListener('click', showMore.bind(null, span, button, first, last));

					p.appendChild(button);
				}

				cards.appendChild(div);
			});

			loader.remove();
		});
	form.reset();
});
