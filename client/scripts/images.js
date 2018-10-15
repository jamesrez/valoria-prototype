$(document).ready(() => {

  $('.image').click((e) => {
    let imgSrc = e.currentTarget.querySelector('.imageSrc').getAttribute("src");
    socket.emit('New Image', {
      key : "heart",
      src : imgSrc
    });
  })

})
//
// function _base64ToArrayBuffer(base64) {
//     var binary_string =  window.atob(base64);
//     var len = binary_string.length;
//     var bytes = new Uint8Array( len );
//     for (var i = 0; i < len; i++)        {
//         bytes[i] = binary_string.charCodeAt(i);
//     }
//     return bytes.buffer;
// }
//
// let GIFReader  = new FileReader();
// GIFReader.addEventListener("load", () => {
//     let base64gif = GIFReader.result;
//     let baseString = base64gif.substring(22, base64gif.length-1);
//     gifBuffer = _base64ToArrayBuffer(baseString);
//     let gif = new GIF(gifBuffer);
//     console.log(gif.decompressFrames(true));
//   }, false);


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
