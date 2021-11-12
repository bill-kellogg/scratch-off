let container = document.querySelector(".offer__wrapper");
let canvas_id = "canvas";
let canvas = document.getElementById(canvas_id);
let ctx = document.getElementById(canvas_id).getContext("2d");
let scratch_image = new Image();
let assetPath = "https://s3.us-east-2.amazonaws.com/mrwillybee/images";
scratch_image.crossOrigin = "Anonymous";
scratch_image.src = `${assetPath}/scratch-off-cover.jpg`;

let image_arr = [
  {
    src: "illusion_0.jpg",
    copy: "Up to $18.50 value.",
    link: "#"
  },
  {
    src: "illusion_1.jpg",
    copy: "Up to $32.95 value.",
    link: "#"
  },
  {
    src: "illusion_2.jpg",
    copy: "Excludes Victoria's Secret bras and clearance.",
    link: "#"
  }
];

let imageIdx = randomIntFromInterval(1, 3);
let isDrawing = null;
let lastPoint = null;
let hand_animation = true;

function getCanvasHeight() {
  return (
    document.querySelector(".offer__wrapper").getBoundingClientRect().height + 1
  );
}

function getCanvasWidth() {
  return (
    document.querySelector(".offer__wrapper").getBoundingClientRect().width + 1
  );
}

function distanceBetween(point1, point2) {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
  );
}

function angleBetween(point1, point2) {
  return Math.atan2(point2.x - point1.x, point2.y - point1.y);
}

function getFilledInPixels(stride) {
  if (!stride || stride < 1) {
    stride = 1;
  }

  let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height),
    pdata = pixels.data,
    l = pdata.length,
    total = l / stride,
    count = 0;

  for (var i = (count = 0); i < l; i += stride) {
    if (parseInt(pdata[i]) === 0) {
      count++;
    }
  }
  return Math.round((count / total) * 100);
}

function getMouse(e, canvas) {
  let offsetX = container.getBoundingClientRect().left,
    offsetY = container.getBoundingClientRect().top,
    mx,
    my;

  mx = e.pageX - offsetX;
  my = e.pageY - offsetY - window.pageYOffset;

  return { x: mx, y: my };
}

function handlePercentage(filledInPixels) {
  filledInPixels = filledInPixels || 0;

  if (filledInPixels > 60 && canvas.parentNode) {
    canvas.parentNode.removeChild(canvas);
    scratchCompleteCb();
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
  lastPoint = getMouse(e, canvas);
}

function handleMouseMove(e) {
  if (!isDrawing) {
    return;
  }

  e.preventDefault();

  let currentPoint = getMouse(e, canvas),
    dist = distanceBetween(lastPoint, currentPoint),
    angle = angleBetween(lastPoint, currentPoint),
    x,
    y;

  ctx.beginPath();

  for (let i = 0; i < dist; i++) {
    x = lastPoint.x + Math.sin(angle) * i;
    y = lastPoint.y + Math.cos(angle) * i;
    ctx.globalCompositeOperation = "destination-out";
    ctx.arc(x, y, 35, 0, Math.PI * 2, true);
    ctx.fill();
  }

  ctx.stroke();
  lastPoint = currentPoint;
  handlePercentage(getFilledInPixels(35));
}

function handleMouseUp(e) {
  isDrawing = false;
}

function init() {
  canvas.width = getCanvasWidth();
  canvas.height = getCanvasHeight();

  scratch_image.onload = function () {
    ctx.drawImage(scratch_image, 0, 0, getCanvasWidth(), getCanvasHeight());
    document.querySelector(".animation__wrapper").classList.add("start");
    placeOfferContent(imageIdx);
  };

  canvas.addEventListener("click", () => false, false);

  canvas.addEventListener("mouseenter", handleMouseDown, false);
  canvas.addEventListener("mousemove", handleMouseMove, false);
  canvas.addEventListener("mouseup", handleMouseUp, false);

  canvas.addEventListener("touchstart", handleMouseDown, false);
  canvas.addEventListener("touchmove", handleMouseMove, false);
  canvas.addEventListener("touchend", handleMouseUp, false);
}

function scratchCompleteCb() {
  placeOfferContent(imageIdx);
}

function placeOfferContent(imageIdx) {
  const imagePath = `${image_arr[imageIdx].src}`;
  document.querySelector(".offer__wrapper").style.backgroundImage = `url(
    ${assetPath}/${imagePath}
  )`;
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min) - 1;
}

init();
