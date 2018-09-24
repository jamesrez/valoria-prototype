function uploadFile(){
  var upload = $('#uploadImageInput')[0];
  var image = upload.files[0];
  var formData = new FormData();
  formData.append("upload", image);
  $.ajax({
    url:"/upload",
    type: "POST",
    data: formData,
    contentType:false,
    cache: false,
    processData:false,
    success: (d) => {

    }
  });
}
