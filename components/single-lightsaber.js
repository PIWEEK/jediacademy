AFRAME.registerComponent('single-lightsaber', {
    schema: {
        color: {type: 'string'},
        target: {type: 'selector'},
        blade: {type: 'selector'},
        left: {type: 'boolean'}
      },

    init: function() {
        var self = this;
        this.enabled = false;
        this.el.setAttribute('visible', false);
        this.el.setAttribute('position', '0 -100 0');
        this.bladeOn = false;

        // Blade
        var entity = this.data.blade;

        entity.setAttribute('position', '0 0 0');

        this.el.appendChild(entity);
        this.lightsaberBlade = entity;

        entity.addEventListener("gripdown", evt => {
          console.log("gripdown");
          self.bladeOn = true;
        });

        entity.addEventListener("gripup", evt => {
          console.log("gripup");
          self.bladeOn = false;
        });


        // Hilt
        var entity = document.createElement('a-entity');
        entity.setAttribute('obj-model', 'obj: #ls-hilt-obj; mtl: #ls-hilt-mtl');
        entity.setAttribute('scale', '0.16 0.16 0.16');
        entity.setAttribute('position', '-0.023 -0.1 0');
        entity.setAttribute('rotation', '0 0 -90');

        this.el.appendChild(entity);
        this.lightsaberHilt = entity;
        if (this.data.left) {
          entity.id = "single-lightsaber-hilt-left";
          this.rotateQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0.5, -1), Math.PI / 2);
        } else {
          entity.id = "single-lightsaber-hilt-right";
          this.rotateQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, -0.5, 1), Math.PI / 2);
        }



        setTimeout(function(){ self.lightsaberBlade.setAttribute('material', 'color', self.data.color); }, 1000);

        this.el.addEventListener('enable', function (event) {
            self.enabled = true;
            self.el.setAttribute('visible', true);
        });





    },

    tick: function (time, timeDelta) {
      if (this.enabled) {
        this.checkBlade(time, timeDelta);
        this.follow();
      }
    },


    follow: function (time, timeDelta) {
      this.el.object3D.position.copy(this.data.target.object3D.position);
      this.el.object3D.quaternion.copy(this.data.target.object3D.quaternion);
      this.el.object3D.quaternion.multiply(this.rotateQuat);
    },

    checkBlade: function(time, timeDelta) {
      this.bladeGeometry = this.lightsaberBlade.getAttribute("geometry");
      if (this.bladeOn) {
        if (this.bladeGeometry.height < 1.2){
          this.bladeGeometry.height += 0.003 * timeDelta;
          if (this.bladeGeometry.height > 1.2){
            this.bladeGeometry.height = 1.2;
          }

          this.lightsaberBlade.setAttribute("geometry", this.bladeGeometry)
          this.lightsaberBlade.setAttribute('position', '0 '+(this.bladeGeometry.height/2)+' 0');
        }
      } else {
        if (this.bladeGeometry.height >0) {
          this.bladeGeometry.height -= 0.003 * timeDelta;
          if (this.bladeGeometry.height < 0){
            this.bladeGeometry.height = 0;
          }

          this.lightsaberBlade.setAttribute("geometry", this.bladeGeometry)
          this.lightsaberBlade.setAttribute('position', '0 '+(this.bladeGeometry.height/2)+' 0');

        }
      }


    }


});
