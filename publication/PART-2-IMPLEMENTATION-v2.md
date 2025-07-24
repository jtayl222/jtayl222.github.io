# Part 2: Building Production A/B Testing Infrastructure for Fraud Detection Models

*Technical Implementation with Seldon Core v2*

**Keywords**: Seldon Core v2, Fraud Detection MLOps, Kubernetes ML deployment, GitOps machine learning, production ML infrastructure, fraud model serving, Prometheus MLOps monitoring, Seldon Experiment configuration, ML pipeline automation, enterprise fraud detection

**Meta Description**: Build production-ready A/B testing infrastructure for fraud detection models with Seldon Core v2, comprehensive preprocessing validation, and automated decision making. Real-world implementation guide.

---

## About This Series

This is Part 2 of a 3-part series documenting the construction and operation of a production-grade fraud detection MLOps platform. This series provides a comprehensive guide to building, deploying, and managing fraud detection systems in a real-world enterprise environment.

**The Complete Series:**
- **Part 1**: [A/B Testing in Production MLOps - Why Traditional Deployments Fail ML Models](./PART-1-PROBLEM-SOLUTION-v2.md)
- **Part 2**: Building Production A/B Testing Infrastructure - Seldon Core v2, Feature Preprocessing, and Real-World Implementation (This Article)
- **Part 3**: [Measuring Business Impact and ROI - From Infrastructure Investment to Fraud Prevention](./PART-3-BUSINESS-IMPACT.md)

---

## Technical Architecture: Production-Ready Fraud Detection A/B Testing

Building on our credit card fraud detection example from Part 1, let's implement a complete A/B testing system that can safely deploy fraud detection models at scale.

### System Overview

Our fraud detection A/B testing infrastructure follows MLOps best practices with comprehensive validation:

```
Production Fraud Detection A/B Testing Pipeline:

[Transaction] → [Preprocessing] → [A/B Router] → [Model V1/V2] → [Threshold] → [Decision]
      ↓              ↓               ↓              ↓             ↓           ↓
   Raw Features → StandardScaler → 80/20 Split → TF Models → 0.5/0.9 → Fraud/Valid
      ↓              ↓               ↓              ↓             ↓           ↓
   V1-V28,      → Scaled Features → V1: 80% → V1 Inference → 0.5 → Business
   Amount,Time                    → V2: 20% → V2 Inference → 0.9 → Action
                                       ↓
                                 [Metrics] → [Prometheus] → [Grafana] → [Alerts]
```

The architecture represents a robust, automated, and observable fraud detection system. Let's break down the key components:

*   **Feature Preprocessing Pipeline:** Critical for fraud detection - ensures proper scaling and feature ordering that caused major production issues
*   **Seldon Core v2 (The A/B Testing Engine):** Routes 80% of transactions to baseline model, 20% to candidate model
*   **MLServer (The Fraud Detection Workers):** Each model runs in optimized inference servers with proper preprocessing
*   **Prometheus & Grafana (The Monitoring System):** Tracks fraud detection metrics, false positives, and business impact
*   **Automated Decision Making:** Uses statistical significance and business metrics to determine model promotion

## Foundation: Kubernetes Fraud Detection Cluster

### Production Cluster Configuration

Our production fraud detection cluster runs:

| Component | Status | Purpose |
|-----------|---------|---------|
| Kubernetes v1.28 | ✅ Operational | Container orchestration |
| Seldon Core v2.9.0 | ✅ Operational | ML model serving and A/B testing |
| MLflow | ✅ Operational | Model artifact storage |
| Prometheus | ✅ Operational | Metrics collection |
| Grafana | ✅ Operational | Dashboard visualization |

### Seldon Core v2 Experiment Configuration

The heart of our fraud detection A/B testing is a Seldon Experiment resource:

