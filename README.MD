# Video Streaming Microservice Deployment on Kubernetes

This project demonstrates the deployment of a Node.js video streaming microservice to a Kubernetes cluster, covering containerization, cluster setup, deployment, and service exposure.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Step 1: Kubernetes Cluster Setup](#step-1-kubernetes-cluster-setup)
- [Step 2: Docker Image Creation](#step-2-docker-image-creation)
- [Step 3: Kubernetes Deployment](#step-3-kubernetes-deployment)
- [Step 4: Kubernetes Service](#step-4-kubernetes-service)
- [Accessing the Application](#accessing-the-application)
- [Verification and Testing](#verification-and-testing)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Minikube installed ([installation guide](https://minikube.sigs.k8s.io/docs/start/))
- Docker installed
- kubectl configured
- Node.js environment

## Step 1: Kubernetes Cluster Setup

1. Start Minikube cluster:

   minikube start

2. Verify cluster status:

   minikube status
   kubectl cluster-info

## Step 2: Docker Image Creation

1. Build the Docker image:

   docker build -t masonnia/video-streaming:latest .

2. Push to Docker Hub (optional for remote clusters):

   docker push (docker login name)/video-streaming:latest

## Step 3: Kubernetes Deployment

1. Create `deployment.yaml`:
   yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
   name: video-streaming
   spec:
   replicas: 1
   selector:
   matchLabels:
   app: video-streaming
   template:
   metadata:
   labels:
   app: video-streaming
   spec:
   containers: - name: video-streaming
   image: (docker login name)/video-streaming:latest
   ports: - containerPort: 80
   env: - name: PORT
   value: "80"
   readinessProbe:
   httpGet:
   path: /
   port: 80
   initialDelaySeconds: 5
   periodSeconds: 5

2. Apply the deployment:

   kubectl apply -f deployment.yaml

## Step 4: Kubernetes Service

1. Create `service.yaml`:

   apiVersion: v1
   kind: Service
   metadata:
   name: video-streaming-service
   spec:
   type: NodePort
   selector:
   app: video-streaming
   ports: - protocol: TCP
   port: 80
   targetPort: 80

2. Apply the service:

   kubectl apply -f service.yaml

## Accessing the Application

### Web Browser Access

1. Get the service URL:

   minikube service video-streaming-service --url

   Example: `http://192.168.49.2:30080`

2. Access endpoints:
   - Health check: `/` (returns "OK")
   - Video stream: `/video`

### Command Line Access

1. Port forwarding:

   kubectl port-forward svc/video-streaming-service 8080:80

   Access via `http://localhost:8080`

2. Test with curl:

   curl http://$(minikube service video-streaming-service --url)/
   curl http://$(minikube service video-streaming-service --url)/video --output video.mp4

## Verification and Testing

1. Verify deployment status:

   kubectl get all -l app=video-streaming

2. Check pod health:

   kubectl get pods

3. View application logs:

   kubectl logs <pod-name>

## Troubleshooting

### Common Issues

1. **ImagePullBackOff**:

   - Verify image name in deployment.yaml
   - Check Docker Hub credentials if using private repo

2. **Readiness Probe Failing**:

   - Check application logs for errors
   - Verify the `/` endpoint returns HTTP 200
   - Increase `initialDelaySeconds` if app starts slowly

3. **Service Not Accessible**:
   - Verify service type is NodePort/LoadBalancer
   - Check Minikube tunnel is running (for LoadBalancer)

### Diagnostic Commands

kubectl describe pod <pod-name>
kubectl describe service video-streaming-service
minikube logs
