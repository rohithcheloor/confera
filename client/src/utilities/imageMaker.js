export const createPosterImage = (text, width, height) => {
  // Create a canvas element
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  // Get the 2D drawing context
  const context = canvas.getContext('2d');

  // Define the background color and text color
  context.fillStyle = 'green';
  context.fillRect(0, 0, width, height);
  context.font = `${height * 0.7}px Arial`;
  context.fillStyle = 'white';

  // Calculate the position to center the text
  const textWidth = context.measureText(text).width;
  const x = (width - textWidth) / 2;
  const y = height * 0.8;

  // Draw the first letter of the text with a horizontal flip transformation
  context.save();
  context.scale(-1, 1); // Flip horizontally
  context.fillText(text[0], - (x * 3), y);
  context.restore();

  // Create an image from the canvas
  const img = new Image();
  img.src = canvas.toDataURL();

  return img;
};
