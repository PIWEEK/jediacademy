AFRAME.registerComponent('jediacademy', {
    init: function () {
      var sceneEl = this.el;
      this.rightBlade = null;
      this.leftBlade = null;

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

      this.el.addEventListener('choosels', function (event) {
        self.chooseLs(event.detail.lightsaber);
      });

    },
    run: function() {
        console.log("Jediacademy is loaded!!");
        var self = this;
        setTimeout(function(){
          document.querySelector("#hud").emit("hide");
          self.showLsSelection();
          //self.startMinigame(document.querySelector("#destroyMiniRobotsGame"));
          //self.startMinigame(document.querySelector("#floatingLsGame"));
          //self.startMinigame(document.querySelector("#trainingRobotGame"));
          //self.chooseLs(0);
        }, 10000);

    },

    showLsSelection: function() {
      var lsItems = document.querySelectorAll(".ls-selector-menuitem");
      for (var i = 0; i < lsItems.length; i++) {
        lsItems[i].emit("enable");
      }
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

    chooseLs: function(lightsaber) {
      var lsItems = document.querySelectorAll(".ls-selector-menuitem");
      for (var i = 0; i < lsItems.length; i++) {
        lsItems[i].emit("disable");
      }

      // Single LS
      if (lightsaber == 0) {
        document.querySelector("#player-single-ls-1").emit("enable");
      } else if (lightsaber == 1) {
        document.querySelector("#player-single-ls-1").emit("enable");
        document.querySelector("#player-single-ls-2").emit("enable");
      } else if (lightsaber == 2) {
        document.querySelector("#player-dual-ls").emit("enable");
      } else if (lightsaber == 3) {
        document.querySelector("#player-assault-rifle").emit("enable");
      }

      this.showMenu();


    }

  });