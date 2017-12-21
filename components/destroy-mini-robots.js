AFRAME.registerComponent('destroy-mini-robots', {
    schema: {
        speed: {type: 'number'},
        target: {type: 'selector'}
      },

    init: function() {
        this.enabled = false;
        this.hiteable = false;


        this.directionVec3 = new THREE.Vector3();
        var self = this;


        // Robots

        this.robots = [];

        for (var i = 0; i < 10; i++) {


          entity = document.createElement('a-entity');
          entity.setAttribute('geometry', {
              primitive: 'box',
              width: 0.05,
               height: 0.05,
               depth: 0.05
          });
          entity.classList.add('collideable');

          this.el.appendChild(entity);
          this.robots.push(entity);

          entity.addEventListener('hitstart', function (event) {
            self.hitStart(this);
          });

        }


        this.el.addEventListener('enable', function (event) {
          self.enabled = true;
          self.hiteable = false;
          self.totalTime = 0;
          console.log("start");

          for (var i = 0; i < 10; i++) {
            self.robots[i].setAttribute('alive', true);
            self.robots[i].setAttribute('material', 'color', "white");
            self.robots[i].setAttribute('visible', true);
            self.robots[i].setAttribute('position', {
              x: 1 - Math.random() / 2,
              y: 0.5 + Math.random() * 1.5,
              z: Math.random() * 1.5
            });
          }

          for (var i = 3; i < 6; i++) {
            self.robots[i].setAttribute('alive', true);
            self.robots[i].setAttribute('visible', true);
            self.robots[i].setAttribute('position', {
              x: 0 - Math.random() * 2,
              y: 0.5 + Math.random() * 1.5,
              z: -0.5 + Math.random() / 2
            });
          }

          for (var i = 6; i < 10; i++) {
            self.robots[i].setAttribute('alive', true);
            self.robots[i].setAttribute('visible', true);
            self.robots[i].setAttribute('position', {
              x: -1 + Math.random() / 2,
              y: 0.5 + Math.random() * 1.5,
              z: 0 - Math.random() / 2
            });
          }



          self.numRobots = 10;
          self.el.setAttribute('position', '0 0 -20');
          self.targetPosition = new THREE.Vector3()
          self.targetPosition.copy(self.data.target.object3D.position);
        });

        this.el.addEventListener('disable', function (event) {
          self.enabled = false;
          for (var i = 0; i < self.robots.length; i++) {
            self.robots[i].setAttribute('visible', false);
            self.robots[i].setAttribute('position', '0 -100 -20');
          }
        });




    },

    tick: function (time, timeDelta) {
      if (this.enabled) {
        this.follow(time, timeDelta);
        this.totalTime += timeDelta;
      }

    },


    follow: function (time, timeDelta) {
        var directionVec3 = this.directionVec3;
        // Grab position vectors (THREE.Vector3) from the entities' three.js objects.
        var currentPosition = this.el.object3D.position;

        // Subtract the vectors to get the direction the entity should head in.
        directionVec3.copy(this.targetPosition).sub(currentPosition);
        // Calculate the distance.
        var distance = directionVec3.length();
        // Scale the direction vector's magnitude down to match the speed.
        var factor = 10 / distance;
        ['x', 'y', 'z'].forEach(function (axis) {
          directionVec3[axis] *= factor * (timeDelta / 1000);
        });


        // Don't go any closer if a close proximity has been reached.
        if (distance > 2) {
          this.el.setAttribute('position', {
            x: currentPosition.x + directionVec3.x,
            // Do not change height
            y: currentPosition.y,// + directionVec3.y,
            z: currentPosition.z + directionVec3.z
          });
        }

        if (distance < 2) {
          console.log("HITEABLE!!")
          this.hiteable = true;
        } else {
          console.log(distance);
        }
      },


      fight: function (time, timeDelta) {
        //TODO

      },

      hitStart: function (robot) {
        console.log(this.enabled, this.hiteable);
        if (this.enabled && this.hiteable) {
            robot.setAttribute('visible', false);
            robot.setAttribute('position', '0 -100 -20');
            this.numRobots -= 1;
            if (this.numRobots == 0){

              this.enabled = false;
              this.finalText = "training end\n\ntime: " + this.totalTime;
              document.querySelector("#jediacademy").emit("endminigame", {text: this.finalText, color: "#ffe81f"});
            }


        }

      },
      hitEnds: function () {
        // TODO

      }
});
