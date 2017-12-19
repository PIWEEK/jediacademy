AFRAME.registerComponent('jediacademy', {
    init: function () {
      var sceneEl = this.el;
      if (sceneEl.hasLoaded) {
        this.run();
      } else {
        sceneEl.addEventListener('loaded', this.run);
      }

      var self = this;
      this.el.addEventListener('showmenu', function (event) {          
        self.showMenu()
      });

      this.el.addEventListener('startminigame', function (event) {          
        self.startMinigame(event.detail.minigame);
      });

      this.el.addEventListener('endminigame', function (event) {          
        self.endMinigame(event.detail.text, event.detail.color);
      });



    },
    run: function() {
        console.log("Jediacademy is loaded!!");        
    },

    showMenu: function() {
      var menuItems = document.querySelectorAll(".menuitem");
      for (var i = 0; i < menuItems.length; i++) {
        menuItems[i].emit("enable");
      }
    },

    startMinigame: function(minigame) {
      var menuItems = document.querySelectorAll(".menuitem");
      for (var i = 0; i < menuItems.length; i++) {
        menuItems[i].emit("disable");
      }

      minigame.emit("enable");
    },

    endMinigame: function(text, color) {
      document.querySelector("#hud").emit("showtext", {text: text, color: color});
    },

  });