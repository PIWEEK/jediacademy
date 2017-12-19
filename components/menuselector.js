AFRAME.registerComponent('menu-selector', {

    schema: {
        photo: {type: 'selector'},
        minigame: {type: 'selector'},
      },

    init: function () {
        this.isHit = false;


        


        var entity = document.createElement('a-entity');

        entity.setAttribute('geometry', {
            primitive: 'plane',
            height: 1,
            width: 1
        });        
        entity.setAttribute('material', 'src', this.data.photo);
        entity.setAttribute('position', '0 0.5 0');
        entity.classList.add('collideable');
      
        this.el.appendChild(entity);     
        
        var self = this;
        this.el.addEventListener('hitstart', function (event) {          
            self.hitStart();          
          });
    },

    hitStart: function() {
        this.el.setAttribute('position', '0 -100 0');
        this.data.minigame.emit('enable');
    }
  });