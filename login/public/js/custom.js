$(document).ready(function () {
    //load data via middleware api
    init();

});

function init(){
    //pull data from api into page and initalise click events
    $.getJSON('http://localhost:3001/authors', printAuthorDashboard);
}

function dialogueInit(){
   
}

function initClickEvents(authors){
    loadNewAuthorDialogue();
    loadCommentsDialogue(authors);
    loadNewBookDialogue(authors);
    loadFavoriteClickEvent();
}

function loadFavoriteClickEvent(){
    
    $( ".favourite-click" ).click(function() {
        var bookName   = $(this).attr('book-name');

        noty({layout: "topCenter",timeout: 1000, text: bookName+' has been favourited!', type: 'success'});

    });
}

function loadCommentsDialogue(authors){
    //Load the comments on click of the comments button
    $( "button.load-comments" ).click(function() {
        var authorID   = $(this).attr('author-id');
        var authorName = $(this).attr('author-name');
        var bookName   = $(this).attr('book-name');
        
        var user       = $('.head-username').text();

        noty({

            layout: "topCenter",
            text: 'Comments for '+bookName+'',
            closeWith: ['button'],
            killer: true,
            template: 
                    '<div class="comment-panel panel-body">'+
                        '<div class="text-center"><h5><b>Comments for '+bookName+'</b></h5></div>'+
                        '<div class="new-dialogue">'+
                            '<div class="comment-list"><div class="top-inner"></div></div>' +                            
                        '</div>'+   
                    '</div>',
            buttons: [
                
                {
                    addClass: 'btn btn-success', text: 'Add Comment', onClick: function($noty) {

                        var comment = $('.comment-input').val();


                        if(comment.length < 1){
                            noty({text: 'Error: Comment cannot be blank!', type: 'error'});
                        } else {
                            $.ajax({
                                method: "PUT",
                                url: "http://localhost:3001/author/book/addcomment",
                                data: { 
                                    bookName: bookName, 
                                    bookcomment: comment,
                                    user: user
                            }
                            })
                            .done(function( e, msg ) {
                               noty({
                                    text: 'Success: Comment saved!', 
                                    type: 'success'

                                });
                                var time = new Date(Date.now() * 1000);

                                $( '.top-inner' ).append( $( 
                                    '<div class="comment">' +
                                        '<p><i>'+user+'</i>:<br> '+comment+'<br><span class="comment-time">@ '+time+'</span></p><hr>' +
                                    '</div>'
                                ));

                                //set comment box back to blank
                                $('.comment-input').val('');
                            })
                            .fail(function( msg ) {
                                 noty({text: 'Error: Something went wrong with your request, please try again.', type: 'error'});
                            });
                        }
                    }
                },
                {
                    addClass: 'btn btn-primary', text: 'Close', onClick: function($noty) {                            
                        
                        $noty.close();

                        location.reload();
                    }
                }
            ]
            
        });

        $.each(authors, function(index, author) {
            if(author._id == authorID){                
                $.each(author.authBooks, function(index, books) {
                    
                    if(books.bookName == bookName){
                        
                        $.each(books.bookComments, function(index, comments) {
                            //var time = new Date(comments.time * 1000);
                            var time = comments.time;

                            $( '.comment-list' ).append( $( 
                                '<div class="comment"><p>'+
                                    '<i>'+comments.user+'</i>:<br> '+comments.comment + '<br>' +
                                    '<span class="comment-time">@ '+time+'</span>' +
                                '</p>'+
                                '<hr></div>'
                            ));
                            
                        });
                    }
                });
            }
        });

        $( '.comment-list' ).append( $( 
            '<form id="usr-comment">' +
                '<input type="text" name="comment" class="comment-input">' +                                                   
            '</form>'
        ));
        


    });
}

function refreshPage(){
    top.location.href = top.location.href;
}


function loadNewBookDialogue(authors){
    $( "button.add-book" ).click(function() {
        var authorID   = $(this).attr('author-id');
        var authorName = $(this).attr('author-name');
        var bookName   = $(this).attr('book-name');

        noty({

            layout: "topCenter",
            text: 'Add new book for '+authorName+'',
            closeWith: ['button'],
            killer: true,
            template: 
                    '<div class="comment-panel panel-body">'+
                        '<div class="text-center"><h5><b>Add new book for '+authorName+'</b></h5></div>'+
                        '<div class="new-dialogue">'+
                            '<div class="book-controls"></div>' +                            
                            '<input type="hidden" name="auth-name" class="auth-hidden" author-name="'+authorName+'">' +                            
                        '</div>'+   
                    '</div>',
            buttons: [
                
                {
                    addClass: 'btn btn-success', text: 'Add Book', onClick: function($noty) {
                        
                        var name            = $('.auth-hidden').attr('author-name');
                        var bookName        = $('.title-input').val();
                        var bookDescription = $('.book-description-input').val();

                        if(bookName.length< 1){
                            noty({text: 'Error: Book name cannot be blank!', type: 'error'});
                        } else if(bookDescription.length < 1){
                            noty({text: 'Error: Description cannot be blank!', type: 'error'});
                        } else {
                            $.ajax({
                                method: "PUT",
                                url: "http://localhost:3001/author/addbook",
                                data: { 
                                    authName: name, 
                                    bookName: bookName,
                                    bookDescription: bookDescription
                            }
                            })
                            .done(function( e, msg ) {
                               noty({
                                    layout: "topCenter",
                                    text: 'Success: book saved!', 
                                    type: 'success', 
                                    buttons: [{
                                        addClass: 'btn btn-success', text: 'Ok', onClick: function($noty) {
                                            location.reload();
                                        }
                                    }]
                                });
                                
                            })
                            .fail(function( msg ) {
                                 noty({text: 'Error: Something went wrong with your request, please try again.', type: 'error'});
                            });
                            $noty.close();
                        }

                        
                    }
                },
                {
                    addClass: 'btn btn-primary', text: 'Close', onClick: function($noty) {                            
                        
                        $noty.close();
                    }
                }
            ]
            
        });

        $( '.book-controls' ).append( $( 
            '<label for="title">Title:</label><br>'+
            '<form id="usr-comment" name="title">' +
                '<input type="text" name="comment" class="title-input">' +                                                    
            '</form>'
        ));

        $( '.book-controls' ).append( $( 
            '<label for="description">Description:</label><br>'+
            '<form id="usr-comment" name="description">' +
                '<textarea type="text" name="comment" class="book-description-input comment-input"></textarea>' +                                                    
            '</form>'
        ));


    });
}

