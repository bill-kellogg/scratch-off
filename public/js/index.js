const container = document.querySelector(".offer__wrapper")
const canvas_id = "canvas"
const canvas = document.getElementById(canvas_id)
const ctx = document.getElementById(canvas_id).getContext("2d")

const assetPath = "https://s3.us-east-2.amazonaws.com/mrwillybee/images"

let scratch_image = new Image()
    scratch_image.crossOrigin = "Anonymous"
    scratch_image.src = `${assetPath}/scratch-off-cover.jpg`

const image_arr = [
  {
    src: "illusion_0.jpg",
    copy: "Illusion 0",
    link: "#"
  },
  {
    src: "illusion_1.jpg",
    copy: "Illusion 1",
    link: "#"
  },
  {
    src: "illusion_2.jpg",
    copy: "Illusion 2",
    link: "#"
  }
]

// pick random number between one and 3 to select an illusion image from arr
const imageIdx = randomIntFromInterval(1, 3)

let isDrawing = null
let lastPoint = null
let hand_animation = true

function handleMouseUp() {
  isDrawing = false;
}

function placeResultImage(imageIdx) {
  const imagePath = `${image_arr[imageIdx].src}`;
  document.querySelector(".offer__wrapper").style.backgroundImage = `url(
    ${assetPath}/${imagePath}
  )`;
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min) - 1;
}

function getCanvasHeight() {
  return (
    document.querySelector(".offer__wrapper").getBoundingClientRect().height + 1
  )
}

function getCanvasWidth() {
  return (
    document.querySelector(".offer__wrapper").getBoundingClientRect().width + 1
  )
}

// util function to parse mouse/touch event data
function distanceBetween(point1, point2) {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2) || 1
  )
}

// util function to parse mouse/touch event data
function angleBetween(point1, point2) {
  return Math.atan2(point2.x - point1.x, point2.y - point1.y) || 1
}

function getFilledInPixels() {
  // radius of scratching circle
  const radius = 35

  let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height),
      pdata = pixels.data,
      l = pdata.length,
      total = l / radius,
      count = 0

  for (var i = (count = 0); i < l; i += radius) {
    if (parseInt(pdata[i], 10) === 0) {
      count++
    }
  }

  return Math.round((count / total) * 100) || 0
}

function getMouseCoords(e) {
  let offsetX = container.getBoundingClientRect().left,
      offsetY = container.getBoundingClientRect().top
  
  let mx = e.pageX - offsetX,
      my = e.pageY - offsetY - window.pageYOffset

  return { x: mx, y: my }
}

function handlePercentage(filledInPixels) {
  // remove canvas once 60% of it has been scratched off
  if (filledInPixels > 60 && canvas.parentNode) {
    canvas.parentNode.removeChild(canvas)
  }
}

function handleMouseDown(e) {
  //remove scratch animation if it's present
  if (hand_animation) {
    let animation_wrapper = document.querySelector(".animation__wrapper");
    document.querySelector(".offer__wrapper").removeChild(animation_wrapper);
    hand_animation = false;
  }

  isDrawing = true;
  lastPoint = getMouseCoords(e);
}

function handleMouseMove(e) {
  if (!isDrawing) {
    return;
  }

  e.preventDefault();

  let currentPoint = getMouseCoords(e),
    dist = distanceBetween(lastPoint, currentPoint),
    angle = angleBetween(lastPoint, currentPoint),
    x,
    y;

  ctx.beginPath();

  // cut circles out of canvas for each pixel distance traveled 
  for (let i = 0; i < dist; i++) {
    x = lastPoint.x + Math.sin(angle) * i;
    y = lastPoint.y + Math.cos(angle) * i;
    ctx.globalCompositeOperation = "destination-out";
    ctx.arc(x, y, 35, 0, Math.PI * 2, true);
    ctx.fill();
  }

  ctx.stroke()
  lastPoint = currentPoint

  // check how much of the canvas is left
  handlePercentage(getFilledInPixels())
}

function init() {
  canvas.width = getCanvasWidth();
  canvas.height = getCanvasHeight();

  scratch_image.onload = function () {
    ctx.drawImage(scratch_image, 0, 0, getCanvasWidth(), getCanvasHeight());
    document.querySelector(".animation__wrapper").classList.add("start");
    placeResultImage(imageIdx);
  };

  canvas.addEventListener("click", () => false, false);

  canvas.addEventListener("mouseenter", handleMouseDown, false);
  canvas.addEventListener("mousemove", handleMouseMove, false);
  canvas.addEventListener("mouseup", handleMouseUp, false);

  canvas.addEventListener("touchstart", handleMouseDown, false);
  canvas.addEventListener("touchmove", handleMouseMove, false);
  canvas.addEventListener("touchend", handleMouseUp, false);
}

init();
