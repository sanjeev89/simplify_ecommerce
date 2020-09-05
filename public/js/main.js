$(function(){
    
    CKEDITOR.replace('ta');          //to enable CKEDITOR on textarea id

    $('a.confirmDeletion').on('click', function(e){
        if(confirm('confirm Deletion')==false) return false;
    })

    $('a.clearcart').on('click', function(e){
        if(confirm("clear cart ?")==false) {
            return false;
        }
    })

    if($("[data-fancybox]").length){
        ("[data-fancybox]").fancybox()
    }
})