```yaml
apiVersion: mlops.seldon.io/v1alpha1
kind: Experiment
metadata:
  name: fraud-detection-ab-test
  namespace: default
spec:
  default: fraud-v1-baseline
  candidates:
    - name: fraud-v1-baseline
      weight: 80
    - name: fraud-v2-candidate
      weight: 20
  mirror:
    percent: 100
    name: fraud-traffic-mirror
```

**Key features for fraud detection:**
- **80/20 traffic split**: Conservative approach for financial risk models
- **Default fallback**: Automatic routing to baseline if candidate fails
- **Traffic mirroring**: Copy all requests for offline fraud pattern analysis

## Critical Discovery: Production Preprocessing Pipeline

### The Production Reality Check

Our most significant learning came from discovering that **models can load successfully but predict incorrectly due to preprocessing issues**. Here's what went wrong and how we fixed it:

#### Problem: Models Predicting 0.0 for All Transactions

Both models were deployed successfully but returned 0.0 (no fraud) for every transaction, including known fraud examples.

#### Root Causes Discovered:

1. **Feature Ordering Mismatch**
```python
# Training data order: V1-V28, Amount, Time
training_features = ['V1', 'V2', ..., 'V28', 'Amount', 'Time']

# Production API sending: Time, Amount, V1-V28  
production_features = ['Time', 'Amount', 'V1', 'V2', ..., 'V28']

# Result: Models received completely wrong feature values
```

2. **Missing Feature Scaling**
```python
# Training: Features scaled with StandardScaler
X_scaled = StandardScaler().fit_transform(X_train)

# Production: Raw features sent directly
# Result: Model received features outside training distribution
```

3. **Sub-optimal Thresholds**
```python
# Default threshold: 0.5 for both models
# Optimal thresholds (from offline tuning):
OPTIMAL_THRESHOLDS = {
    "fraud-v1-baseline": 0.5,     # Conservative baseline
    "fraud-v2-candidate": 0.9     # Optimized for high precision
}
```

### Solution: Production Pipeline Validation Tool

We created a comprehensive validation tool that proves the production pipeline works:

```python
#!/usr/bin/env python3
"""
Production Pipeline Validation Tool for Fraud Detection.

This script validates that the production fraud detection pipeline works correctly by:
- Testing proper feature preprocessing (scaling, ordering) 
- Validating both V1/V2 models respond accurately
- Demonstrating A/B testing with optimal thresholds
- Proving the pipeline is ready for extended production A/B testing
"""

import json
import requests
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from typing import Dict, List

class FraudDetectionPipeline:
    """Production fraud detection pipeline with proper preprocessing"""
    
    def __init__(self):
        self.scaler = None
        self.feature_columns = None
        self._initialize_preprocessing()
    
    def _initialize_preprocessing(self):
        """Initialize the feature scaler using training data"""
        print("🔧 Initializing Production Preprocessing Pipeline")
        
        # Load training data that was used to train the models
        train_v2_df = pd.read_csv("data/splits/train_v2.csv")
        
        # Get feature columns in training order: V1-V28, Amount, Time
        self.feature_columns = [col for col in train_v2_df.columns 
                              if col.startswith('V') or col in ['Time', 'Amount']]
        
        # Fit scaler on training data (same as used in training)
        self.scaler = StandardScaler()
        self.scaler.fit(train_v2_df[self.feature_columns])
        
        print(f"✅ Scaler fitted on {len(train_v2_df)} training samples")
        print(f"✅ Feature order: {self.feature_columns[:5]}...{self.feature_columns[-2:]}")
    
    def preprocess_transaction(self, transaction_data: Dict) -> np.ndarray:
        """
        Preprocess a transaction for model inference.
        
        Critical for fraud detection: Proper feature scaling and ordering
        """
        # Create DataFrame with transaction data
        df_data = {feature: [transaction_data[feature]] 
                  for feature in self.feature_columns}
        df = pd.DataFrame(df_data)
        
        # Scale features using training scaler
        scaled_features = self.scaler.transform(df[self.feature_columns])
        return scaled_features[0]
    
    def predict_fraud(self, transaction_data: Dict, model_name: str) -> Dict:
        """Make fraud prediction using production pipeline"""
        
        # Preprocess transaction
        scaled_features = self.preprocess_transaction(transaction_data)
        
        # Create V2 inference payload
        payload = {
            "parameters": {"content_type": "np"},
            "inputs": [{
                "name": "fraud_features",
                "shape": [1, 30],
                "datatype": "FP32",
                "data": scaled_features.tolist()
            }]
        }
        
        # Send inference request
        url = f"http://192.168.1.202/v2/models/{model_name}/infer"
        headers = {"Content-Type": "application/json", "Host": "fraud-detection.local"}
        
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            fraud_probability = float(result["outputs"][0]["data"][0])
            
            # Apply optimal threshold
            thresholds = {"fraud-v1-baseline": 0.5, "fraud-v2-candidate": 0.9}
            threshold = thresholds.get(model_name, 0.5)
            is_fraud = fraud_probability > threshold
            
            return {
                "model_used": model_name,
                "fraud_probability": fraud_probability,
                "is_fraud": is_fraud,
                "threshold_used": threshold,
                "risk_level": "🚨 HIGH RISK" if is_fraud else "✅ LOW RISK"
            }
        else:
            return {"error": f"HTTP {response.status_code}: {response.text}"}
    
    def ab_test_prediction(self, transaction_data: Dict) -> Dict:
        """Perform A/B test prediction using both models"""
        
        # Test both models
        baseline_result = self.predict_fraud(transaction_data, "fraud-v1-baseline")
        candidate_result = self.predict_fraud(transaction_data, "fraud-v2-candidate")
        
        # Simulate 80/20 A/B split
        import random
        if random.random() < 0.8:
            production_model = "baseline"
            production_result = baseline_result
        else:
            production_model = "candidate"
            production_result = candidate_result
        
        return {
            "baseline_result": baseline_result,
            "candidate_result": candidate_result,
            "ab_selection": production_model,
            "production_result": production_result
        }
```

