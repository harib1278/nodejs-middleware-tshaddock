$(document).ready(function () {
    //load data via middleware api
    init();

});

function init(){
    //pull data from api into page
    $.getJSON('http://localhost:3001/authors', printAuthorDashboard);
}

function initClickEvents(authors){
    //Load the comments on click of the comments button
    $( "button.load-comments" ).click(function() {
        var authorID = $(this).attr('author-id');
        var bookName = $(this).attr('book-name');



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
                    '<button class="btn btn-success load-comments" author-id="'+author.id+'"" book-name="'+ book.bookName +'">Comments</button>'
                ));
                count++;
            });




            $( '.content' ).append( $( 
                '<div class="row row-pad"><hr></div>'
            ));
            
        }
        

    });

    //only load the click events once the dashboard has been rendered

    initClickEvents(authors);
}