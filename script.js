'use strict';
// Add dark and light mode

// User is able to click an author to go to author page

// Add a button for selecting between title and author.
// It should be on the inner right side of the search input and it should match it's aesthetic (no border etc)
// A pipe symbol separates the search and the search mode button

let currentSearch = 'title';
const main = document.querySelector('main');
const cards = document.querySelector('.cards')
const dialog = document.querySelector('dialog');
const onloadPara = document.querySelector('.onload')
const closeBtn = document.querySelector('dialog button');
const search = document.querySelector('.search');
search.addEventListener('focus', (e) => {
	search.setAttribute('placeholder', `Search ${currentSearch}...`);
});

search.addEventListener('focusout', (e) => {
	search.removeAttribute('placeholder');
});

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
	e.preventDefault();
	let value = search.value.replaceAll(' ', '+');
	cards.innerHTML = '';

	fetch(`https://www.googleapis.com/books/v1/volumes?q=${value}&key=AIzaSyDVUUbEMD8Fj4JB5wajI7V-Us_cvsqKM80`)
		.then((res) => res.json())
		.then((data) => {
			const books = data.items;
            onloadPara.remove()
			books.forEach((book) => {
                console.log(book)
				let info = book.volumeInfo;
				const div = document.createElement('div');
				div.classList.add('card');
				div.innerHTML = `
                    <img src=${info.imageLinks?.thumbnail || './assets/No_Image_Available.jpg'} alt="cover photo">
					<div>
                        <p>${info.title}</p>
                        <p>Author: ${info.authors? info.authors.join(', ') : 'Unlisted'}</p>
                        <p>Publisher: ${info.publisher}</p>
                        <p>Pages: ${info.pageCount}</p>
                        <p>Languages:</p>
                        <p>Categories: ${info.categories ? info.categories.join(', ') : 'Unlisted'}</p>
                        <p>Date published: ${info.publishedDate}</p>
                    </div>
                    <p class="description">${info.description || 'Unlisted'}</p>
            `;
				cards.appendChild(div);
			});
		});
	form.reset();
});
