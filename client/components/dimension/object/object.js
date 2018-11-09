function addNewObject(newObject){
  objects[newObject.elemId] = new anObject();
  objects[newObject.elemId].elemId = newObject.elemId;
  objects[newObject.elemId].src = newObject.src;
  objects[newObject.elemId].socket = newObject.socket;
  objects[newObject.elemId].dimension = newObject.dimension;
  objects[newObject.elemId].renderAtPos(newObject.pos);
}

class anObject {
  constructor(){
    this.elemId = null;
    this.socket = socket;
    this.src = null;
    this.dimension = null;
    this.pos = {
      x : null,
      y : null
    };
    this.width = 40;
    this.height = 40;
  }
  renderAtPos(pos){
    $('.objects').append(`
      <img id=${this.elemId} class="myObject object" src=${this.src} draggable="false"></img>
    `);
    $(`#${this.elemId}`).css({
      left : pos.x,
      top : pos.y
    });
    this.pos = pos;
  }
  updatePos(newPos){
    this.pos.x = newPos.x - (this.width / 2);
    this.pos.y = newPos.y - (this.height / 2);
    $(`#${this.elemId}`).css({
      left : this.pos.x,
      top : this.pos.y
    });
    socket.emit('Object has moved', {
      objectId : this.elemId,
      newPos : this.pos,
      dimensionName : dimensionName
    })
  }
};


$(document).ready(() => {
  let objectBeingDragged = null;

  //Load All Objects in Dimension
  $.get(`/dimension/${dimensionName}/environment/objects`, (objects) => {
    objects.forEach((anObject) => {
      addNewObject(anObject);
    })
  })

  //HAVE Object BE DRAGGED WHEN HOLDING click
  $(document).on('mousedown', (e) => {
    if(e.target.classList[1] == 'object'){
      objectBeingDragged = e.target.id;
    }
  });

  //RELEASE OBJECT BEING DRAGGED ON MOUSE UP
  $(document).on('mouseup', (e) => {
    if(objectBeingDragged){
      socket.emit('Save new position of object', objects[objectBeingDragged]);
      objectBeingDragged = null;
    }
  });

  $('.dimension').on('mousemove', (e) => {
    if(objectBeingDragged){
      objects[objectBeingDragged].updatePos(mousePosition);
    }
  })

})



socket.on('New Object', (data) => {
  addNewObject(data);
});

socket.on('Object has moved', (data) => {
  $(`#${data.objectId}`).css({
    left : data.newPos.x,
    top : data.newPos.y
  });
});

socket.on('Object got deleted', objectElemId => {
  delete objects[objectElemId];
  $(`#${objectElemId}`).remove()
})
