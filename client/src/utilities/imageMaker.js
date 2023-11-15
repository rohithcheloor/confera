export const createPosterImage = (text) => {
  // If no text is provided, default to "U"
  if (!text) {
    text = "U";
  }

  // Take the first two letters of the text
  const displayText = text.substring(0, 2);

  // Create a canvas element
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;

  // Get the 2D drawing context
  const context = canvas.getContext("2d");

  // Draw a simple text on the canvas
  context.font = "bold 48px Arial";
  context.fillStyle = "black";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(displayText, canvas.width / 2, canvas.height / 2);

  // Convert the canvas to an image and set it as the source for the img element
  const image = new Image();
  image.src = canvas.toDataURL("image/png");

  return image.src;
};