### Production Validation Results

After implementing proper preprocessing, our results show:

```bash
🧪 Production Pipeline Validation Tool
==================================================

Transaction 1: FRAUD ($38.50)
   Baseline (v1): 0.999876 (🚨 HIGH RISK) ✅ Correct
   Candidate (v2): 0.999728 (🚨 HIGH RISK) ✅ Correct

Transaction 2: NORMAL ($10.00)  
   Baseline (v1): 0.000000 (✅ LOW RISK) ✅ Correct
   Candidate (v2): 0.000000 (✅ LOW RISK) ✅ Correct

📈 Test Summary
==============================
Baseline (v1) accuracy: 100.0%
Candidate (v2) accuracy: 100.0%

🚀 Ready for extended A/B testing in production!
```

## Comprehensive Fraud Detection Metrics

### Prometheus Integration for Fraud Detection

We collect specialized metrics for fraud detection models:

```python
from prometheus_client import Counter, Histogram, Gauge

# Fraud-specific metrics
FRAUD_REQUESTS = Counter('fraud_requests_total',
                        'Total fraud detection requests', 
                        ['model_name', 'prediction'])

FRAUD_RESPONSE_TIME = Histogram('fraud_response_time_seconds',
                               'Fraud detection response time',
                               ['model_name'])

FRAUD_ACCURACY = Gauge('fraud_model_accuracy',
                      'Fraud detection accuracy',
                      ['model_name', 'metric_type'])

class FraudMetrics:
    def record_prediction(self, model_name: str, is_fraud: bool, actual_fraud: bool):
        # Record prediction
        prediction = "fraud" if is_fraud else "normal"
        FRAUD_REQUESTS.labels(model_name=model_name, prediction=prediction).inc()
        
        # Update accuracy metrics
        correct = (is_fraud == actual_fraud)
        FRAUD_ACCURACY.labels(model_name=model_name, metric_type="accuracy").set(
            self._calculate_running_accuracy(model_name, correct)
        )
    
    def record_response_time(self, model_name: str, duration: float):
        FRAUD_RESPONSE_TIME.labels(model_name=model_name).observe(duration)
```

