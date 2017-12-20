AFRAME.registerComponent('dual-lightsaber', {
    schema: {
        color: {type: 'string'},
        target: {type: 'selector'}
      },

    init: function() {
        this.enabled = false;
        this.el.setAttribute('visible', false);
        this.el.setAttribute('position', '0 -100 0');

        // Blades
        var entity = document.querySelector('#dual-lightsaber-blade');

        entity.setAttribute('position', '0 0 0');

        this.el.appendChild(entity);
        this.lightsaberBlade = entity;

        // Hilt
        var entity = document.createElement('a-entity');
        entity.id = "dual-lightsaber-hilt";
        entity.setAttribute('obj-model', 'obj: #ls-hilt-dual-obj; mtl: #ls-hilt-dual-mtl');
        entity.setAttribute('scale', '0.16 0.16 0.16');
        entity.setAttribute('position', '-0.023 0 0');
        entity.setAttribute('rotation', '0 0 -90');

        this.el.appendChild(entity);
        this.lightsaberHilt = entity;
        this.rotateQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);


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
