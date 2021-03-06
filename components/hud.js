AFRAME.registerComponent('hud', {
    init: function () {
      this.textTimeout = 0;
      var self = this;
      this.el.addEventListener('showtext', function (event) {
        self.showText(event.detail.text, event.detail.color);
      });

      this.el.addEventListener('hide', function (event) {
        self.el.setAttribute('visible', false);
      });





    },

    tick: function (time, timeDelta) {
      if (this.textTimeout > 0) {
        this.textTimeout -= timeDelta;
        if (this.textTimeout <= 0) {
          this.el.setAttribute('visible', false);
          document.querySelector("#jediacademy").emit("showmenu");
        }

      }

    },


    showText: function(text, color) {
      this.el.setAttribute('text', 'value:' +text+'; color:'+color+';font:font/starJedi.fnt');
      this.el.setAttribute('visible', true);
      this.textTimeout = 5000;
    }
  });