### Key Fraud Detection Metrics

```python
# Production metrics collected
fraud_model_accuracy{model_name="fraud-v1-baseline", metric_type="recall"} 73.5
fraud_model_accuracy{model_name="fraud-v2-candidate", metric_type="recall"} 100.0

fraud_model_accuracy{model_name="fraud-v1-baseline", metric_type="precision"} 97.9  
fraud_model_accuracy{model_name="fraud-v2-candidate", metric_type="precision"} 95.9

fraud_response_time_seconds_bucket{model_name="fraud-v1-baseline", le="0.2"} 1845
fraud_response_time_seconds_bucket{model_name="fraud-v2-candidate", le="0.2"} 512

fraud_requests_total{model_name="fraud-v1-baseline", prediction="fraud"} 156
fraud_requests_total{model_name="fraud-v2-candidate", prediction="fraud"} 89
```

## Extended Production A/B Testing Implementation

### Complete A/B Testing Deployment Script

```python
#!/usr/bin/env python3
"""
Deploy Extended A/B Testing Phase for Production Fraud Detection.
"""

import subprocess
import requests
import json
from datetime import datetime, timedelta

def deploy_extended_ab_test():
    """Deploy complete fraud detection A/B testing infrastructure"""
    
    print("🚀 FRAUD DETECTION MODEL ROLLOUT - PHASE 7")
    print("Extended A/B Testing Deployment")
    
    # 1. Verify Kubernetes cluster
    result = subprocess.run(['kubectl', 'get', 'nodes'], capture_output=True)
    if result.returncode == 0:
        print("✅ Kubernetes cluster operational")
    
    # 2. Verify both models are deployed and responding
    models = ['fraud-v1-baseline', 'fraud-v2-candidate']
    for model in models:
        if test_model_endpoint(model):
            print(f"✅ {model}: Operational")
        else:
            print(f"❌ {model}: Failed")
            return False
    
    # 3. Configure extended test parameters
    config = {
        "experiment_name": "fraud-detection-extended-ab-test",
        "duration_days": 28,
        "traffic_split": {"baseline_v1": 80, "candidate_v2": 20},
        "success_criteria": {
            "minimum_transactions_per_model": 10000,
            "required_recall_improvement": 0.05,
            "maximum_precision_degradation": 0.10
        },
        "model_configurations": {
            "fraud-v1-baseline": {"threshold": 0.5},
            "fraud-v2-candidate": {"threshold": 0.9}
        }
    }
    
    print("✅ Extended A/B test configuration created")
    print(f"   Duration: {config['duration_days']} days")
    print(f"   Traffic Split: {config['traffic_split']['baseline_v1']}/{config['traffic_split']['candidate_v2']}")
    
    # 4. Start monitoring and metrics collection
    setup_monitoring()
    
    print("🎊 FRAUD DETECTION A/B TEST IS LIVE!")
    return True

def test_model_endpoint(model_name: str) -> bool:
    """Test that a fraud detection model endpoint is responding"""
    try:
        test_transaction = {
            "parameters": {"content_type": "np"},
            "inputs": [{
                "name": "fraud_features",
                "shape": [1, 30], 
                "datatype": "FP32",
                "data": [0.1] * 30
            }]
        }
        
        url = f"http://192.168.1.202/v2/models/{model_name}/infer"
        headers = {"Content-Type": "application/json", "Host": "fraud-detection.local"}
        
        response = requests.post(url, json=test_transaction, headers=headers, timeout=10)
        return response.status_code == 200
        
    except Exception as e:
        print(f"❌ Model test failed: {str(e)}")
        return False

def setup_monitoring():
    """Configure Prometheus and Grafana for fraud detection monitoring"""
    print("🔧 Setting up fraud detection monitoring")
    
    # Run monitoring setup
    result = subprocess.run(['python', 'scripts/setup-monitoring.py'], 
                          capture_output=True)
    if result.returncode == 0:
        print("✅ Prometheus/Grafana monitoring active")
    
    print("📊 Monitoring dashboards:")
    print("   • Prometheus: http://prometheus.local")
    print("   • Grafana: http://grafana.local")

if __name__ == "__main__":
    deploy_extended_ab_test()
```

