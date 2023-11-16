export const createPosterImage = (text) => {
  if (!text) {
    text = "U";
  }
  const displayText = text.substring(0, 2);
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  context.font = "bold 62px Arial";
  context.fillStyle = "white";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(displayText, canvas.width / 2, canvas.height / 2);
  const image = new Image();
  image.src = canvas.toDataURL("image/png");
  return image.src;
};
