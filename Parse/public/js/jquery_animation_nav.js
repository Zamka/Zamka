$(document).on("ready", function(){
    
    var flag = false;
    var scroll;
    
    $(window).scroll(function(){
        scroll = $(window).scrollTop();
        
        
        if(scroll > 150){
            if(!flag){
                $("#logo_nav").css({"marginTop":"-18px","width":"50px","height":"50px"});
                flag = true;
                }
            
            }else{
                if(flag){
                $("#logo_nav").css({"marginTop":"150px","width":"150px","height":"150px"});
                flag = false;
                }
            }
    });
});

    