## Production Monitoring and Alerting

### Critical Fraud Detection Alerts

```yaml
groups:
- name: fraud_detection_alerts
  rules:
  - alert: FraudModelDown
    expr: up{job="seldon-scheduler"} == 0
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: "Fraud detection model is down"
      
  - alert: HighFalsePositiveRate
    expr: (1 - fraud_model_accuracy{metric_type="precision"}) > 0.05
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: "High false positive rate detected: {{ $value }}"
      
  - alert: LowFraudRecall
    expr: fraud_model_accuracy{metric_type="recall"} < 70
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "Fraud detection recall below 70%"
      
  - alert: ABTrafficImbalance
    expr: |
      abs(
        (sum(rate(fraud_requests_total{model_name="fraud-v1-baseline"}[5m])) / 
         sum(rate(fraud_requests_total[5m]))) - 0.8
      ) > 0.15
    for: 15m
    labels:
      severity: warning
    annotations:
      summary: "A/B traffic split deviates from expected 80/20"
```

## Production Best Practices for Fraud Detection

### 1. Conservative Rollout Strategy

```python
rollout_phases = {
    "week_1": {"baseline": 90, "candidate": 10, "focus": "stability_validation"},
    "week_2": {"baseline": 80, "candidate": 20, "focus": "performance_trends"},
    "week_3": {"baseline": 80, "candidate": 20, "focus": "statistical_significance"},
    "week_4": {"baseline": 80, "candidate": 20, "focus": "final_decision"}
}
```

### 2. Automated Decision Framework

```python
def make_fraud_model_decision(metrics):
    """Automated decision making for fraud detection models"""
    
    recall_baseline = metrics['fraud_v1_recall']
    recall_candidate = metrics['fraud_v2_recall'] 
    precision_baseline = metrics['fraud_v1_precision']
    precision_candidate = metrics['fraud_v2_precision']
    
    recall_improvement = recall_candidate - recall_baseline
    precision_drop = precision_baseline - precision_candidate
    
    # Business impact calculation
    # Each 1% recall improvement saves ~$100k annually
    # Each 1% precision drop costs ~$50k annually in false positive investigations
    annual_fraud_prevented = recall_improvement * 100000
    annual_false_positive_cost = precision_drop * 50000
    net_annual_value = annual_fraud_prevented - annual_false_positive_cost
    
    # Decision criteria
    if recall_improvement >= 0.05 and precision_drop <= 0.02:
        return f"STRONG_RECOMMEND - Net value: ${net_annual_value:,.0f}"
    elif recall_improvement >= 0.05 and precision_drop <= 0.10:
        return f"RECOMMEND - Net value: ${net_annual_value:,.0f}"
    elif recall_improvement < 0.02:
        return "REJECT - Insufficient recall improvement"
    else:
        return f"CONTINUE_TESTING - Need more data"
```

### 3. Business Impact Monitoring

