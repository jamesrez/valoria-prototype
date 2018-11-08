$(document).ready(() => {

  $(document).on('click', '.newDimensionSubmitBtn', () => {

    let body = {
      name : $('.newDimensionName').val(),
      desc : $('.newDimensionDesc').val(),
      ownerChooseAvatars : $('input:radio[name="ownerChooseAvatars"]:checked').val(),
      ownerChooseObjects : $('input:radio[name="ownerChooseObjects"]:checked').val(),
      ownerChooseBackground : $('input:radio[name="ownerChooseBackground"]:checked').val(),
    }

    $.post('/dimension/new', body, (newDimensionName) => {
      window.location = `/dimension/${newDimensionName}`
    });
  })

})
