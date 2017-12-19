AFRAME.registerComponent('training-robot', {  
    schema: {
        speed: {type: 'number'},
        target: {type: 'selector'}
      },

    init: function() {            
        this.MODE_HOVER = 0;
        
        this.isHit = false;
        this.enabled = false;

        this.numShots = 0;
        this.numHits = 0;

        this.mode = this.MODE_HOVER;


        this.directionVec3 = new THREE.Vector3();

        //Hit light
        var entity = document.createElement('a-entity');
        this.hitLight = entity;
        this.hitLight.setAttribute('light', 'type: ambient; color: red; intensity: 0'); 
        this.el.appendChild(entity);


        // Robot
        var entity = document.createElement('a-entity');
        entity.id = "training-robot";
        entity.setAttribute('obj-model', 'obj: #training-robot-obj');
        entity.setAttribute('scale', '0.16 0.16 0.16');
        entity.setAttribute('rotation', '0 0 -90');
        
        this.el.appendChild(entity);
        this.trainingRobot = entity;

        //TODO: Laser hits
        /*
        var self = this;
        this.lightsaberBlade.addEventListener('hitstart', function (event) {          
          self.hitStart();          
        });

        this.lightsaberBlade.addEventListener('hitend', function (event) {          
          self.hitEnds();          
        });
        */

        var self = this;

        this.el.addEventListener('enable', function (event) {          
          self.enabled = true;
          self.numShots = 0;
          self.numHits = 0;
          self.el.setAttribute('position', '10 1.5 -20');
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
        // Don't go any closer if a close proximity has been reached.
        if (distance < 4) { return; }
        // Scale the direction vector's magnitude down to match the speed.
        var factor = 10 / distance;
        ['x', 'y', 'z'].forEach(function (axis) {
          directionVec3[axis] *= factor * (timeDelta / 1000);
        });
        // Translate the entity in the direction towards the target.
        this.el.setAttribute('position', {
          x: currentPosition.x + directionVec3.x,
          // Do not change height
          y: currentPosition.y,// + directionVec3.y,
          z: currentPosition.z + directionVec3.z
        });
      },

      
      fight: function (time, timeDelta) {
        //TODO

      },

      hitStart: function () {          
        // TODO

      },
      hitEnds: function () {          
        // TODO

      },

      addShot: function() {
        this.numShots += 1;
        if (this.numShots >= 3) {
          this.enabled = false;
          this.el.setAttribute('visible', false);
          this.finalText = "TRAINING END\n\nShots: " + (this.numShots -1)+ "\nHits: " + this.numHits;

          document.querySelector("#jediacademy").emit("endminigame", {text: this.finalText, color: "red"});

        }
      }
});
