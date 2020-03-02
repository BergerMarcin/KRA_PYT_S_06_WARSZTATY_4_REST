$(function () {


// ----------------------------------------
// CRUD FUNCTIONS (& VIEW CONTROLLER via MODAL; in order CRUD)

    function addBook(book) {
        console.log(book);
        $.ajax({
            url: MAIN_APP_URL + 'book/',
            data: book,
            type: "POST",
            dataType: "json"
        }).done(function (bookJSON) {
            console.log('Book of id = ' + bookJSON.id + ' ADDED');
            console.log(bookJSON);
            readViewAllBooks();
        }).fail(function (xhr, status, err) {
        }).always(function (xhr, status) {
        });
    }

    function readViewDetailsBook(id) {
        console.log('Details book modal under construction. Book id = ' + id);
        $.ajax({
            url: MAIN_APP_URL + 'book/' + id,
            data: {},
            type: "GET",
            dataType: "json"
        }).done(function (bookJSON) {
            console.log('Book of id = ' + id + ' READ');
            console.log(bookJSON);
            let tableDetail = $(`
                      <p>ID: ${bookJSON.id}</p>
                      <p>Author: ${bookJSON.author}</p>
                      <p>Title: "${bookJSON.title}"</p>
                      <p>ISBN: ${bookJSON.isbn}</p>
                      <p>Publisher: "${bookJSON.publisher}"</p>
                      <p>Genre: ${GENRES[bookJSON.genre]}</p>
                      `);
            $('#detailsModalCenter .modal-body').text('');
            $('#detailsModalCenter .modal-body').prepend(tableDetail);
        }).fail(function (xhr, status, err) {
        }).always(function (xhr, status) {
        })
    }

    function readViewAllBooks() {
        $.ajax({
            url: MAIN_APP_URL + 'book/',
            data: {},
            type: "GET",
            dataType: "json"
        }).done(function (booksJSON) {
            console.log('All books READ');
            console.log(booksJSON);
            viewBooks(booksJSON);
        }).fail(function (xhr, status, err) {
        }).always(function (xhr, status) {
        });
    }

    function updateBook(book) {
        console.log(book);
        $.ajax({
            url: MAIN_APP_URL + 'book/' + book.id,
            data: book,
            type: "PUT",
            dataType: "json"
        }).done(function (bookJSON) {
            console.log('Book of id = ' + bookJSON.id + ' UPDATED');
            console.log(bookJSON);
            readViewAllBooks();
        }).fail(function (xhr, status, err) {
        }).always(function (xhr, status) {
        });
    }

    function updateViewBook(id) {
        console.log('Update book modal under construction. Book id = ' + id);
        $.ajax({
            url: MAIN_APP_URL + 'book/' + id,
            data: {},
            type: "GET",
            dataType: "json"
        }).done(function (bookJSON) {
            console.log('Book (to be updated) of id = ' + id + ' READ');
            console.log(bookJSON);
            // fill-in form with values of read existing book
            $('#updateModalCenter #author-update').val(bookJSON.author);
            $('#updateModalCenter #title-update').val(bookJSON.title);
            $('#updateModalCenter #isbn-update').val(bookJSON.isbn);
            $('#updateModalCenter #publisher-update').val(bookJSON.publisher);
            $('#updateModalCenter #genre-update').val(bookJSON.genre);
            // after user update and submit updateBook(book)
            $('#updateModalCenter .btn-primary').on('click', function () {
                let book = {
                    id: id,
                    author: $('#author-update').val(),
                    title: $('#title-update').val(),
                    isbn: $('#isbn-update').val(),
                    publisher: $('#publisher-update').val(),
                    genre: parseInt($('#genre-update').val()),
                };
                // validation
                if (book.author.length > 3 && book.title.length > 2 &&
                    typeof (book.genre) == 'number' && book.genre > 0) {
                    // due to recursion/refreshing readViewAllBooks by updateBook below
                    // event on UPDATE button must be manually switched-off
                    $('#updateModalCenter .btn-primary').off();
                    updateBook(book);
                }
            });

        }).fail(function (xhr, status, err) {
        }).always(function (xhr, status) {
        });
    }


    function deleteBookById(id) {
        $.ajax({
            url: MAIN_APP_URL + 'book/' + id,
            data: {},
            type: "DELETE",
            dataType: "json"
        }).done(function (bookJSON) {
            console.log('Book of id = ' + id + ' DELETED');
            readViewAllBooks();
        }).fail(function (xhr, status, err) {
        }).always(function (xhr, status) {
        });
    }


// ----------------------------------------
// PURE VIEW CONTROLLER FUNCTIONS (in order CRUD)

    function addEventBookAndAddBook() {
        $('#addModalCenter .btn-primary').on('click', function () {
            let book = {
                author: $('#author-add').val(),
                title: $('#title-add').val(),
                isbn: $('#isbn-add').val(),
                publisher: $('#publisher-add').val(),
                genre: parseInt($('#genre-add').val()),
            };
            // validation
            if (book.author.length > 3 && book.title.length > 2 && typeof (book.genre) == 'number' && book.genre > 0) {
                addBook(book);
            }
        });
    }

    function detailEventBookRowAndViewBookDetails(row) {
        let rowDetailsButton = row.find('#details-button');
        rowDetailsButton.on('click', function () {
            readViewDetailsBook(rowDetailsButton.data('id'))
        });
        return row;
    }

    function updateEventBookRowAndBookUpdate(row) {
        let rowUpdateButton = row.find('#update-button');
        rowUpdateButton.on('click', function () {
            updateViewBook(rowUpdateButton.data('id'));
        });
        return row;
    }

    function deleteEventBookRowAndBookDelete(row) {
        let rowDeleteButton = row.find('#delete-button');
        rowDeleteButton.on('click', function () {
            console.log('Delete confirmation modal under construction. Book id = ' + $(this).data('id'));
            $('#deleteModalCenter .modal-body').text('Please confirm delete book of ' + row.find('#title').text());
            $('#deleteModalCenter .btn-primary').on('click', function () {
                // due to recursion/refreshing readViewAllBooks by deleteBookById below
                // event on DELETE button must be manually switched-off
                $('#deleteModalCenter .btn-primary').off();
                deleteBookById(rowDeleteButton.data('id'));
            });
        });
        return row;
    }

    function newBookRow(bookJSON) {
        let newBookTr = $(`<tr id="books-tr"><td id="title">"${bookJSON.title}"</td>
              <td id="details"><button class="btn btn-primary" id="details-button" data-id="${bookJSON.id}" 
              data-toggle="modal" data-target="#detailsModalCenter">Details</button></td>
              <td id="update"><button class='btn btn-warning' id="update-button" data-id="${bookJSON.id}" 
              data-toggle="modal" data-target="#updateModalCenter">Update</button></td>
              <td id="delete"><button class="btn btn-danger" id="delete-button" data-id="${bookJSON.id}" 
              data-toggle="modal" data-target="#deleteModalCenter">Delete</button></td></tr>`);
        newBookTr = detailEventBookRowAndViewBookDetails(newBookTr);
        newBookTr = updateEventBookRowAndBookUpdate(newBookTr);
        newBookTr = deleteEventBookRowAndBookDelete(newBookTr);
        return newBookTr;
    }

    function viewBooks(booksJSON) {
        // Clear the book table (except row of hidden trTemplate)
        let tbody = $('tbody');
        let trTemplate = $('#books-tr-template');
        tbody.empty();
        tbody.append(trTemplate);

        // Adding book rows to the book table
        for (let bookJSON of booksJSON) {
            tbody.append(newBookRow(bookJSON));
        }
    }


// ----------------------------------------
// MAIN


// preparation
    let MAIN_APP_URL = 'http://127.0.0.1:8888/';

    let GENRES = {
        1: "Romans",
        2: "Obyczajowa",
        3: "Sci-fi i fantasy",
        4: "Literatura faktu",
        5: "Popularnonaukowa",
        6: "Poradnik",
        7: "Kryminał, sensacja"
    };
    for (let key in GENRES) {
        $('#addModalCenter #genre-add').append($(`<option value="${key}">${GENRES[key]}</option>`));
        $('#updateModalCenter #genre-update').append($(`<option value="${key}">${GENRES[key]}</option>`));
    }

    $('#books-tr-template').css('display', 'none');


// start
    addEventBookAndAddBook();
    readViewAllBooks();

});
