AFRAME.registerComponent('floating-lightsaber', {  
    schema: {
        color: {type: 'string'},
        target: {type: 'selector'}
      },

    init: function() {    
        this.directionVec3 = new THREE.Vector3();
        this.positionVec3 = new THREE.Vector3();
        this.scaleVec3 = new THREE.Vector3();


        var entity = document.createElement('a-entity');
        entity.id = "floating-lightsaber-blade";
        entity.setAttribute('geometry', {
            primitive: 'cylinder',
            radius: 0.01,
            height: 1.2
        });        
        entity.setAttribute('material', 'color', this.data.color);
        
        
        this.positionVec3.x = 0;
        this.positionVec3.y = 0.6;
        this.positionVec3.z = 0;
        
        entity.setAttribute('position', this.positionVec3);

        this.el.appendChild(entity);
        this.lightsaberBlade = entity;


        var entity = document.createElement('a-entity');
        entity.id = "floating-lightsaber-hilt";
        entity.setAttribute('collada-model', '#ls-hilt-dae');   
        
        this.scaleVec3.x = 0.1
        this.scaleVec3.y = 0.1
        this.scaleVec3.z = 0.1

        entity.setAttribute('scale', this.positionVec3);
        
        
        
        this.positionVec3.x = 0;
        this.positionVec3.y = 0;
        this.positionVec3.z = 0;
        
        entity.setAttribute('position', this.positionVec3);

        this.el.appendChild(entity);
        this.lightsaberHilt = entity;



        
    },


    tick2: function (time, timeDelta) {
        var directionVec3 = this.directionVec3;
        // Grab position vectors (THREE.Vector3) from the entities' three.js objects.
        var targetPosition = this.data.target.object3D.position;
        var currentPosition = this.el.object3D.position;
        
        // Subtract the vectors to get the direction the entity should head in.
        directionVec3.copy(targetPosition).sub(currentPosition);
        // Calculate the distance.
        var distance = directionVec3.length();
        // Don't go any closer if a close proximity has been reached.
        if (distance < 2) { return; }
        // Scale the direction vector's magnitude down to match the speed.
        var factor = 10 / distance;
        ['x', 'y', 'z'].forEach(function (axis) {
          directionVec3[axis] *= factor * (timeDelta / 1000);
        });
        // Translate the entity in the direction towards the target.
        this.el.setAttribute('position', {
          x: currentPosition.x + directionVec3.x,
          y: currentPosition.y + directionVec3.y,
          z: currentPosition.z + directionVec3.z
        });
      },

      tick: function (time, timeDelta) {
        var el = this.el;
        var rotationTmp = this.rotationTmp = this.rotationTmp || {x: 0, y: 0, z: 0};
        var rotation = el.getAttribute('rotation');

        
        rotationTmp.z = rotation.z + 2;
        //rotationTmp.y = rotation.y + 0.1;
        //rotationTmp.z = rotation.z + 0.1;
        el.setAttribute('rotation', rotationTmp);
        

      }
});
