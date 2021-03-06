AFRAME.registerComponent('floating-lightsaber', {
    schema: {
        color: {type: 'string'},
        speed: {type: 'number'},
        target: {type: 'selector'}
      },

    init: function() {
        this.MODE_PREPARE_RIGHT = 0;
        this.MODE_SWING_RIGHT_LEFT = 1;
        this.MODE_GUARD_LEFT_CENTER = 2;
        this.MODE_PREPARE_LEFT = 3;
        this.MODE_SWING_LEFT_RIGHT = 4;
        this.MODE_GUARD_RIGHT_CENTER = 5;
        this.MODE_RETURN_RIGHT = 6;
        this.MODE_RETURN_LEFT = 7;

        this.isHit = false;
        this.enabled = false;

        this.numSwings = 0;
        this.numHits = 0;

        this.mode = this.MODE_PREPARE_RIGHT;


        this.directionVec3 = new THREE.Vector3();

        //Hit light
        var entity = document.createElement('a-entity');
        this.hitLight = entity;
        this.hitLight.setAttribute('light', 'type: ambient; color: red; intensity: 0');
        this.el.appendChild(entity);



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


        var self = this;
        this.lightsaberBlade.addEventListener('hitstart', function (event) {
          self.hitStart(event.target);
        });

        this.lightsaberBlade.addEventListener('hitend', function (event) {
          self.hitEnds(event.target);
        });

        this.el.addEventListener('enable', function (event) {
          self.enabled = true;
          self.numSwings = 0;
          self.numHits = 0;
          self.el.setAttribute('position', '0 1.5 -20');
          self.el.setAttribute('visible', true);
        });

        this.el.addEventListener('disable', function (event) {
          self.enabled = false;
          self.el.setAttribute('position', '0 -100 -20');
        });



    },

    tick: function (time, timeDelta) {
      if (this.enabled) {
        this.follow(time, timeDelta);
        this.fight(time, timeDelta);
      }

    },


    follow: function (time, timeDelta) {
        var directionVec3 = this.directionVec3;
        // Grab position vectors (THREE.Vector3) from the entities' three.js objects.
        var targetPosition = this.data.target.object3D.position;
        var currentPosition = this.el.object3D.position;

        // Subtract the vectors to get the direction the entity should head in.
        directionVec3.copy(targetPosition).sub(currentPosition);
        // Calculate the distance.
        var distance = directionVec3.length();

        // Scale the direction vector's magnitude down to match the speed.
        var factor = 10 / distance;
        ['x', 'y', 'z'].forEach(function (axis) {
          directionVec3[axis] *= factor * (timeDelta / 1000);
        });

        // Don't go any closer if a close proximity has been reached.
        if (distance < 1.1) {
          // Translate the entity in the direction against the target.
          this.el.setAttribute('position', {
            x: currentPosition.x - directionVec3.x,
            // Do not change height
            y: currentPosition.y,// + directionVec3.y,
            z: currentPosition.z - directionVec3.z
          });
        } else if (distance > 1.2) {

          // Translate the entity in the direction towards the target.
          this.el.setAttribute('position', {
            x: currentPosition.x + directionVec3.x,
            // Do not change height
            y: currentPosition.y,// + directionVec3.y,
            z: currentPosition.z + directionVec3.z
          });
        }
      },


      fight: function (time, timeDelta) {
        var el = this.el;
        var rotationTmp = this.rotationTmp = this.rotationTmp || {x: 0, y: 0, z: 0};
        var rotation = el.getAttribute('rotation');

        var inc = this.data.speed * timeDelta;


        if (this.mode == this.MODE_PREPARE_RIGHT) {
          if (rotation.z >= 90){
              this.mode = this.MODE_SWING_RIGHT_LEFT;
          } else {
            rotationTmp.z = rotation.z + inc;
            el.setAttribute('rotation', rotationTmp);
          }
        } else if (this.mode == this.MODE_PREPARE_LEFT) {
          if (rotation.z <= -90){
              this.mode = this.MODE_SWING_LEFT_RIGHT;
          } else {
            rotationTmp.z = rotation.z - inc;
            el.setAttribute('rotation', rotationTmp);
          }
        } else if (this.mode == this.MODE_SWING_RIGHT_LEFT) {
          if (rotation.y>=180){
              this.mode = this.MODE_GUARD_LEFT_CENTER;
              this.addSwing();
          } else {
            rotationTmp.y = rotation.y + inc;
            el.setAttribute('rotation', rotationTmp);
          }
        } else if (this.mode == this.MODE_SWING_LEFT_RIGHT) {
          if (rotation.y<=-180){
              this.mode = this.MODE_GUARD_RIGHT_CENTER;
              this.addSwing();
          } else {
            rotationTmp.y = rotation.y - inc;
            el.setAttribute('rotation', rotationTmp);
          }
        } else if (this.mode == this.MODE_GUARD_LEFT_CENTER) {
          if (rotation.z <= 0){
              if (Math.random() >= 0.5){
                this.mode = this.MODE_PREPARE_RIGHT;
              } else {
                this.mode = this.MODE_PREPARE_LEFT;
              }
              rotationTmp.z = 0;
              rotationTmp.y = 0;
              rotationTmp.x = 0;
          } else {
            rotationTmp.z = rotation.z - inc;
          }
          el.setAttribute('rotation', rotationTmp);
        } else if (this.mode == this.MODE_GUARD_RIGHT_CENTER) {
          if (rotation.z>=0){
              if (Math.random() >= 0.5){
                this.mode = this.MODE_PREPARE_RIGHT;
              } else {
                this.mode = this.MODE_PREPARE_LEFT;
              }
              rotationTmp.z = 0;
              rotationTmp.y = 0;
              rotationTmp.x = 0;
          } else {
            rotationTmp.z = rotation.z + inc;
          }
          el.setAttribute('rotation', rotationTmp);
        } else if (this.mode == this.MODE_RETURN_RIGHT) {
          if (rotation.y<=0){
              this.mode = this.MODE_GUARD_RIGHT_CENTER;
              rotationTmp.y = -180;
              rotationTmp.z = -90;
              rotationTmp.x = 0;
          } else {
            rotationTmp.y = rotation.y - inc;
          }
          el.setAttribute('rotation', rotationTmp);
        } else if (this.mode == this.MODE_RETURN_LEFT) {
          if (rotation.y>=0){
              this.mode = this.MODE_GUARD_LEFT_CENTER;
              rotationTmp.y = 180;
              rotationTmp.z = 90;
              rotationTmp.x = 0;
          } else {
            rotationTmp.y = rotation.y + inc;
          }
          el.setAttribute('rotation', rotationTmp);
        }

      },

      hitStart: function (entity) {
        if (!this.isHit){

            var self = this;
            document.querySelector("#player-body").components['aabb-collider']['intersectedEls'].some(function (el) {

                if (el.id == 'floating-lightsaber-blade') {
                    self.isHit = true;
                    self.numHits += 1;
                    self.hitLight.setAttribute('light', 'type: ambient; color: red; intensity: 1');

                    return true;
                }
            });


          if (this.mode == this.MODE_SWING_RIGHT_LEFT){
            this.mode = this.MODE_RETURN_RIGHT;
          } else if (this.mode == this.MODE_SWING_LEFT_RIGHT){
            this.mode = this.MODE_RETURN_LEFT;
          }

          this.addSwing();
        }

      },
      hitEnds: function (entity) {
        if (this.isHit){
          this.isHit = false;
          this.hitLight.setAttribute('light', 'type: ambient; color: red; intensity: 0');
        }

      },

      addSwing: function() {
        if (this.enabled) {
          this.numSwings += 1;
          if (this.numSwings >= 11) {
            this.enabled = false;
            this.el.setAttribute('visible', false);
            this.finalText = "TRAINING END\n\nSwings: " + (this.numSwings -1)+ "\nHits: " + this.numHits;

            document.querySelector("#jediacademy").emit("endminigame", {text: this.finalText, color: "red"});

          }
        }
      }
});
