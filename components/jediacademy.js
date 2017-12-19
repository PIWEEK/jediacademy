AFRAME.registerComponent('jediacademy', {
    init: function () {
      var sceneEl = this.el;
      if (sceneEl.hasLoaded) {
        this.run();
      } else {
        sceneEl.addEventListener('loaded', this.run);
      }



    },
    run: function() {
        console.log("Run!!!");
        //document.querySelector("#floatingLsContainer").emit('enable');
    }
  });