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
                let tableDetail = $(`
                      <p>ID: ${bookJSON.id}</p>
                      <p>Author: ${bookJSON.author}</p>
                      <p>Title: "${bookJSON.title}"</p>
                      <p>ISBN: ${bookJSON.isbn}</p>
                      <p>Genre: ${bookJSON.genre}</p>
                      `);
                $('#detailsModalCenter .modal-body').text('');
                $('#detailsModalCenter .modal-body').prepend(tableDetail);
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
    GENRES = (
            (1, "Romans"),
            (2, "Obyczajowa"),
            (3, "Sci-fi i fantasy"),
            (4, "Literatura faktu"),
            (5, "Popularnonaukowa"),
            (6, "Poradnik"),
            (7, "Kryminał, sensacja")
    );
    $('#books-tr-template').css('display', 'none');

    // start
    readViewBooks();

});