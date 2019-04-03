;

(function ($) {

  "use strict";

  $(function () {
    // header menu start
    const menuItems = $('.menu__item');
    const menuLink = $('.menu__link');
    const submenu = $('.submenu');
    const breakpoint = $(window).width() < 1019;

    if (breakpoint) {
      menuLink.each(function() {
        if ($(this).siblings(submenu).length) {
          $(this).addClass('has-submenu');
        }
      });

      $('.has-submenu').click(function(e) {
        e.preventDefault();
        $(this).siblings('.wrapper').slideToggle();
      });
    } else {
      function calculateOffset(elem, index){
        let offsetLeft = $(elem).offset().left;
        const offsetRight = offsetLeft + $(submenu[index]).width();
        const viewportWidth = $(window).width();
        
        if (offsetRight > viewportWidth) {
          const delta = offsetRight - viewportWidth
          offsetLeft = offsetLeft - delta;
        } 
        
        return offsetLeft;
      }
  
      function render() {
        menuItems.each(function(index, elem) {
          $(submenu[index]).css('left',  calculateOffset(elem, index));  
        });  
      }
  
  
      $(window).resize(function(){
        render();
      })
  
      render();
    }

    // menu toggler 

    $('.menu-toggler').click(function() {
      $(this).toggleClass('menu-toggler_active');
      $('.menu-wrapper').toggleClass('menu-wrapper_active');
    });
    // header menu end

    //slider start
    if ($('.hero-slider').length) {
      const slider = $('.hero-slider');
      const sliderItem = slider.find('.hero-slider-item');
      let slideCount = sliderItem.length;
      let hwSlideSpeed = 700;
      let hwTimeOut = 5000;

      let clacSliderWidth = function() {
        for (let i = 0; i < sliderItem.length; i++) {
          sliderItem.eq(i).css('width', $(window).width());
        }
      }

      clacSliderWidth();

      let calcWrapperWidth = function (){
        var fullWidth=0;
        sliderItem.each(function(){
          fullWidth += $(this).outerWidth(); 
        });

        slider.css('width', fullWidth);
      }

      calcWrapperWidth();

      let calcleft = function () {
        let calcWidth = 0;
        for (let i = 1; i < sliderItem.length; i++) {
          
          calcWidth += sliderItem.eq(i).outerWidth(); 
          sliderItem.eq(i).css('left', -calcWidth);
          console.log(calcWidth);
        }
      }

      calcleft();

      function equalizeSliderHeight() {
        sliderItem.css("height", "auto");
          let t = Math.max.apply(null, sliderItem.map(function() {
              return $(this).height()
          }).get());
          sliderItem.height(t)
      }
  
      equalizeSliderHeight();

      $(window).on('resize', function() {
        clacSliderWidth();
        calcleft();
        calcWrapperWidth();
        equalizeSliderHeight()
      });

      sliderItem.css({'opacity': '0', 'z-index': '100'}).eq(0).css({"left": '0', 'z-index': '200', 'opacity': '1'});

      let slideNum = 0;
      let slideTime;

		  const animSlide = function(arrow) {

        clearTimeout(slideTime);

        let slideWidth = sliderItem.eq(slideNum).outerWidth();
        
        sliderItem.eq(slideNum).animate({
          'z-index': '100',
          'opacity': '0'
        });

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

        sliderItem.eq(slideNum).animate({
          'z-index': '200',
          'opacity': '1'
        });
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
      
      rotator();
    }
    // slider end

    //slick carousel
    $(".key-members").slick({
      infinite: true,
      arrows: false,
      dots: true,
      speed: 500,
      fade: true,
      cssEase: 'linear'
    });

    // autoheight partners logo
    function partnerHeight() {
      $('.partner__logo').css("height", "auto");
        var t = Math.max.apply(null, $('.partner__logo').map(function() {
            return $(this).height()
        }).get());
      $('.partner__logo').height(t)
    }

    partnerHeight();

    $(window).on('resize', function() {
      partnerHeight();
    });

    const partnersWrapper = $('.partners-wrapper');

    function calcPartnerHeight() {
      let partnerItem = $('.partner').outerHeight();
      partnersWrapper.css('height', partnerItem);
    }

    calcPartnerHeight();

    $('.partners-expand-button').click(function() {
      let partnerItem = $('.partner').outerHeight();

      if (partnersWrapper.outerHeight() === partnerItem) {
        partnersWrapper.css('height', '100%');
        $(this).addClass('expanded');
      } else {
        partnersWrapper.css('height', partnerItem);
        $(this).removeClass('expanded');
      }
    });

    
  });
})(jQuery);
