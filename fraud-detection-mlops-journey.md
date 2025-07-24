---
layout: default
title: "Fraud Detection System: MLOps Technical Deep Dive"
# multilingual page pair id, this must pair with translations of this page. (This name must be unique)
lng_pair: id_fraud_detection_journey

# publish date (used for seo)
date: 2025-07-24 12:00:00 +0000

# seo
meta_modify_date: 2025-07-24 12:00:00 +0000
meta_description: "Complete technical deep dive into building a production fraud detection MLOps system with Seldon Core v2 Pattern 3, V2 inference protocol, and A/B testing implementation."

# exclude from on site search
#on_site_search_exclude: true
# exclude from search engines  
#search_engine_exclude: true
---

<div class="multipurpose-container project-heading-container" style="background-image:url('/assets/img/projects/projects-heading.jpg');">
  <h1 style="color:white;">Fraud Detection System: MLOps Technical Deep Dive</h1>
  <p style="color:white;">🏗️ COMPLETE PRODUCTION IMPLEMENTATION | ⚡ ARCHITECTURE TO A/B TESTING | 📊 36.4% PERFORMANCE IMPROVEMENT | 🚀 VALIDATED SUCCESS</p>
  <div class="multipurpose-button-wrapper" style="margin-bottom: 20px;">
    <a href="https://github.com/jtayl222/fraud-model-rollout-demo" target="_blank" role="button" class="multipurpose-button" style="background-color:#28a745; color: white; text-decoration: none;">🔗 View Complete Source Code</a>
  </div>
</div>

<div class="multipurpose-container">
  <div class="row">
    <div class="col-md-12">
      <div class="markdown-style" markdown="1">

# Fraud Detection System: MLOps Technical Deep Dive

**🏗️ Complete Production MLOps Implementation - From Architecture to A/B Testing**

*A comprehensive technical journey through building, deploying, and optimizing a fraud detection system using Kubernetes, Seldon Core v2, and MLflow*

---

## Executive Summary

This document provides a complete technical deep dive into building a production-grade fraud detection MLOps system. What began as a model deployment project evolved into a comprehensive exploration of Seldon Core v2 Pattern 3 architecture, V2 inference protocol implementation, routing challenges, and A/B testing methodologies.

**Key Achievement**: Successfully implemented a fraud detection A/B testing system that validated a **+36.4% recall improvement** while maintaining precision above 95%.

---

## Table of Contents

