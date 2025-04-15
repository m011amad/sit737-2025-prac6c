const express = require("express");
const fs = require("fs");
const path = require("path");

if (!process.env.PORT) {
  throw new Error(
    "Please specify the port number for the HTTP server with the environment variable PORT."
  );
}

const PORT = process.env.PORT || 8081;
const app = express();

// Serve static videos from the "videos" folder
app.use("/videos", express.static(path.join(__dirname, "..", "videos")));

// Serve HTML page with the header and video player
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Video Page</title>
        <style>
          body {
            font-family: Arial;
            text-align: center;
            background-color: #000;
            margin: 0;
            padding: 40px;
          }
          h1 {
            color: white;
          }
        </style>
      </head>
      <body>
        <h1>Hello</h1>
        <video width="720" controls>
          <source src="/videos/SampleVideo_1280x720_1mb.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </body>
    </html>
  `);
});

// Optional: this route streams the video directly (used if needed separately)
app.get("/video", async (req, res) => {
  const videoPath = "./videos/SampleVideo_1280x720_1mb.mp4";
  const stats = await fs.promises.stat(videoPath);

  res.writeHead(200, {
    "Content-Length": stats.size,
    "Content-Type": "video/mp4",
  });

  fs.createReadStream(videoPath).pipe(res);
});

app.listen(PORT, () => {
  console.log(`Microservice online on port ${PORT}`);
});
