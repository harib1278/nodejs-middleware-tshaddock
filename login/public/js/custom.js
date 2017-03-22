$(document).ready(function () {
    //load data via middleware api
    init();

});

function init(){
    //pull data from api into page
    $.getJSON('http://localhost:3001/authors', printAuthorDashboard);
}

function dialogueInit(){
   
}

function initClickEvents(authors){
   
    loadCommentsDialogue(authors);
    loadNewBookDialogue(authors);
}

function loadCommentsDialogue(authors){
    //Load the comments on click of the comments button
    $( "button.load-comments" ).click(function() {
        var authorID   = $(this).attr('author-id');
        var authorName = $(this).attr('author-name');
        var bookName   = $(this).attr('book-name');

        //console.log(bookName);
        //console.log(authorID);

        noty({

            layout: "topCenter",
            text: 'Comments for '+bookName+'',
            closeWith: ['button'],
            killer: true,
            template: 
                    '<div class="comment-panel panel-body">'+
                        '<div class="text-center"><h5><b>Comments for '+bookName+'</b></h5></div>'+
                        '<div class="new-dialogue">'+
                            '<div class="comment-list"></div>' +                            
                        '</div>'+   
                    '</div>',
            buttons: [
                
                {
                    addClass: 'btn btn-success', text: 'Add Comment', onClick: function($noty) {
                        //close without saving
                        $noty.close();
                    }
                },
                {
                    addClass: 'btn btn-primary', text: 'Close', onClick: function($noty) {                            
                        
                        $noty.close();
                    }
                }
            ]
            
        });

        $.each(authors, function(index, author) {
            if(author.id == authorID){                
                $.each(author.authBooks, function(index, books) {
                    
                    if(books.bookName == bookName){
                        
                        $.each(books.bookComments, function(index, comments) {
                            var time = new Date(comments.time * 1000);

                            
                            $( '.comment-list' ).append( $( 
                                '<p>'+
                                    '<i>'+comments.user+'</i>:<br> '+comments.comment + '<br>' +
                                    '<span class="comment-time">@ '+time+'</span>' +
                                '</p>'+
                                '<hr>'
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

function loadNewBookDialogue(authors){
    $( "button.add-book" ).click(function() {
        var authorID   = $(this).attr('author-id');
        var authorName = $(this).attr('author-name');
        var bookName   = $(this).attr('book-name');

        //console.log(bookName);
        //console.log(authorID);

        noty({

            layout: "topCenter",
            text: 'Add new book for '+authorName+'',
            closeWith: ['button'],
            killer: true,
            template: 
                    '<div class="comment-panel panel-body">'+
                        '<div class="text-center"><h5><b>Add new book for '+authorName+'</b></h5></div>'+
                        '<div class="new-dialogue">'+
                            '<div class="comment-list"></div>' +                            
                        '</div>'+   
                    '</div>',
            buttons: [
                
                {
                    addClass: 'btn btn-success', text: 'Add Comment', onClick: function($noty) {
                        //close without saving
                        $noty.close();
                    }
                },
                {
                    addClass: 'btn btn-primary', text: 'Close', onClick: function($noty) {                            
                        
                        $noty.close();
                    }
                }
            ]
            
        });

        $( '.comment-list' ).append( $( 
            '<label for="title">Title:</label><br>'+
            '<form id="usr-comment" name="title">' +
                '<input type="text" name="comment" class="title-input">' +                                                    
            '</form>'
        ));

        $( '.comment-list' ).append( $( 
            '<label for="description">Description:</label><br>'+
            '<form id="usr-comment" name="description">' +
                '<input type="text" name="comment" class="description-input comment-input">' +                                                    
            '</form>'
        ));


    });
}

function printAuthorDashboard(authors) {
    //console.log(authors);
    $.each(authors, function(index, author) {
        if(author.id == null){
            $( ".content" ).append( $( 
                '<div class="alert alert-danger"><h4>No books in the db</div></h4>'
            ));
        } else {
            

            $( '.content' ).append( $( 
                '<div class="row row-pad" id="book-'+author.id+'"></div>'
            ));

            $( '#book-'+author.id ).append( $( 
                '<h4>'+author.authName+'</h4>'
            ));

            $( '#book-'+author.id ).append( $( 
                '<p>'+
                    '<i>'+author.authDescription+'</i>'+
                '</p>'+                
                '<p>Books by '+author.authName+':</p>'+
                '<br>'
            ));

            //now get the books from the author array
            var count = 1;
            $.each(author.authBooks, function(index, book) {

                $( '#book-'+author.id ).append( $( 
                    '<div id="book-'+count+'-'+author.id+'" class="col-md-4"></div>'
                ));

                $( '#book-'+count+'-'+author.id ).append( $( 
                    '<h5>'+ book.bookName +'</h5>'
                ));

                $( '#book-'+count+'-'+author.id ).append( $( 
                    '<p class="book-desc">'+ book.bookDescription +'</p>'
                ));

                $( '#book-'+count+'-'+author.id ).append( $( 
                    '<button class="btn btn-success load-comments" author-name="'+author.authName+'" author-id="'+author.id+'"" book-name="'+ book.bookName +'">Comments</button>'
                ));

                count++;
            });

            $( '.content' ).append( $( 
                '<button class="btn btn-success add-book" author-name="'+author.authName+'" author-id="'+author.id+'"">Add new book</button>'
            ));


            $( '.content' ).append( $( 
                '<div class="row row-pad"><hr></div>'
            ));
            
        }
        

    });

    //only load the click events once the dashboard has been rendered

    initClickEvents(authors);
}