function loadNewAuthorDialogue(){

    $(".usr-comment").validate();

    $( ".add-author" ).click(function() {
       
        noty({

            layout: "topCenter",
            text: 'Add new author',
            closeWith: ['button'],
            killer: true,
            template: 
                    '<div class="comment-panel panel-body">'+
                        '<div class="text-center"><h5><b>Add new author</b></h5></div>'+
                        '<div class="new-dialogue">'+
                            '<div class="add-controls"></div>' +                            
                        '</div>'+   
                    '</div>',
            buttons: [
                
                {
                    addClass: 'btn btn-success', text: 'Add Author', onClick: function($noty) {
                        var name        = $('.author-name').val();
                        var description = $('.description-input').val();

                        if(name.length< 1){
                            noty({text: 'Error: Author name cannot be blank!', type: 'error'});
                        } else if(description.length < 1){
                            noty({text: 'Error: Description cannot be blank!', type: 'error'});
                        } else {
                            $.ajax({
                                method: "POST",
                                url: "http://localhost:3001/authors/add",
                                data: { 
                                    authName: name, 
                                    authDescription: description
                            }
                            })
                            .done(function( e, msg ) {
                               noty({
                                    layout: "topCenter",
                                    text: 'Success: Author saved!', 
                                    type: 'success', 
                                    buttons: [{
                                        addClass: 'btn btn-success', text: 'Ok', onClick: function($noty) {
                                            location.reload();
                                        }
                                    }]
                                });
                                
                            })
                            .fail(function( msg ) {
                                 noty({text: 'Error: Something went wrong with your request, please try again.', type: 'error'});
                            });
                            $noty.close();
                        }
                        
                    }
                },
                {
                    addClass: 'btn btn-primary', text: 'Close', onClick: function($noty) {                            
                        //close without saving
                        $noty.close();
                    }
                }
            ]
            
        });

        $( '.add-controls' ).append( $( 
            '<label for="title">Name:</label><br>'+
            '<form id="usr-comment" name="title">' +
                '<input type="text" name="author-name" class="author-name" >' +                                                    
            '</form>'
        ));

        $( '.add-controls' ).append( $( 
            '<label for="description">Description &amp; Biography:</label><br>'+
            '<form id="usr-comment" name="description">' +
                '<textarea type="text" name="author-desc" class="description-input comment-input"></textarea>' +                                                    
            '</form>'
        ));   


    });
}

function printAuthorDashboard(authors) {
    //console.log(authors);
    if(authors && authors.length > 0){
        $.each(authors, function(index, author) {
            if(author._id == null){
                $( ".content" ).append( $( 
                    '<div class="alert alert-danger"><h4>No books in the db</div></h4>'
                ));
            } else {
                
                //build the dashboard page

                $( '.content' ).append( $( 
                    '<div class="row row-pad" id="book-'+author._id+'"></div>'
                ));

                $( '#book-'+author._id ).append( $( 
                    '<h4>'+author.authName+'</h4>'
                ));

                $( '#book-'+author._id ).append( $( 
                    '<p>'+
                        '<i>'+author.authDescription+'</i>'+
                    '</p>'+                
                    '<p>Books by '+author.authName+':</p>'+
                    '<br>'
                ));

                //now get the books from the author array
                var count = 1;
                $.each(author.authBooks, function(index, book) {

                    $( '#book-'+author._id ).append( $( 
                        '<div id="book-'+count+'-'+author._id+'" class="col-md-4 book"></div>'
                    ));

                    $( '#book-'+count+'-'+author._id ).append( $( 
                        '<h5>'+ book.bookName +'</h5>'
                    ));

                    $( '#book-'+count+'-'+author._id ).append( $( 
                        '<p class="book-desc">'+ book.bookDescription +'</p>'
                    ));

                    $( '#book-'+count+'-'+author._id ).append( $( 
                        '<button class="btn btn-success load-comments" author-name="'+author.authName+'" author-id="'+author._id+'"" book-name="'+ book.bookName +'">Comments</button><br>'
                    ));

                    $( '#book-'+count+'-'+author._id ).append( $( 
                        '<button class="btn btn-favourite favourite-click"  author-name="'+author.authName+'" author-id="'+author._id+'"" book-name="'+ book.bookName +'"><i class="fa fa-star" aria-hidden="true"></i></button>'
                    ));

                    count++;
                });

                $( '.content' ).append( $( 
                    '<button class="btn btn-success add-book" author-name="'+author.authName+'" author-id="'+author._id+'"">Add new book</button>'
                ));


                $( '.content' ).append( $( 
                    '<div class="row row-pad"><hr></div>'
                ));
                
            }
        });

        
    } else{
        $( '.content' ).append( $( 
            '<div class="row row-pad"><h4>No authors in the database</h4></div>'
        ));
    }
    
    $( '.content' ).append( $( 
        '<button class="btn btn-success add-author">Add new author</button>'
    ));

    //only load the click events once the dashboard has been rendered
    initClickEvents(authors);
}