AFRAME.registerComponent('ls-selector', {

    schema: {
        photo: {type: 'selector'},
        lightsaber: {type: 'number'},
      },

    init: function () {
        this.isHit = false;
        var entity = document.createElement('a-entity');

        entity.setAttribute('geometry', {
            primitive: 'box',
            height: 0.256,
            width: 0.190,
            depth: 0.025
        });
        entity.setAttribute('material', 'src', this.data.photo);
        entity.setAttribute('position', '0 0.5 0');
        entity.classList.add('ls-selector-collideable');
        entity.classList.add('ls-selector-menuitem');

        this.el.appendChild(entity);

        var self = this;
        entity.addEventListener('hitstart', function (event) {
            self.hitStart();
        });
        entity.addEventListener('enable', function (event) {
            self.showItem();
        });
        this.el.addEventListener('disable', function (event) {
            self.hideItem();
        });

        this.hideItem();

    },

    hitStart: function() {
        if (this.enabled) {
            this.enabled = false;
            this.el.setAttribute('visible', false);
            document.querySelector("#jediacademy").emit("choosels", {lightsaber:this.data.lightsaber})
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