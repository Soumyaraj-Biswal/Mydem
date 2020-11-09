/**************************************
    File Name: custom.js
    Template Name: Forest Time
    Created By: HTML.Design
    http://themeforest.net/user/wpdestek
**************************************/

(function($) {
    "use strict";
    $(document).ready(function() {
        $('#nav-expander').on('click', function(e) {
            e.preventDefault();
            $('body').toggleClass('nav-expanded');
        });
        $('#nav-close').on('click', function(e) {
            e.preventDefault();
            $('body').removeClass('nav-expanded');
        });
    });

    $(function() {
        $('[data-toggle="tooltip"]').tooltip()
    })

    $('.carousel').carousel({
        interval: 4000
    })

    $(window).load(function() {
        $("#preloader").on(500).fadeOut();
        $(".preloader").on(600).fadeOut("slow");
    });

    jQuery(window).scroll(function(){
        if (jQuery(this).scrollTop() > 1) {
            jQuery('.dmtop').css({bottom:"25px"});
        } else {
            jQuery('.dmtop').css({bottom:"-100px"});
        }
    });
    jQuery('.dmtop').click(function(){
        jQuery('html, body').animate({scrollTop: '0px'}, 800);
        return false;
    });

})(jQuery);


function openCategory(evt, catName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(catName).style.display = "block";
    evt.currentTarget.className += " active";
} 


// sidenav

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

//search bar

var show = document.getElementsByClassName("result");

        
document.querySelector(".frm").addEventListener("submit",function(e){
  e.preventDefault()
  
  go(e.target[0].value);
  return false;
});

document.getElementById("inp").addEventListener("input",function(e){

  go(e.target.value);
  
});


function go(search){

   fetch("/search",{
     method: 'POST',
     mode:"cors",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
       search:search,
       status: "find"
     })
  }).then(function(res){
    return res.json();
  }).then(function(data){
    
    if(data.length){
      show[0].style.display="block";
      show[0].textContent = "";
      data.forEach(e => {
        show[0].innerHTML+='<a class="link" href="/campgrounds/'+e._id+'">'+e.name+'</a>';
                
    });
    //'<div class="media"><div class="media-left"><a href="/campgrounds/"'+e._id+'><img class="media-object" src='+e.image+' alt="..." style="vertical-align: middle; width: 50px; height: 50px;"></a></div><div class="media-body text-left"><a href="/campgrounds/"'+e._id+' style="text-decoration: none; color: black;"><h4 class="media-heading">' +e.name+'></h4><p>'+e.description.substring(0,20)+'</p><footer><em>Submitted by: <a href="/user/"'+e.author.id+'>'+c.author.username+'</a></footer></a></div></div></div>'
      
    }
    else{
      show[0].style.display="none";
      show[0].textContent = "";
    }
    
  })

}