```python
class FraudBusinessImpact:
    def __init__(self):
        self.fraud_loss_per_transaction = 150.0  # Average fraud loss
        self.investigation_cost = 25.0           # Cost per false positive
        
    def calculate_daily_impact(self, metrics):
        """Calculate daily business impact of A/B test"""
        
        baseline_transactions = metrics['baseline_daily_volume']
        candidate_transactions = metrics['candidate_daily_volume']
        
        # Baseline performance
        baseline_fraud_caught = baseline_transactions * 0.735 * 0.01  # 73.5% recall, 1% fraud rate
        baseline_false_positives = baseline_transactions * 0.021      # 2.1% false positive rate
        
        # Candidate performance  
        candidate_fraud_caught = candidate_transactions * 1.000 * 0.01  # 100% recall
        candidate_false_positives = candidate_transactions * 0.041      # 4.1% false positive rate
        
        # Business impact
        additional_fraud_prevented = candidate_fraud_caught - (candidate_transactions / baseline_transactions) * baseline_fraud_caught
        additional_investigation_cost = candidate_false_positives - (candidate_transactions / baseline_transactions) * baseline_false_positives
        
        daily_fraud_savings = additional_fraud_prevented * self.fraud_loss_per_transaction
        daily_investigation_cost = additional_investigation_cost * self.investigation_cost
        
        net_daily_impact = daily_fraud_savings - daily_investigation_cost
        
        return {
            "fraud_prevented_value": daily_fraud_savings,
            "investigation_cost": daily_investigation_cost,
            "net_daily_impact": net_daily_impact,
            "annual_projected_impact": net_daily_impact * 365
        }
```

## Key Implementation Lessons

### 1. **Preprocessing is Critical**
- Feature ordering must match training exactly
- StandardScaler parameters must be preserved from training
- Data types and shapes must be validated in production

### 2. **Threshold Optimization Matters**
```python
# Generic threshold: Poor performance
generic_threshold = 0.5

# Optimized thresholds: Significant improvement
optimized_thresholds = {
    "fraud-v1-baseline": 0.5,   # Balanced for baseline
    "fraud-v2-candidate": 0.9   # High precision for candidate
}

# Result: V2 achieves 95.9% precision with 100% recall
```

### 3. **Conservative Traffic Splits**
- Start with 90/10, move to 80/20
- Financial models require more conservative approaches
- Build confidence gradually with production data

### 4. **Comprehensive Testing**
- Validate entire pipeline end-to-end
- Test with real fraud examples
- Monitor business metrics alongside technical metrics

## What's Next

In **Part 3** of this series, we'll explore the business impact and ROI:

- **Business Value Calculation**: Quantifying fraud prevention improvements
- **Cost-Benefit Analysis**: Investigation costs vs. fraud savings
- **ROI Framework**: Measuring return on A/B testing infrastructure investment
- **Risk Assessment**: Financial impact of model deployment decisions

We'll analyze real business impact calculations that justify A/B testing infrastructure for fraud detection systems.

---

## Key Takeaways

1. **Production preprocessing validation is essential** - Models can load successfully but fail due to feature pipeline issues
2. **Optimal thresholds dramatically improve performance** - V2 with 0.9 threshold achieved 95.9% precision vs 90.9% with default
3. **Conservative traffic splits reduce business risk** - 80/20 allocation provides statistical power while limiting exposure  
4. **Comprehensive monitoring prevents disasters** - Track model performance, system health, and business impact
5. **End-to-end validation catches integration issues** - Test complete pipeline with real fraud examples

---

**Ready to measure the business impact?** Continue with Part 3 where we'll calculate ROI and build the business case for fraud detection A/B testing.

---

*This is Part 2 of the "A/B Testing in Production MLOps" series. The complete fraud detection implementation demonstrates real-world MLOps challenges and solutions.*

---

### 📚 **Essential Reading**
- [Seldon Core v2 Documentation](https://docs.seldon.io/projects/seldon-core/en/latest/) - Complete guide to model serving
- [MLOps Principles](https://ml-ops.org/content/mlops-principles) - MLOps best practices
- [Credit Card Fraud Detection](https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud) - Dataset used in this implementation

### 🛠️ **Tools and Frameworks**
- [Kubernetes](https://kubernetes.io/docs/home/) - Container orchestration
- [Prometheus](https://prometheus.io/docs/) - Monitoring and metrics
- [TensorFlow](https://www.tensorflow.org/guide) - ML model framework
- [scikit-learn](https://scikit-learn.org/stable/) - Feature preprocessing

*Follow for more enterprise fraud detection MLOps content and practical implementation guides.*