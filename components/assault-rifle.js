AFRAME.registerComponent('assault-rifle', {
  schema: {
      color: {type: 'string'},
      target: {type: 'selector'}
    },

  init: function() {
    var self = this;
      this.enabled = false;
      this.laserOn = false;
      this.laserTimeOut = 0;
      this.el.setAttribute('visible', false);
      this.el.setAttribute('position', '0 -100 0');

      this.tmpPos = new THREE.Vector3();

      this.el.addEventListener("gripdown", evt => {


      });

      this.el.addEventListener("gripup", evt => {

      });

      this.el.addEventListener("pistolstart", evt => {        
          console.log("pistolstart event");
          self.shoot();                  
      });

      this.el.addEventListener("pistolend", evt => {
      });

      //Laser
      var entity = document.querySelector('#assault-rifle-laser');
      entity.setAttribute('position', '0 0 0');
      entity.setAttribute('rotation', '90 0 0');
      this.rifleLaser = entity;

      //Laser Container
      var entity = document.createElement('a-entity');      
      /*entity.setAttribute('geometry', {
          primitive: 'box',
          width: 0.2, 
          height: 0.2,
          depth: 0.2
      });*/

      
      entity.appendChild(this.rifleLaser);   
      this.laserContainer = entity;
      document.querySelector('#jediacademy').appendChild(entity);



      // Hilt
      entity = document.querySelector('#assault-rifle');
      entity.setAttribute('scale', '0.16 0.16 0.16');
      entity.setAttribute('position', '-0.023 0 0');
      entity.setAttribute('rotation', '0 0 -90');


      this.el.appendChild(entity);
      this.lightsaberHilt = entity;
      this.rotateQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);



      setTimeout(function(){
        self.rifleLaser.setAttribute('material', 'color', 'green');
      }, 1000);

      this.el.addEventListener('enable', function (event) {
        self.enabled = true;
        self.el.setAttribute('visible', true);
        self.lightsaberHilt.setAttribute('visible', true);
        self.laserTimeOut = 0;
      });
  },

  tick: function (time, timeDelta) {
    if (this.enabled) {
      this.checkLaser(time, timeDelta);
      this.follow();
    }
  },


  follow: function (time, timeDelta) {
      this.tmpPos.copy(this.data.target.object3D.position)
      this.tmpPos.z -= 2;
      this.el.object3D.position.copy(this.tmpPos);
      this.el.object3D.quaternion.copy(this.data.target.object3D.quaternion);
      this.el.object3D.quaternion.multiply(this.rotateQuat);
  },

  checkLaser: function(time, timeDelta) {
    this.laserPosition = this.rifleLaser.getAttribute("position");
    if (this.laserTimeOut > 0) {
      this.laserPosition.z -= 0.005 * timeDelta;
      this.laserTimeOut -= timeDelta;
      this.rifleLaser.setAttribute('position', this.laserPosition);
    } else {
      this.laserTimeOut = 0;
      this.rifleLaser.setAttribute('visible', false);
      this.rifleLaser.setAttribute('position', "0 0 0");
    }
    

  },

  shoot: function(){
    if (this.laserTimeOut == 0) {
      console.log ("shoot");

      this.tmpPos.copy(this.el.object3D.position)
      this.laserContainer.object3D.position.copy(this.tmpPos);
      this.laserContainer.object3D.quaternion.copy(this.el.object3D.quaternion);
      //this.laserContainer.object3D.quaternion.multiply(this.rotateQuat);

      this.rifleLaser.setAttribute('position', "0 0 0");
      this.rifleLaser.setAttribute('visible', true);
      
      this.laserTimeOut = 10000;
    }
  }


});
