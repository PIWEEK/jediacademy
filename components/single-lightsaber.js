AFRAME.registerComponent('single-lightsaber', {
    schema: {
        color: {type: 'string'},
        target: {type: 'selector'}
      },

    init: function() {
        // Blade
        entity = document.createElement('a-entity');
        entity.id = "floating-lightsaber-blade";
        entity.setAttribute('geometry', {
            primitive: 'cylinder',
            radius: 0.01,
            height: 1.2
        });
        entity.setAttribute('material', 'color', this.data.color);
        entity.setAttribute('position', '0 0.6 0');
        entity.classList.add('collideable');

        this.el.appendChild(entity);
        this.lightsaberBlade = entity;


        // Hilt
        var entity = document.createElement('a-entity');
        entity.id = "floating-lightsaber-hilt";
        entity.setAttribute('obj-model', 'obj: #ls-hilt-obj; mtl: #ls-hilt-mtl');
        entity.setAttribute('scale', '0.16 0.16 0.16');
        entity.setAttribute('position', '-0.023 -0.1 0');
        entity.setAttribute('rotation', '0 0 -90');

        this.el.appendChild(entity);
        this.lightsaberHilt = entity;
        this.rotateQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
    },

    tick: function (time, timeDelta) {
      this.follow()
    },


    follow: function (time, timeDelta) {
        this.el.object3D.position.copy(this.data.target.object3D.position);
        this.el.object3D.quaternion.copy(this.data.target.object3D.quaternion);
        this.el.object3D.quaternion.multiply(this.rotateQuat);
      },


});
