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
        this.WEAPON_UP_RIGHT = '0.5 0.2 1';
        this.WEAPON_DOWN_RIGHT = '0.5 -0.3 1';
        this.WEAPON_DOWN_LEFT = '-1 -0.3 1';

        this.WEAPONS = {
            0: this.WEAPON_UP_LEFT,
            1: this.WEAPON_UP_RIGHT,
            2: this.WEAPON_DOWN_LEFT,
            3: this.WEAPON_DOWN_RIGHT
        };

        this.MAX_POSITION = {
            'x': 5,
            'y': 6
        };

        this.MIN_POSITION = {
            'x': -5,
            'y': 1.7
        };

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
        this.followPosition = new THREE.Vector3();

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



        // Light projectile's container
        entity = document.createElement('a-entity');
        entity.id = "light-projectile-container";
        entity.setAttribute('geometry', {
            primitive: 'sphere',
            radius: 0.1
        });
        entity.setAttribute('material', 'transparent', true);
        entity.setAttribute('material', 'opacity', 0);
        entity.setAttribute('position', this.activeWeapon);
        entity.setAttribute('visible', false);
        entity.classList.add('collideable');
        this.lightProjectileContainer = entity;
        this.el.appendChild(this.lightProjectileContainer);


        // Light projectile
        entity = document.createElement('a-entity');
        entity.id = "light-projectile";
        entity.setAttribute('geometry', {
            primitive: 'sphere',
            radius: 0.02
        });
        entity.setAttribute('material', 'color', this.data.color);
        entity.setAttribute('position', this.activeWeapon);
        // entity.setAttribute('rotation', '-90 0 -30');
        entity.setAttribute('visible', false);
        this.lightProjectile = entity;
        this.el.appendChild(this.lightProjectile);



        var self = this;
        this.lightProjectileContainer.addEventListener('hitstart', function (event) {
            self.hitStart(event.target);
        });

        this.lightProjectileContainer.addEventListener('hitend', function (event) {
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

    },

    setUp: function() {
        this.numShots = 0;
        this.numHits = 0;
        this.el.setAttribute('position', '0 6 -40');
        this.el.setAttribute('visible', true);

        this.currentLocalPosition = this.lightProjectile.object3D.position;
        this.targetWorldPosition.setFromMatrixPosition(this.data.target.object3D.matrixWorld);
        this.robotPosition = this.el.object3D.position;

        this.followPosition['x'] = 0;
        this.followPosition['y'] = 6;
        this.followPosition['z'] = -15;

        this.trainingRobot.setAttribute('visible', true);
        this.lightProjectile.setAttribute('visible', false);
        this.lightProjectileContainer.setAttribute('visible', false);

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
        if (this.mode === this.MODE_HOVER) {
            // Grab position vectors (THREE.Vector3) from the entities' three.js objects.
            this.robotPosition = this.el.object3D.position;

            // Subtract the vectors to get the direction the entity should head in.
            this.directionVec3.copy(this.followPosition).sub(this.robotPosition);
            // Calculate the distance.
            this.distance = this.directionVec3.length();
            this.factor = (30 / this.distance) * (timeDelta / 1000);

            // Don't go any closer if a close proximity has been reached.
            /*if (this.distance < 0) {

                // Scale the direction vector's magnitude down to match the speed.
                // Translate the entity in the direction against the target.
                this.el.setAttribute('position', {
                    x: this.robotPosition.x - (this.directionVec3.x * this.factor),
                    y: this.robotPosition.y - (this.directionVec3.y * this.factor),
                    z: this.robotPosition.z - (this.directionVec3.z * this.factor)
                });
            } else */
            if (this.distance > 0.1) {
                // Translate the entity in the direction towards the target.
                this.el.setAttribute('position', {
                    x: this.robotPosition.x + (this.directionVec3.x * this.factor),
                    y: this.robotPosition.y + (this.directionVec3.y * this.factor),
                    z: this.robotPosition.z + (this.directionVec3.z * this.factor)
                });
            } else {
                this.changeFollowPosition();
                this.recharge();
            }
        }
    },

    changeFollowPosition: function() {
        // Choose a new position for the robot to follow
        this.followPosition.copy(this.el.object3D.position);

        var self = this;
        ['x', 'y'].forEach(function (axis) {
            var sense = Math.random() < 0.5 ? -1 : 1;
            self.followPosition[axis] += sense * (Math.random() * 5 );

            if (self.followPosition[axis] > self.MAX_POSITION[axis]) {
                self.followPosition[axis] = self.MAX_POSITION[axis];
            } else if (self.followPosition[axis] < self.MIN_POSITION[axis]) {
                self.followPosition[axis] = self.MIN_POSITION[axis];
            }
        });
    },


    fight: function (time, timeDelta) {

        if (this.mode === this.MODE_SHOOT) {

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

            if (this.distance > 0.01) {
                // Translate the entity in the direction towards the target.
                this.lightProjectile.setAttribute('position', {
                    x: this.currentLocalPosition.x + this.directionVec3.x,
                    y: this.currentLocalPosition.y + this.directionVec3.y,
                    z: this.currentLocalPosition.z + this.directionVec3.z
                });

                // Move the collideable container too
                this.lightProjectileContainer.setAttribute('position', this.lightProjectile.object3D.position);
            } else {
                this.addShot();
            }
        }
    },

    hitStart: function (entity) {
        if (!this.isHit) {
            var self = this;
            document.querySelector("#player-body").components['aabb-collider']['intersectedEls'].some(function (el) {

                if (el.id === 'light-projectile-container') {
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
        if (this.enabled) {
            this.numShots += 1;
            this.mode = this.MODE_HOVER;

            if (this.numShots >= 20) {
                this.enabled = false;
                this.el.setAttribute('visible', false);
                this.finalText = "TRAINING END\n\nShots: " + this.numShots + "\nHits: " + this.numHits;

                document.querySelector("#jediacademy").emit("endminigame", {text: this.finalText, color: "red"});
            }
        }
    },

    recharge: function () {
        this.nextWeapon = Math.floor((Math.random() * 4));
        this.activeWeapon = this.WEAPONS[this.nextWeapon];

        // Update projectile and collideable container
        this.lightProjectileContainer.setAttribute('position', this.activeWeapon);
        this.lightProjectileContainer.setAttribute('visible', true);
        this.lightProjectile.setAttribute('position', this.activeWeapon);
        this.lightProjectile.setAttribute('visible', true);

        this.targetWorldPosition.setFromMatrixPosition(this.data.target.object3D.matrixWorld);

        this.mode = this.MODE_SHOOT;
    }
});
