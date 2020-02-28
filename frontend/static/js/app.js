$(function () {

// ----------------------------------------
// FUNCTIONS

    function deleteBookById(id) {
        $.ajax({
            url: "http://127.0.0.1:8000/book/" + id,
            data: {},
            type: "DELETE",
            dataType: "json"
        }).done(function (bookJSON) {
            console.log('Book of id = ' + id + ' DELETED');
            readViewBooks();
        }).fail(function (xhr, status, err) {
        }).always(function (xhr, status) {
        });
    }

    function detailEventBookRowAndViewBookDetails(row) {
        let rowDetailsButton = row.find('#details-button');
        rowDetailsButton.on('click', function () {
            console.log('Details book modal under construction. Book id = ' + $(this).data('id'));
            $.ajax({
                url: "http://127.0.0.1:8000/book/" + $(this).data('id'),
                data: {},
                type: "GET",
                dataType: "json"
            }).done(function (bookJSON) {
                console.log('Book of id = ' + $(this).data('id') + ' READ');
                console.log(bookJSON);
                let tableDetail = $(`<ul>
                      <li>ID: "${bookJSON.id}"</li>
                      <li>Author: "${bookJSON.author}"</li>
                      <li>Title: "${bookJSON.title}"</li>
                      <li>ISBN: "${bookJSON.isbn}"</li>
                      <li>Genre: "${bookJSON.genre}"</li>
                      </ul>`);
                $('#detailsModalCenter .modal-body').text(tableDetail);
            }).fail(function (xhr, status, err) {
            }).always(function (xhr, status) {
            })
        });
        return row;
    }

    function deleteEventBookRowAndBookDelete(row) {
        let rowDeleteButton = row.find('#delete-button');
        rowDeleteButton.on('click', function () {
            console.log('Delete confirmation modal under construction. Book id = ' + $(this).data('id'));
            $('#deleteModalCenter .modal-body').text('Please confirm delete book of ' + row.find('#title').text());
            $('#deleteModalCenter .btn-primary').on('click', function () {
                deleteBookById(rowDeleteButton.data('id'));
            });
        });
        return row;
    }

    function newBookRow(bookJSON) {
        let newBookTr = $(`<tr id="books-tr"><td id="title">"${bookJSON.title}"</td>
              <td id="details"><button class="btn btn-primary" id="details-button" data-id="${bookJSON.id}" 
              data-toggle="modal" data-target="#detailsModalCenter">Details</button></td>
              <td id="delete"><button class="btn btn-danger" id="delete-button" data-id="${bookJSON.id}" 
              data-toggle="modal" data-target="#deleteModalCenter">Delete</button></td></tr>`);
        newBookTr = detailEventBookRowAndViewBookDetails(newBookTr);
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

    function readViewBooks() {
        $.ajax({
            url: "http://127.0.0.1:8000/book/",
            data: {},
            type: "GET",
            dataType: "json"
        }).done(function (booksJSON) {
            console.log(booksJSON);
            viewBooks(booksJSON);
        }).fail(function (xhr, status, err) {
        }).always(function (xhr, status) {
        });
    }


// ----------------------------------------
// MAIN

    // preparation
    const TEMPLATE_BOOK_TR = '<tr id="books-tr"><td id="title"></td><td id="details"><button class="btn btn-secondary" id="details-button" data-id="" data-toggle="modal" data-target="#detailsModalCenter">Details</button></td>\n' +
        '<td id="delete"><button class="btn btn-warning" id="delete-button" data-toggle="modal" data-target="#deleteModalCenter">Delete</button></td></tr>';
    $('#books-tr-template').css('display', 'none');

    // start
    readViewBooks();

});