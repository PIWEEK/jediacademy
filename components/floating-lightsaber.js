AFRAME.registerComponent('floating-lightsaber', {
    schema: {
        color: {type: 'string'},
        speed: {type: 'number'},
        target: {type: 'selector'}
      },

    init: function() {
        this.MODE_WAIT = 0;
        this.MODE_PREPARE = 1;
        this.MODE_SWING = 2;
        this.MODE_RETURN = 3;
        this.MODE_GUARD = 4;

        this.isHit = false;
        this.enabled = false;

        this.numSwings = 0;
        this.numHits = 0;

        this.mode = this.MODE_WAIT;


        this.directionVec3 = new THREE.Vector3();
        this.rotationTmp = new THREE.Vector3();

        this.rotationTarget = {x: 0, y: 0, z: 0};

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
          self.el.setAttribute('rotation', '0 0 0');
          self.mode = self.MODE_WAIT;
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

        if ((distance <= 1.4) && this.mode == this.MODE_WAIT) {
          this.mode = this.MODE_GUARD;
          console.log("MODE_GUARD");
        }

        // Don't go any closer if a close proximity has been reached.
        if (distance < 1.2) {
          // Translate the entity in the direction against the target.
          this.el.setAttribute('position', {
            x: currentPosition.x - directionVec3.x,
            // Do not change height
            y: currentPosition.y,// + directionVec3.y,
            z: currentPosition.z - directionVec3.z
          });
        } else if (distance > 1.3) {

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
        var rotation = el.getAttribute('rotation');

        var inc = this.data.speed * timeDelta;

        if (this.mode == this.MODE_GUARD) {
          //Convert to negative)
          if (rotation.z > 180) {
            this.rotationTmp.x = 0;
            this.rotationTmp.y = 0;
            this.rotationTmp.z = rotation.z - 360;
            el.setAttribute('rotation', this.rotationTmp);
          }
          //Choose a new angle
          //this.rotationTarget.z = 180 - (Math.random() * 360);
          this.rotationTarget.z = 135 - (Math.random() * 90);
          if (Math.random() > 0.5){
            this.rotationTarget.z = -this.rotationTarget.z;
          }







          this.mode = this.MODE_PREPARE;
          console.log("MODE_PREPARE");
        } else if (this.mode == this.MODE_PREPARE){
          this.rotationTmp.x = 0;
          this.rotationTmp.y = 0;

          if (Math.abs(rotation.z - this.rotationTarget.z) < 15) {
            this.mode = this.MODE_SWING; //SWING
            console.log("MODE_SWING");

            // Convert rotation to positive
            this.rotationTmp.z = rotation.z;
            while (this.rotationTmp.z <= 0) {
              this.rotationTmp.z += 360;
            }

            if (this.rotationTmp.z < 180){
              this.rotationTarget.y = 90;
            } else {
              this.rotationTarget.y = -90;
            }


          } else if (rotation.z < this.rotationTarget.z){
            this.rotationTmp.z = rotation.z + inc;
          } else {
            this.rotationTmp.z = rotation.z - inc;
          }

          el.setAttribute('rotation', this.rotationTmp);
        } else if (this.mode == this.MODE_SWING){
          this.rotationTmp.x = 0;
          this.rotationTmp.z = rotation.z;

          if (Math.abs(rotation.y - this.rotationTarget.y) < 5) {
            this.mode = this.MODE_RETURN;
            console.log("MODE_RETURN");
            this.rotationTmp.y = rotation.y;
          } else if (rotation.y < this.rotationTarget.y){
            this.rotationTmp.y = rotation.y + inc;
          } else {
            this.rotationTmp.y = rotation.y - inc;
          }
          el.setAttribute('rotation', this.rotationTmp);
        } else if (this.mode == this.MODE_RETURN){
          this.rotationTmp.x = 0;
          this.rotationTmp.z = rotation.z;

          if (Math.abs(rotation.y) < 10) {
            this.mode = this.MODE_GUARD;
            this.rotationTmp.y = 0;
            console.log("MODE_GUARD");
          } else if (rotation.y < 0){
            this.rotationTmp.y = rotation.y + inc;
          } else {
            this.rotationTmp.y = rotation.y - inc;
          }
          el.setAttribute('rotation', this.rotationTmp);
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


          this.mode = this.MODE_RETURN;
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
          if (this.numSwings >= 20) {
            this.enabled = false;
            this.el.setAttribute('visible', false);
            this.finalText = "training end\n\nswings: " + (this.numSwings -1)+ "\nhits: " + this.numHits;

            document.querySelector("#jediacademy").emit("endminigame", {text: this.finalText, color: "#ffe81f"});

          }
        }
      }
});
