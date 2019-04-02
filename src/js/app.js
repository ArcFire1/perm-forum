;

(function ($) {

  "use strict";

  $(function () {
    // header menu start
    const menuItems = $('.menu__item');
    const submenu = $('.submenu');

    function calculateOffset(elem, index){
      let offsetLeft = $(elem).offset().left;
      const offsetRight = offsetLeft + $(submenu[index]).width();
      const viewportWidth = $(window).width();
      
      if(offsetRight > viewportWidth) {
        console.log(11)
        const delta = offsetRight - viewportWidth
        offsetLeft = offsetLeft - delta;
      } 
      
      return offsetLeft;
    }

    function render(){
      menuItems.each(function(index, elem){
        console.log(elem);
        $(submenu[index]).css('left',  calculateOffset(elem, index));  
    });  
    }


    $(window).resize(function(){
      render();
    })

    render();
    // header menu end

    //slider start
    if ($('.hero-slider').length) {
      const slider = $('.hero-slider');
      const sliderItem = slider.find('.hero-slider-item');
      let slideCount = sliderItem.length;
      let hwSlideSpeed = 700;
      let hwTimeOut = 5000;

      sliderItem.css({"position": "absolute", "top":'0', "left": '0'}).hide().eq(0).show();
      let slideNum = 0;
      let slideTime;

		  const animSlide = function(arrow) {

        clearTimeout(slideTime);
        
        sliderItem.eq(slideNum).fadeOut(hwSlideSpeed);

        if (arrow == "next") {
          if (slideNum == (slideCount-1)) {
            slideNum=0;
          } else {
            slideNum++
          }
        } else if(arrow == "prew") {
          if (slideNum == 0) {
            slideNum=slideCount-1;
          } else{
            slideNum-=1
          }
        } else{
          slideNum = arrow;
        }

        sliderItem.eq(slideNum).fadeIn(hwSlideSpeed, rotator);
        $(".hero-slider-controls__button.active").removeClass("active");
        $('.hero-slider-controls__button').eq(slideNum).addClass('active');
			}

      let $adderSpan = '';
      
      sliderItem.each(function(index) {
        $adderSpan += '<li><button class="hero-slider-controls__button">' + index + '</button></li>';
      });
      
      $('<ul class="hero-slider-controls">' + $adderSpan +'</div>').appendTo('.hero-slider-wrapper');
      $(".hero-slider-controls__button:first").addClass("active");
      
      $('.hero-slider-controls__button').click(function(){
        let goToNum = parseFloat($(this).text());
        animSlide(goToNum);
      });
      
      let pause = false;
      
      const rotator = function() {
        if (!pause) {
          slideTime = setTimeout(function() {
            animSlide('next')
          }, hwTimeOut);
        }
      }
      
      $('.hero-slider-wrap').hover(
        function() {
          clearTimeout(slideTime); 
          pause = true;
        },
        function() {
          pause = false; 
          rotator();
      });
      
      //rotator();
    }
    // slider end
  });
})(jQuery);
