/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
  $(window).load(function() {
        //console.log('window load sidebarWidth: '+$('ul#meinMenu').css('width'));
        //console.log('anchor-link visibility: '+$('.anchor-link').css('visibility'));
        setMenuHeight();
    }); 
    $(window).on('resize orientationChanged', function() {
        setMenuHeight();
     });    
    $(document).ready(function(){
        //console.log('document ready sidebarWidth: '+$('ul#meinMenu').css('width'));
        $('#menu-toggle').click(function () {
            //$('#meinMenu li a').css('line-height','auto');
            $('#meinMenu').toggleClass('open');
        });
        
    }); // documen.ready
    
    
    function setMenuHeight() {
        if ($('.anchor-link').css('visibility')=='hidden')
        {
            var sidebarWidth = $('ul#meinMenu').css('width');
            $('#meinMenu li:not(.name) a').css('line-height',sidebarWidth);           
        }
        else{
            $('#meinMenu li a').css('line-height','normal');
        }

    }


