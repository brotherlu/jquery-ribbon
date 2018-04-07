(function(w,d,$){


  //  ____  _        _
  // / ___|| |_ __ _| |_ ___
  // \___ \| __/ _` | __/ _ \
  //  ___) | || (_| | ||  __/
  // |____/ \__\__,_|\__\___|
  
  // sane defaults
  var defaults = {
    ribbons: [
      {sX:.1, sY: 1, eX: 1, eY: .1},
      {sX:.3, sY: 1, eX: 1, eY: .3},
      {sX:.5, sY: 1, eX: 1, eY: .5},
    ],
    color: '#c2c2c2'
  };

  // hold the states
  var state,s = {
    ribbons: []
  };

  function sinFactory() {

    var sinOptions,so = {
      A: 1,
      F: 2 * Math.random(),
      seed: Math.random()
    };

    return function(t, P) {
      return so.A * Math.sin(so.F * t + P) 
            + so.seed * so.A * Math.sin(so.F * t + P);
    };
  }

  // define the plugin
  $.fn.ribbon = function(config) {

    //  ____       _
    // / ___|  ___| |_ _   _ _ __
    // \___ \ / _ \ __| | | | '_ \
    //  ___) |  __/ |_| |_| | |_) |
    // |____/ \___|\__|\__,_| .__/
    //                      |_|
    
    // Get the primary items
    var canvas,c = this;
    var ctx = this[0].getContext('2d');
    var options,o = $.extend(defaults, config);

    // get the size of the parent element
    s.width = this.parent().width();
    s.height = this.parent().height();

    // set the canvas to be the same size as the element
    this.attr({width: s.width, height: s.height});

    // on the canvas resize reset the size of the canvas
    $(w).on('resize',function() {

      s.width = c.parent().width();
      s.height = c.parent().height();

      c.attr({width: s.width, height: s.height});

      $.each(o.ribbons, function() {
        s.ribbons.push({
          sX: this.sX * s.width,
          sY: this.sY * s.height,
          eX: this.eX * s.width,
          eY: this.eY * s.height,
          cp1x: ((this.eX - this.sX) / 3 + this.sX) * s.width,
          cp1y: s.height / 3,
          cp2x: ((this.eX - this.sX) * 2 / 3 + this.sX) * s.width,
          cp2y: s.height * 2 / 3,
          color: this.color || o.color,
          direction: (Math.random() <= .5) ? -1 : 1,
          callback: sinFactory()
        });
      });

    });

    // Generate the state
    $.each(o.ribbons, function() {
      s.ribbons.push({
        sX: this.sX * s.width,
        sY: this.sY * s.height,
        eX: this.eX * s.width,
        eY: this.eY * s.height,
        cp1x: ((this.eX - this.sX) / 3 + this.sX) * s.width,
        cp1y: s.height / 3,
        cp2x: ((this.eX - this.sX) * 2 / 3 + this.sX) * s.width,
        cp2y: s.height * 2 / 3,
        color: this.color || o.color,
        direction: (Math.random() <= .5) ? -1 : 1,
        callback: sinFactory() 
      });
    });

    console.log(o, s);

    //  ____                _
    // |  _ \ ___ _ __   __| | ___ _ __
    // | |_) / _ \ '_ \ / _` |/ _ \ '__|
    // |  _ <  __/ | | | (_| |  __/ |
    // |_| \_\___|_| |_|\__,_|\___|_|
    
    // define the step render function
    function step(timestamp) {

      // clear canvas
      ctx.clearRect(0,0,s.width,s.height);

      // loop throught the ribbons
      $.each(s.ribbons, function(){

        ctx.beginPath();
        ctx.arc(this.cp1x, this.cp1y, 20, 0, 2*Math.PI);
        ctx.closePath();

        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.cp2x, this.cp2y, 20, 0, 2*Math.PI);
        ctx.closePath();

        ctx.fill();

        ctx.beginPath();

        ctx.moveTo(this.sX, this.sY);

        ctx.bezierCurveTo(this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.eX, this.eY);

        ctx.lineTo(this.eX, this.eY + 20);

        // Calculate the Motion
        this.cp1x += this.callback(timestamp / 1e3, -1 * this.direction * Math.PI / 2 );
        this.cp1y += this.callback(timestamp / 1e3, 0);

        this.cp2x += this.callback(timestamp / 1e3, this.direction * Math.PI / 2 );
        this.cp2y += this.callback(timestamp / 1e3, 0);

        ctx.bezierCurveTo(this.cp2x, this.cp2y, this.cp1x, this.cp1y, this.sX, this.sY + 20);

        ctx.closePath();

        ctx.fillStyle = this.color;
        ctx.fill();

      });      

      // lets loop
      w.requestAnimationFrame(step);
    }

    // kick it off
    w.requestAnimationFrame(step);

  }

}(window,document,jQuery));