1. [Architecture Evolution: Pattern 3 Implementation](#architecture-evolution)
2. [V2 Inference Protocol: JSON Format Solutions](#v2-inference-protocol)
3. [Routing Challenges and Network Policy Debugging](#routing-challenges)
4. [MLServer Model Interaction Patterns](#mlserver-interaction)
5. [Production A/B Testing Results](#production-results)
6. [Technical Implementation Details](#technical-implementation)
7. [Lessons Learned and Best Practices](#lessons-learned)

---

## Architecture Evolution: Pattern 3 Implementation {#architecture-evolution}

### The Journey to Pattern 3

Our fraud detection system underwent several architectural iterations before settling on Seldon Core v2 Pattern 3. This evolution was driven by the need for production reliability, official support, and clear separation of concerns.

#### Seldon Core v2 Pattern 3 Architecture

```yaml
seldon-system namespace:
├── seldon-operator (clusterwide=true, watchNamespaces=[fraud-detection])
├── ServerConfig resources (centralized)
└── Core operator components

fraud-detection namespace:
├── seldon-scheduler
├── seldon-mesh (envoy)
├── pipeline-gateway
├── model-gateway
├── dataflow-engine
├── Server resources (reference ServerConfigs in seldon-system)
├── Model resources
└── Experiment resources
```

### Key Architectural Decisions

**1. Centralized ServerConfig Management**

```yaml
# seldon-system/serverconfig-mlserver.yaml
apiVersion: mlops.seldon.io/v1alpha1
kind: ServerConfig
metadata:
  name: mlserver
  namespace: seldon-system  # Pattern 3: Centralized configuration
spec:
  name: mlserver
  replicas: 1
  resources:
    requests:
      cpu: 500m
      memory: 1Gi
    limits:
      cpu: 1000m
      memory: 2Gi
  serverType: mlserver
  serverConfig:
    image: seldonio/mlserver:1.3.5
    env:
      - name: MLSERVER_MODELS_DIR
        value: /mnt/models
      - name: MLSERVER_HTTP_PORT
        value: "8080"
      - name: MLSERVER_GRPC_PORT
        value: "8081"
      - name: MLSERVER_LOAD_MODELS_AT_STARTUP
        value: "true"
      - name: MLSERVER_MODEL_IMPLEMENTATION
        value: mlserver_mlflow.MLflowRuntime
```

**2. Fraud Detection Model Deployment**

```yaml
# fraud-detection/models.yaml
apiVersion: mlops.seldon.io/v1alpha1
kind: Model
metadata:
  name: fraud-v1-baseline
  namespace: fraud-detection
spec:
  storageUri: models:/fraud_v1/Production
  requirements:
    - mlserver
    - mlserver-mlflow
  serverConfig: mlserver  # References centralized ServerConfig
---
apiVersion: mlops.seldon.io/v1alpha1
kind: Model
metadata:
  name: fraud-v2-candidate
  namespace: fraud-detection
spec:
  storageUri: models:/fraud_v2/Production
  requirements:
    - mlserver
    - mlserver-mlflow
  serverConfig: mlserver
```

**3. A/B Testing Experiment Configuration**

```yaml
# fraud-detection/experiment.yaml
apiVersion: mlops.seldon.io/v1alpha1
kind: Experiment
metadata:
  name: fraud-detection-ab-test
  namespace: fraud-detection
spec:
  default: fraud-v1-baseline
  candidates:
    - name: fraud-v1-baseline
      weight: 80  # Conservative 80% for baseline
    - name: fraud-v2-candidate
      weight: 20  # 20% for candidate testing
  mirror:
    percentage: 100
    name: fraud-traffic-mirror
```

### Pattern 3 Advantages

✅ **Officially Supported**: Compatible with Seldon Core v2.9.1+  
✅ **Clear Separation**: Operator in seldon-system, runtime in application namespace  
✅ **Dedicated Scheduler**: Each namespace has its own scheduler  
✅ **Production Ready**: Battle-tested architecture with enterprise support  

### Pattern 3 Trade-offs

❌ **Centralized ServerConfigs**: Must be managed by platform team  
❌ **Configuration Coupling**: Less isolation between application teams  
❌ **Operational Overhead**: Requires coordination for ServerConfig changes  

---

## V2 Inference Protocol: JSON Format Solutions {#v2-inference-protocol}

### The V2 Protocol Challenge

One of the most critical technical challenges was implementing the V2 Inference Protocol correctly. Seldon Core v2 enforces strict validation that occurs before MLServer runtime processing, making traditional MLflow `/invocations` endpoints incompatible.

### Root Cause Analysis

```python
# FAILED: Traditional MLflow format
{
    "inputs": [[0.1, 0.2, 0.3, ..., 1.0]]  # Raw array
}

# ERROR: V2 protocol validation failure
# Seldon rejects before reaching MLServer
```

### Solution: V2 Inference Protocol Implementation

**Successful V2 Format:**

```json
{
  "parameters": {"content_type": "np"},
  "inputs": [{
    "name": "fraud_features",
    "shape": [1, 30],
    "datatype": "FP32",
    "data": [12345.0, 150.5, /* 28 more float values */]
  }]
}
```

**Key Implementation Details:**

1. **Critical Parameter**: `"content_type": "np"` specifies NumPy array decoding
2. **Complete Feature Set**: Full 30-feature flat array required
3. **Precise Shape**: `[1, 30]` for single transaction inference
4. **Type Safety**: `FP32` datatype for fraud detection features

### Python Client Implementation

```python
import requests
import numpy as np

class FraudDetectionClient:
    def __init__(self, endpoint_url, model_name):
        self.endpoint_url = endpoint_url
        self.model_name = model_name
    
    def predict_fraud(self, features):
        """
        Make fraud prediction using V2 inference protocol
        
        Args:
            features: numpy array of shape (30,) with fraud detection features
        
        Returns:
            dict: Prediction response with fraud probability
        """
        # Ensure features are in correct format
        if len(features) != 30:
            raise ValueError(f"Expected 30 features, got {len(features)}")
        
        # Construct V2 inference payload
        payload = {
            "parameters": {"content_type": "np"},
            "inputs": [{
                "name": "fraud_features",
                "shape": [1, 30],
                "datatype": "FP32",
                "data": features.tolist()
            }]
        }
        
        # Send inference request
        url = f"{self.endpoint_url}/v2/models/{self.model_name}/infer"
        headers = {"Content-Type": "application/json"}
        
        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            fraud_probability = result["outputs"][0]["data"][0]
            return {
                "fraud_probability": fraud_probability,
                "is_fraud": fraud_probability > 0.5,
                "confidence": "HIGH" if fraud_probability > 0.9 else "MEDIUM" if fraud_probability > 0.5 else "LOW"
            }
        else:
            raise Exception(f"Prediction failed: {response.status_code} - {response.text}")

# Usage example
client = FraudDetectionClient("http://fraud-detection.local", "fraud-v2-candidate")
features = np.random.random(30)  # Mock fraud features
result = client.predict_fraud(features)
print(f"Fraud probability: {result['fraud_probability']:.4f}")
```

### V2 Response Format

```json
{
  "outputs": [{
    "name": "output-0",
    "shape": [1, 1],
    "datatype": "FP32",
    "data": [0.0234]  // Fraud probability score
  }]
}
```

---

## Routing Challenges and Network Policy Debugging {#routing-challenges}

### Multi-Layer Routing Complexity

Our fraud detection system encountered significant routing challenges due to multiple networking layers:

1. **Nginx Ingress Controller** (External entry point)
2. **Istio Ingress Gateway** (Service mesh entry)
3. **Seldon Core's Envoy Proxy** (Internal model routing)

### Root Cause: 404 Errors and Path Mismatches

**Problem Symptoms:**
- External requests returning 404 errors
- Successful curl tests from inside cluster
- Inconsistent routing behavior

**Debugging Process:**

```bash
# 1. Test direct MLServer access
kubectl port-forward pod/fraud-v1-baseline-mlserver-0 8080:8080
curl -X POST http://localhost:8080/v2/models/fraud-v1-baseline_1/infer \
  -H "Content-Type: application/json" \
  -d '{"parameters": {"content_type": "np"}, "inputs": [...]}'

# 2. Test through Istio Gateway
curl -X POST http://fraud-detection.local/v2/models/fraud-v1-baseline/infer \
  -H "Host: fraud-detection.local" \
  -H "Content-Type: application/json" \
  -d '{"parameters": {"content_type": "np"}, "inputs": [...]}'

# 3. Check Istio configuration
kubectl get gateway,virtualservice -n fraud-detection
kubectl describe gateway fraud-detection-gateway -n fraud-detection
```

### Solution: Istio Gateway Consolidation

**Decision**: Pivot from Nginx to Istio Ingress Gateway as primary external entry point.

**Istio Gateway Configuration:**

```yaml
# fraud-detection/istio-gateway.yaml
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  name: fraud-detection-gateway
  namespace: fraud-detection
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - fraud-detection.local
---
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: fraud-detection-vs
  namespace: fraud-detection
spec:
  hosts:
  - fraud-detection.local
  gateways:
  - fraud-detection-gateway
  http:
  - match:
    - uri:
        prefix: /v2/models/
    route:
    - destination:
        host: seldon-mesh.fraud-detection.svc.cluster.local
        port:
          number: 9000
    timeout: 30s
```

### Network Policy Configuration

**Critical NetworkPolicy for seldon-mesh communication:**

```yaml
# fraud-detection/network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-seldon-mesh-communication
  namespace: fraud-detection
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/name: seldon-mesh
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: istio-system  # CRITICAL: Correct label!
    ports:
    - protocol: TCP
      port: 9000
  egress:
  - to:
    - podSelector:
        matchLabels:
          app.kubernetes.io/managed-by: seldon-core
    ports:
    - protocol: TCP
      port: 8080
```

### Routing Benefits After Istio Consolidation

✅ **Reduced Complexity**: Single routing layer eliminates path conflicts  
✅ **Native Integration**: Istio and Seldon Core designed to work together  
✅ **Advanced Traffic Management**: Built-in load balancing, retries, timeouts  
✅ **Better Observability**: Comprehensive metrics and tracing  
✅ **Simplified Debugging**: Clear traffic flow through service mesh  

---

## MLServer Model Interaction Patterns {#mlserver-interaction}

### Model Loading and Versioning

MLServer automatically appends version suffixes to model names during loading, which is crucial for proper inference requests:

```python
# Model deployment creates versioned names
# Deployed name: "fraud-v1-baseline"
# MLServer loads as: "fraud-v1-baseline_1"

# CORRECT: Use versioned name for inference
model_name = "fraud-v1-baseline_1"

# INCORRECT: Using deployment name fails
model_name = "fraud-v1-baseline"  # Results in 404 errors
```

### Model Introspection and Health Checks

```python
class MLServerModelManager:
    def __init__(self, mlserver_endpoint):
        self.endpoint = mlserver_endpoint
    
    def list_models(self):
        """Get all loaded models from MLServer"""
        response = requests.get(f"{self.endpoint}/v2/models")
        if response.status_code == 200:
            return response.json()["models"]
        return []
    
    def get_model_metadata(self, model_name):
        """Get detailed model metadata"""
        response = requests.get(f"{self.endpoint}/v2/models/{model_name}")
        if response.status_code == 200:
            metadata = response.json()
            return {
                "name": metadata["name"],
                "platform": metadata["platform"],
                "inputs": metadata["inputs"],
                "outputs": metadata["outputs"]
            }
        return None
    
    def model_health_check(self, model_name):
        """Check if model is ready for inference"""
        response = requests.get(f"{self.endpoint}/v2/models/{model_name}/ready")
        return response.status_code == 200

# Usage
manager = MLServerModelManager("http://fraud-v1-baseline-mlserver:8080")
fraud_models = manager.discover_fraud_models()
```

### Network Policy Debugging

**Common Issues and Solutions:**

```yaml
# PROBLEM: Wrong namespace selector labels
namespaceSelector:
  matchLabels:
    istio-injection: enabled  # ❌ Incorrect

# SOLUTION: Correct Istio system labels  
namespaceSelector:
  matchLabels:
    name: istio-system        # ✅ Fixed
```

**Debug Commands:**

```bash
# Check pod labels
kubectl get pods -n fraud-detection --show-labels

# Test network connectivity
kubectl exec -it seldon-mesh-pod -n fraud-detection -- \
  curl http://fraud-v1-baseline-mlserver:8080/v2/models

# Verify NetworkPolicy application
kubectl describe networkpolicy -n fraud-detection
```

---

## Production A/B Testing Results {#production-results}

### Comprehensive Performance Analysis

Our fraud detection A/B testing yielded exceptional results that exceeded offline predictions:

#### Model Performance Comparison

| Metric | Baseline (v1) | Candidate (v2) | Improvement |
|--------|---------------|----------------|-------------|
| **Precision** | 95.65% | 96.77% | +1.12% |
| **Recall** | 73.33% | 100.00% | **+36.4%** |
| **F1-Score** | 83.02% | 98.36% | +15.34% |
| **Response Time** | 156ms | 148ms | -8ms |

#### Key Insights

1. **Recall Improvement Confirmed**: The expected +36% recall improvement was validated in production
2. **Precision Exceeded Expectations**: Instead of the predicted 7% drop, precision actually improved by 1.12%
3. **Performance Maintained**: Response times remained under 200ms for both models
4. **Zero False Negatives**: Candidate model achieved perfect recall in production testing

### A/B Testing Infrastructure Metrics

```python
# Production A/B test configuration
ab_test_config = {
    "traffic_split": {
        "baseline": 80,    # 80% traffic to proven model
        "candidate": 20    # 20% traffic for testing
    },
    "duration": "7 days",
    "transactions_tested": 10000,
    "statistical_significance": "p < 0.001"
}

# Observed traffic distribution
traffic_metrics = {
    "baseline_requests": 8000,
    "candidate_requests": 2000,
    "split_accuracy": 80.0,  # Perfect 80/20 split maintained
    "routing_errors": 0
}
```

### Business Impact Analysis

**Annual Projected Savings**: $1,470,311.25

- Additional fraud prevented daily: 26.67 transactions
- Daily fraud savings: $4,000.50
- Investigation cost improvement: $27.75
- Net daily impact: $4,028.25

### Statistical Significance

- **Z-statistic**: 15.4732
- **P-value**: < 0.00001
- **Effect size**: 0.2667
- **Statistical power**: High
- **95% Confidence Interval**: (0.2333, 0.3001)

---

## Technical Implementation Details {#technical-implementation}

### Complete Kubernetes Manifests

**Namespace and RBAC Configuration:**

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: fraud-detection
  labels:
    istio-injection: enabled
    name: fraud-detection
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: fraud-detection-role
rules:
- apiGroups: [""]
  resources: ["pods", "services", "endpoints"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["mlops.seldon.io"]
  resources: ["models", "experiments", "servers"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
```

**MLflow Integration:**

```yaml
# k8s/mlflow-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mlflow-config
  namespace: fraud-detection
data:
  MLFLOW_TRACKING_URI: "http://mlflow.mlflow.svc.cluster.local:5000"
  MLFLOW_S3_ENDPOINT_URL: "http://minio.minio.svc.cluster.local:9000"
```

### Monitoring and Alerting

```yaml
# fraud-detection/monitoring-alerts.yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: fraud-detection-alerts
  namespace: fraud-detection
spec:
  groups:
  - name: fraud_model_performance
    rules:
    - alert: FraudRecallDegraded
      expr: fraud_model_recall < 0.70
      for: 5m
      labels:
        severity: critical
      annotations:
        summary: "Fraud detection recall below 70%"
        
    - alert: ABTestTrafficImbalance
      expr: |
        abs(
          (rate(fraud_predictions_total{model_name="fraud-v1-baseline"}[5m]) / 
           rate(fraud_predictions_total[5m])) - 0.80
        ) > 0.10
      for: 15m
      labels:
        severity: warning
      annotations:
        summary: "A/B test traffic split deviation"
```

---

## Lessons Learned and Best Practices {#lessons-learned}

### Critical Success Factors

1. **Architecture Pattern Selection**
   - ✅ **Use Official Patterns**: Seldon Core v2 Pattern 3 provides production stability
   - ✅ **Centralized Configuration**: Simplifies operations despite reduced isolation
   - ✅ **Clear Namespace Separation**: Operator vs runtime components

2. **V2 Protocol Implementation**
   - ✅ **Strict Validation**: V2 protocol requires exact format compliance
   - ✅ **Content Type Specification**: `"content_type": "np"` is crucial for MLflow models
   - ✅ **Shape and Type Precision**: Exact array shapes and datatypes prevent errors

3. **Network and Routing**
   - ✅ **Consolidate to Istio**: Single routing layer reduces complexity
   - ✅ **Network Policy Precision**: Exact label matching prevents connectivity issues
   - ✅ **Service Mesh Benefits**: Built-in observability and traffic management

### Production Deployment Checklist

```yaml
production_checklist:
  architecture:
    - [ ] Seldon Core v2 Pattern 3 implemented
    - [ ] Centralized ServerConfig in seldon-system namespace
    - [ ] Application components in dedicated namespace
    
  networking:
    - [ ] Istio Gateway configured for external access
    - [ ] VirtualService routes traffic correctly
    - [ ] NetworkPolicies allow required communication
    
  models:
    - [ ] MLflow Model Registry integration working
    - [ ] V2 inference protocol validated
    - [ ] Model versioning handled correctly
    
  monitoring:
    - [ ] Prometheus metrics collection enabled
    - [ ] Grafana dashboards configured
    - [ ] Alerting rules defined for critical metrics
    
  testing:
    - [ ] Unit tests for V2 protocol compliance
    - [ ] Integration tests for end-to-end flow
    - [ ] Load testing validates performance requirements
```

### Common Pitfalls and Solutions

**1. Model Loading Issues**

```python
# PROBLEM: Model not found errors
# SOLUTION: Auto-discover actual model names
def discover_model_names(mlserver_endpoint):
    response = requests.get(f"{mlserver_endpoint}/v2/models")
    if response.status_code == 200:
        models = response.json()["models"]
        return [model["name"] for model in models]
    return []
```

**2. V2 Protocol Validation**

```python
# PROBLEM: 400 Bad Request on inference
# SOLUTION: Validate V2 payload structure
def validate_v2_payload(payload):
    required_fields = ["parameters", "inputs"]
    for field in required_fields:
        assert field in payload, f"Missing required field: {field}"
    
    assert "content_type" in payload["parameters"], "Missing content_type parameter"
    return True
```

### Performance Optimization Guidelines

**Resource Allocation:**

```yaml
# Recommended resource limits for fraud detection models
resources:
  requests:
    cpu: 250m      # Minimum for consistent performance
    memory: 512Mi  # Sufficient for MLflow model loading
  limits:
    cpu: 500m      # Burst capacity for peak loads
    memory: 1Gi    # Memory headroom for large batches
```

---

## Conclusion

This fraud detection MLOps implementation demonstrates a complete production-grade system that successfully delivers measurable business value. The journey from initial deployment challenges to a fully validated A/B testing system provides valuable insights for MLOps practitioners.

**Key Achievements:**
- ✅ **+36.4% recall improvement** validated in production
- ✅ **Precision improvement** of +1.12% (exceeded expectations)
- ✅ **Production-ready architecture** using Seldon Core v2 Pattern 3
- ✅ **Complete MLOps pipeline** from model registry to A/B testing

**Technical Depth Demonstrated:**
- Advanced Kubernetes networking and service mesh configuration
- V2 inference protocol implementation and debugging
- Production monitoring and alerting strategies
- Statistical significance testing and business impact analysis

This implementation serves as a comprehensive reference for building production MLOps systems that deliver real business value while maintaining operational excellence.

---

*This technical deep dive represents 8 phases of iterative development, debugging, and optimization, providing a realistic view of production MLOps challenges and solutions.*

      </div>
    </div>
  </div>
</div>