AFRAME.registerComponent('single-lightsaber', {
    schema: {
        color: {type: 'string'},
        target: {type: 'selector'},
        blade: {type: 'selector'},
        left: {type: 'boolean'}
      },

    init: function() {
        this.enabled = false;
        this.el.setAttribute('visible', false);
        this.el.setAttribute('position', '0 -100 0');

        // Blade
        var entity = this.data.blade;

        entity.setAttribute('position', '0 0.6 0');

        this.el.appendChild(entity);
        this.lightsaberBlade = entity;


        // Hilt
        var entity = document.createElement('a-entity');
        entity.id = "single-lightsaber-hilt";
        entity.setAttribute('obj-model', 'obj: #ls-hilt-obj; mtl: #ls-hilt-mtl');
        entity.setAttribute('scale', '0.16 0.16 0.16');
        entity.setAttribute('position', '-0.023 -0.1 0');
        entity.setAttribute('rotation', '0 0 -90');

        this.el.appendChild(entity);
        this.lightsaberHilt = entity;
        if (this.data.left) {
          this.rotateQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, -1), Math.PI / 2);
        } else {
          this.rotateQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
        }






        var self = this;
        setTimeout(function(){ self.lightsaberBlade.setAttribute('material', 'color', self.data.color); }, 1000);

        this.el.addEventListener('enable', function (event) {
            self.enabled = true;
            self.el.setAttribute('visible', true);
        });


    },

    tick: function (time, timeDelta) {
      if (this.enabled) {
        this.follow();
      }
    },


    follow: function (time, timeDelta) {
        this.el.object3D.position.copy(this.data.target.object3D.position);
        this.el.object3D.quaternion.copy(this.data.target.object3D.quaternion);
        this.el.object3D.quaternion.multiply(this.rotateQuat);
      },


});
