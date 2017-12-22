AFRAME.registerComponent('dual-lightsaber', {
    schema: {
        color: {type: 'string'},
        target: {type: 'selector'}
      },

    init: function() {
        this.enabled = false;
        this.bladeOn = false;
        this.el.setAttribute('visible', false);
        this.el.setAttribute('position', '0 -100 0');

        // Blades
        var entity = document.querySelector('#dual-lightsaber-blade');

        entity.setAttribute('position', '0 0 0');

        entity.addEventListener("gripdown", evt => {
          console.log("gripdown");
          self.bladeOn = true;
        });

        entity.addEventListener("gripup", evt => {
          console.log("gripup");
          self.bladeOn = false;
        });

        this.el.appendChild(entity);
        this.lightsaberBlade = entity;

        //Blade parts
        this.bladeParts = document.querySelectorAll(".duallightsaberbladepart");
        for (var i=0;i<this.bladeParts.length;i++) {
          this.el.appendChild(this.bladeParts[i]);
          this.bladeParts[i].setAttribute('visible', false);
          this.bladeParts[i].setAttribute('position', '0 '+(i*0.2 - 1)+' 0');
        }


        // Hilt
        var entity = document.createElement('a-entity');
        entity.id = "dual-lightsaber-hilt";
        entity.setAttribute('obj-model', 'obj: #ls-hilt-dual-obj; mtl: #ls-hilt-dual-mtl');
        entity.setAttribute('scale', '0.16 0.16 0.16');
        entity.setAttribute('position', '-0.023 0 0');
        entity.setAttribute('rotation', '0 0 -90');

        this.el.appendChild(entity);
        this.lightsaberHilt = entity;
        this.rotateQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, -0.5, 1), Math.PI / 2);


        var self = this;
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
        for (var i=0;i<this.bladeParts.length;i++) {
          this.bladeParts[i].setAttribute('visible', true);
        }
        if (this.bladeGeometry.height < 2.2){
          this.bladeGeometry.height += 0.006 * timeDelta;
          if (this.bladeGeometry.height > 2.2){
            this.bladeGeometry.height = 2.2;
          }

          this.lightsaberBlade.setAttribute("geometry", this.bladeGeometry)
        }
      } else {
        for (var i=0;i<this.bladeParts.length;i++) {
          this.bladeParts[i].setAttribute('visible', false);
        }
        if (this.bladeGeometry.height >0) {
          this.bladeGeometry.height -= 0.006 * timeDelta;
          if (this.bladeGeometry.height < 0){
            this.bladeGeometry.height = 0;
          }

          this.lightsaberBlade.setAttribute("geometry", this.bladeGeometry)

        }
      }


    }


});
