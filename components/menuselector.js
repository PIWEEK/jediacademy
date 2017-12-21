AFRAME.registerComponent('menu-selector', {

    schema: {
        photo: {type: 'selector'},
        minigame: {type: 'selector'},
      },

    init: function () {
        this.isHit = false;
        var entity = document.createElement('a-entity');

        entity.setAttribute('geometry', {
            primitive: 'box',
            height: 0.512,
            width: 0.512,
            depth: 0.05
        });
        entity.setAttribute('material', 'src', this.data.photo);
        entity.setAttribute('position', '0 0.5 0');
        entity.classList.add('collideable');
        entity.classList.add('menuitem');

        this.el.appendChild(entity);

        var self = this;
        this.el.addEventListener('hitstart', function (event) {            
            self.hitStart();
        });
        this.el.addEventListener('enable', function (event) {
            self.showItem();
        });
        this.el.addEventListener('disable', function (event) {
            self.hideItem();
        });

        this.hideItem();
    },

    hitStart: function() {
        if (this.enabled) {
            console.log("MENU HIT");
            this.enabled = false;
            this.el.setAttribute('visible', false);
            document.querySelector("#jediacademy").emit("startminigame", {minigame:this.data.minigame})
        }
    },

    showItem: function() {
        this.enabled = true;
        this.el.setAttribute('visible', true);

    },

    hideItem: function() {
        this.enabled = false;
        this.el.setAttribute('visible', false);

    }
  });