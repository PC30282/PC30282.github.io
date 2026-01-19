const form = document.getElementById("map-form");
const canvas = document.getElementById("map-canvas");
const metadata = document.getElementById("metadata");
const downloadBtn = document.getElementById("download-btn");
const resetBtn = document.getElementById("reset-btn");
const ctx = canvas.getContext("2d");

const DEFAULTS = {
  eastings: 120,
  northings: 200,
  radius1: 90,
  radius2: 80,
  radius3: 70,
  siteLat: 51.5074,
  siteLong: -0.1278,
  siteEast: 100,
  siteNorth: 180,
};

const readFormValues = () => {
  const formData = new FormData(form);
  return {
    eastings: Number(formData.get("eastings")),
    northings: Number(formData.get("northings")),
    radius1: Number(formData.get("radius1")),
    radius2: Number(formData.get("radius2")),
    radius3: Number(formData.get("radius3")),
    siteLat: Number(formData.get("siteLat")),
    siteLong: Number(formData.get("siteLong")),
    siteEast: Number(formData.get("siteEast")),
    siteNorth: Number(formData.get("siteNorth")),
  };
};

const drawGrid = (step) => {
  ctx.strokeStyle = "#e6e9f5";
  ctx.lineWidth = 1;
  for (let x = step; x < canvas.width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = step; y < canvas.height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
};

const drawMarker = (x, y, label, color) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = "bold 12px sans-serif";
  ctx.fillText(label, x + 10, y - 8);
};

const drawCircle = (x, y, radius, color) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
};

const renderMap = (values) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fbfcff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGrid(40);

  const scale = 1.4;
  const origin = {
    x: canvas.width * 0.2,
    y: canvas.height * 0.75,
  };

  const target = {
    x: origin.x + values.eastings * scale,
    y: origin.y - values.northings * scale,
  };

  const site = {
    x: origin.x + values.siteEast * scale,
    y: origin.y - values.siteNorth * scale,
  };

  drawCircle(target.x, target.y, values.radius1 * scale, "#3f6ae0");
  drawCircle(target.x, target.y, values.radius2 * scale, "#4caf50");
  drawCircle(target.x, target.y, values.radius3 * scale, "#ff7043");

  drawMarker(target.x, target.y, "Target", "#1f2a44");
  drawMarker(site.x, site.y, "Site", "#3f6ae0");

  ctx.fillStyle = "#1f2a44";
  ctx.font = "12px sans-serif";
  ctx.fillText("0m", origin.x - 10, origin.y + 15);
  ctx.fillText("E", canvas.width - 20, origin.y + 15);
  ctx.fillText("N", origin.x - 15, 15);

  metadata.textContent = `Site: ${values.siteLat.toFixed(4)}, ${values.siteLong.toFixed(4)} | ` +
    `Target E/N: ${values.eastings}, ${values.northings}`;
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  renderMap(readFormValues());
});

resetBtn.addEventListener("click", () => {
  Object.entries(DEFAULTS).forEach(([name, value]) => {
    form.elements[name].value = value;
  });
  renderMap(DEFAULTS);
});

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "map-overlay.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

renderMap(DEFAULTS);
