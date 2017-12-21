AFRAME.registerComponent('training-robot', {
    schema: {
        color: {type: 'string'},
        speed: {type: 'number'},
        target: {type: 'selector'}
    },

    init: function () {
        this.MODE_HOVER = 0;
        this.MODE_SHOOT = 1;

        this.WEAPON_UP_LEFT = '-1 0.2 1';
        this.WEAPON_UP_RIGHT = '0 0.2 1';
        this.WEAPON_DOWN_RIGHT = '0 -0.3 1';
        this.WEAPON_DOWN_LEFT = '-1 -0.3 1';

        this.WEAPONS = {
            0: this.WEAPON_UP_LEFT,
            1: this.WEAPON_UP_RIGHT,
            2: this.WEAPON_DOWN_LEFT,
            3: this.WEAPON_DOWN_RIGHT
        }

        this.isHit = false;
        this.enabled = false;

        this.numShots = 0;
        this.numHits = 0;

        this.mode = this.MODE_HOVER;
        this.activeWeapon = this.WEAPON_UP_LEFT;
        this.nextWeapon = 0;

        this.directionVec3 = new THREE.Vector3();
        this.targetWorldPosition = new THREE.Vector3();
        this.currentWorldPosition = new THREE.Vector3();
        this.currentLocalPosition = this.el.object3D.position;
        this.robotPosition = this.el.object3D.position;

        this.distance = 0;
        this.factor = 0;

        //Hit light
        var entity = document.createElement('a-entity');
        this.hitLight = entity;
        this.hitLight.setAttribute('light', 'type: ambient; color: red; intensity: 0');
        this.el.appendChild(entity);


        // Robot
        entity = document.querySelector('#training-robot');
        entity.setAttribute('rotation', '0 0 0');

        this.el.appendChild(entity);
        this.trainingRobot = entity;


        // Light projectile
        entity = document.createElement('a-entity');
        entity.id = "light-projectile";
        entity.setAttribute('geometry', {
            primitive: 'cylinder',
            radius: 0.02,
            height: 0.1
        });
        entity.setAttribute('material', 'color', this.data.color);
        entity.setAttribute('position', this.activeWeapon);
        entity.setAttribute('rotation', '-90 0 -30');
        entity.setAttribute('visible', false);
        entity.classList.add('collideable');

        this.el.appendChild(entity);
        this.lightProjectile = entity;

        var self = this;
        this.lightProjectile.addEventListener('hitstart', function (event) {
            self.hitStart(event.target);
        });

        this.lightProjectile.addEventListener('hitend', function (event) {
            self.hitEnds(event.target);
        });

        this.el.addEventListener('enable', function (event) {
            self.setUp();
        });

        this.el.addEventListener('disable', function (event) {
            self.enabled = false;
            self.el.setAttribute('position', '0 -100 -20');
            self.trainingRobot.setAttribute('visible', false);
        });

        this.lightProjectile.setAttribute('position', this.activeWeapon)
        this.lightProjectile.setAttribute('visible', true);

    },

    setUp: function() {
        this.numShots = 0;
        this.numHits = 0;
        this.el.setAttribute('position', '10 1.5 -20');
        this.el.setAttribute('visible', true);

        this.currentLocalPosition = this.lightProjectile.object3D.position;
        this.targetWorldPosition.setFromMatrixPosition(this.data.target.object3D.matrixWorld);
        this.robotPosition = this.el.object3D.position;
        this.trainingRobot.setAttribute('visible', true);
        this.lightProjectile.setAttribute('visible', false);

        this.mode = this.MODE_HOVER;
        this.enabled = true;
    },

    tick: function (time, timeDelta) {
        if (this.enabled) {
            this.follow(time, timeDelta);
            this.fight(time, timeDelta);
        }
    },


    follow: function (time, timeDelta) {
        // Grab position vectors (THREE.Vector3) from the entities' three.js objects.
        this.robotPosition = this.el.object3D.position;

        // Subtract the vectors to get the direction the entity should head in.
        this.directionVec3.copy(this.data.target.object3D.position).sub(this.robotPosition);
        // Calculate the distance.
        this.distance = this.directionVec3.length();
        // Scale the direction vector's magnitude down to match the speed.
        var self = this;
        this.factor = 10 / this.distance;
        ['x', 'y', 'z'].forEach(function (axis) {
            self.directionVec3[axis] *= self.factor * (timeDelta / 1000);
        });


        // Don't go any closer if a close proximity has been reached.
        if (this.distance < 15) {
            // Translate the entity in the direction against the target.
            this.el.setAttribute('position', {
                x: this.robotPosition.x - this.directionVec3.x,
                // Do not change height
                y: this.robotPosition.y,// + this.directionVec3.y,
                z: this.robotPosition.z - this.directionVec3.z
            });
        } else if (this.distance > 15.1) {

            // Translate the entity in the direction towards the target.
            this.el.setAttribute('position', {
                x: this.robotPosition.x + this.directionVec3.x,
                // Do not change height
                y: this.robotPosition.y,// + this.directionVec3.y,
                z: this.robotPosition.z + this.directionVec3.z
            });
        } else if (this.mode == this.MODE_HOVER) {
            this.recharge();
        }
    },


    fight: function (time, timeDelta) {

        this.currentLocalPosition = this.lightProjectile.object3D.position;

        // Grab global position vectors (THREE.Vector3) from the entities' three.js objects.
        this.currentWorldPosition.setFromMatrixPosition(this.lightProjectile.object3D.matrixWorld);

        // Subtract the vectors to get the direction the entity should head in.
        this.directionVec3.copy(this.targetWorldPosition).sub(this.currentWorldPosition);
        // Calculate the distance.
        this.distance = this.directionVec3.length();

        // Scale the direction vector's magnitude down to match the speed.
        var self = this;
        this.factor = (20 * this.data.speed) / this.distance;
        ['x', 'y', 'z'].forEach(function (axis) {
            self.directionVec3[axis] *= self.factor * (timeDelta / 1000);
        });


        if (this.mode == this.MODE_SHOOT) {

            if (this.distance > 0) {
                // Translate the entity in the direction towards the target.
                this.lightProjectile.setAttribute('position', {
                    x: this.currentLocalPosition.x + this.directionVec3.x,
                    // Do not change height
                    y: this.currentLocalPosition.y + this.directionVec3.y,
                    z: this.currentLocalPosition.z + this.directionVec3.z
                });
            } else {
                this.mode = this.MODE_HOVER;
                this.addShot();
            }
        }
    },

    hitStart: function (entity) {
        if (!this.isHit) {
            var self = this;
            document.querySelector("#player-body").components['aabb-collider']['intersectedEls'].some(function (el) {

                if (el.id == 'light-projectile') {
                    this.mode = this.MODE_HOVER;
                    self.isHit = true;
                    self.numHits += 1;
                    self.hitLight.setAttribute('light', 'type: ambient; color: red; intensity: 1');

                    return true;
                }
            });

            this.addShot();
        }

    },
    hitEnds: function (entity) {
        if (this.isHit) {
            this.isHit = false;

            this.hitLight.setAttribute('light', 'type: ambient; color: red; intensity: 0');
        }
    },

    addShot: function () {
        this.numShots += 1;

        if (this.numShots >= 3) {
            this.enabled = false;
            this.el.setAttribute('visible', false);
            this.finalText = "TRAINING END\n\nShots: " + this.numShots + "\nHits: " + this.numHits;

            document.querySelector("#jediacademy").emit("endminigame", {text: this.finalText, color: "red"});
        } else {
            this.recharge();
        }
    },

    recharge: function () {
        this.nextWeapon = Math.floor((Math.random() * 4));
        this.activeWeapon = this.WEAPONS[this.nextWeapon];

        this.lightProjectile.setAttribute('position', this.activeWeapon);
        this.lightProjectile.setAttribute('visible', true);
        this.mode = this.MODE_SHOOT;

        this.targetWorldPosition.setFromMatrixPosition(this.data.target.object3D.matrixWorld);
    }
});
