# Video Streaming Microservice Deployment on Kubernetes

## Version 2.0 Update Documentation

This update enhances the video streaming service with an HTML5 video player interface while maintaining the direct video streaming API.

---

## Update Summary

```
    A[v1: API-only] --> B[v2: HTML Player + API]
    B --> C[Static File Serving]
```

## Key Changes in v2.0

### 1. New Features

- Added HTML5 video player interface at root (`/`) endpoint
- Maintained backward compatibility with `/video` API endpoint
- Added CSS styling for the player page

### 2. Code Changes

```
// Added static file serving
app.use("/videos", express.static(path.join(__dirname, "..", "videos")));


// New HTML response
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>Video Page</title></head>
      <body>
        <h1>Hello</h1>
        <video width="720" controls>
          <source src="/videos/SampleVideo_1280x720_1mb.mp4" />
        </video>
      </body>
    </html>
  `);
});
```

### 3. File Structure Changes

```
project/
├── src/
│   └── index.js       # Updated with HTML interface
├── videos/
│   └── SampleVideo_1280x720_1mb.mp4
└── Dockerfile
```

---

## Update Procedures

### Step 1: Build and Push v2 Image

```
docker build -t masonnia/video-streaming:v2 .
docker push masonnia/video-streaming:v2
```

### Step 2: Update Kubernetes Deployment

```
kubectl set image deployment/video-streaming video-streaming=masonnia/video-streaming:v2
```

### Step 3: Verify Resources

```
kubectl rollout status deployment/video-streaming
kubectl get pods
```

---

### Test HTML Interface

```
kubectl port-forward svc/video-streaming-service 8080:80
```

Open in browser: `http://localhost:8080`

Expected:

- Page with "Hello" header
- Functional video player with controls

---

## Access Endpoints

| Endpoint | Type | Description               |
| -------- | ---- | ------------------------- |
| `/`      | HTML | Video player interface    |
| `/video` | API  | Direct video stream (MP4) |

---

### Rollback Procedure

```
kubectl rollout undo deployment/video-streaming
```

---

## Version History

| Version | Changes                     |
| ------- | --------------------------- |
| v1.0    | Basic video streaming API   |
| v2.0    | Added HTML player interface |
|         | Static file serving         |
