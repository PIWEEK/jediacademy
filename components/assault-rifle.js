AFRAME.registerComponent('assault-rifle', {
  schema: {
      color: {type: 'string'},
      target: {type: 'selector'}
    },

  init: function() {
    var self = this;
      this.enabled = false;
      this.bladeOn = false;
      this.bladeTimeOut = 0;
      this.el.setAttribute('visible', false);
      this.el.setAttribute('position', '0 -100 0');

      this.el.addEventListener("gripdown", evt => {


      });

      this.el.addEventListener("gripup", evt => {

      });

      this.el.addEventListener("pistolstart", evt => {
        if (self.bladeTimeOut == 0) {
          self.bladeTimeOut = 100;
        }
      });

      this.el.addEventListener("pistolend", evt => {
      });

      //Laser
      var entity = document.querySelector('#assault-rifle-laser');
      entity.setAttribute('position', '0 0 0');
      entity.setAttribute('rotation', '90 0 0');
      this.el.appendChild(entity);
      this.lightsaberBlade = entity;



      // Hilt
      entity = document.querySelector('#assault-rifle');
      entity.setAttribute('scale', '0.16 0.16 0.16');
      entity.setAttribute('position', '-0.023 0 0');
      entity.setAttribute('rotation', '0 0 -90');


      this.el.appendChild(entity);
      this.lightsaberHilt = entity;
      this.rotateQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);



      setTimeout(function(){
        self.lightsaberBlade.setAttribute('material', 'color', 'green');
      }, 1000);

      this.el.addEventListener('enable', function (event) {
        self.enabled = true;
        self.el.setAttribute('visible', true);
        self.lightsaberHilt.setAttribute('visible', true);
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

    if (thid.bladeTimeOut > 0) {
      this.bladeGeometry.height = 100;
      this.bladeTimeOut -= timeDelta;
    } else {
      this.bladeTimeOut = 0;
      this.bladeGeometry.height = 0;
    }
    this.lightsaberBlade.setAttribute("geometry", this.bladeGeometry)
    this.lightsaberBlade.setAttribute('position', '0.1 0 '+(-this.bladeGeometry.height/2));

  }


});
