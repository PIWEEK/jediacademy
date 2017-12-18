AFRAME.registerComponent('floating-lightsaber', {  
    schema: {
        color: {type: 'string'},
        target: {type: 'selector'}
      },

    init: function() {    
        var entity = document.createElement('a-entity');
        entity.id = "floating-lightsaber";
        entity.setAttribute('geometry', {
            primitive: 'cylinder',
            radius: 0.01,
            height: 0.8
        });        
        entity.setAttribute('material', 'color', this.data.color);
        
        this.el.appendChild(entity);
        this.lightsaber = entity;
        this.directionVec3 = new THREE.Vector3();
        
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
        var el = this.lightsaber;
        var rotationTmp = this.rotationTmp = this.rotationTmp || {x: 0, y: 0, z: 0};
        var rotation = el.getAttribute('rotation');

        if (rotation.z<45) {
            rotationTmp.z = rotation.z + 1;
            //rotationTmp.y = rotation.y + 0.1;
            //rotationTmp.z = rotation.z + 0.1;
            el.setAttribute('rotation', rotationTmp);


            var positionTmp = this.positionTmp = this.positionTmp || {x: 0, y: 0, z: 0};
            var position = el.getAttribute('position');
            positionTmp.x = position.x - 0.004;
            positionTmp.y = position.y;
            positionTmp.z = position.z;
            el.setAttribute('position', positionTmp);
        }

      }
});
