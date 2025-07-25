# Part 2: Building Production A/B Testing Infrastructure for ML Models

*Technical Implementation with Seldon Core v2*

**Keywords**: Seldon Core v2, MLOps A/B testing, Kubernetes ML deployment, GitOps machine learning, production ML infrastructure, ML model serving, Prometheus MLOps monitoring, Seldon Experiment configuration, ML pipeline automation, enterprise MLOps

**Meta Description**: Build production-ready A/B testing infrastructure for ML models with Seldon Core v2, GitOps automation, and comprehensive monitoring. Real-world implementation guide.

---

## About This Series

This is Part 2 of a 9-part series documenting the construction and operation of a production-grade MLOps platform. This series provides a comprehensive guide to building, deploying, and managing machine learning systems in a real-world enterprise environment.

**The Complete Series:**
- **Part 1**: [A/B Testing in Production MLOps - Why Traditional Deployments Fail ML Models](./PART-1-PROBLEM-SOLUTION.md)
- **Part 2**: Building Production A/B Testing Infrastructure - Seldon Core v2, GitOps, and Real-World Implementation (This Article)
- **Part 3**: [Measuring Business Impact and ROI - From Infrastructure Investment to Revenue Growth](./PART-3-BUSINESS-IMPACT.md)
- **Part 4**: [Understanding Seldon Core v2 Network Architecture - The "Office Building" Guide to MLOps Networking](./PART-4-SELDON-NETWORK-ARCHITECTURE.md)
- **Part 5**: [Tracing ML Inference Requests - Deep Dive into Production Network Flow and Performance](./PART-5-SELDON-NETWORK-TRAFFIC.md)
- **Part 6**: [Production Debugging Mastery - Real Incident Response and Systematic Troubleshooting](./PART-6-SELDON-PRODUCTION-DEBUGGING.md)
- **Part 7**: [Flannel to Calico Migration - Enterprise CNI Requirements and Zero-Downtime Migration](./PART-7-FROM-FLANNEL-TO-CALICO.md)
- **Part 8**: [When Calico Fails - ARP Resolution Bug and Critical Production Debugging](./PART-8-CALICO-PRODUCTION-FAILURE.md)
- **Part 9**: [Calico to Cilium Migration - eBPF Performance and Strategic Infrastructure Recovery](./PART-9-CALICO-TO-CILIUM.md)

---

## Technical Architecture: Production-Ready A/B Testing

Building on our financial forecasting example from Part 1, let's implement a complete A/B testing system that can safely deploy ML models at scale.

### System Overview

Our A/B testing infrastructure follows GitOps principles with full observability:

![Production MLOps A/B testing architecture with GitOps automation](images/enhanced_architecture_diagram_20250712_182357.png)

*Production MLOps A/B testing architecture with GitOps automation*

The architecture may look complex, but it represents a robust, automated, and observable system. Let's break down the key components:

*   **Git & ArgoCD (The GitOps Engine):** At the top, the Git repository is the single source of truth for all configurations. ArgoCD automatically applies any changes from Git to the live Kubernetes cluster, ensuring our infrastructure is defined as code. This is how we deploy models and infrastructure changes safely and repeatably.

*   **Seldon Core v2 (The MLOps Brain):** In the center, Seldon Core orchestrates the A/B test. It receives incoming requests and uses an `Experiment` configuration to split traffic between our two models: 70% to the `baseline-predictor` and 30% to the `enhanced-predictor`. It's the component that makes intelligent, production-safe traffic routing possible.

*   **MLServer (The Inference Workhorse):** Each model (`baseline` and `enhanced`) is run by its own `MLServer` instance. This is a high-performance server optimized for running machine learning models in production.

*   **Prometheus & Grafana (The Eyes and Ears):** On the right, our observability stack is crucial. Prometheus collects detailed metrics from every part of the system—request rates, error rates, response times, and custom business metrics. Grafana provides a live dashboard to visualize the A/B test's performance, allowing us to see which model is performing better in real-time.

*   **The Complete Flow:** A request flows from the user, through the ingress, to the Seldon router. Seldon sends it to one of the models, the model makes a prediction, and all the while, Prometheus is collecting data. This data is then used to make a final decision on the experiment, completing the feedback loop.

## Foundation: Seldon Core v2 Setup

### Production Cluster Configuration

Our production cluster runs the following [Seldon Core v2](https://docs.seldon.io/projects/seldon-core/en/latest/) components:

| Release Name              | Namespace      | Status    | Chart Version         | App Version |
|-------------------------- |---------------|-----------|----------------------|-------------|
| seldon-core-v2-crds       | seldon-system  | deployed  | seldon-core-v2-crds-2.9.0    | 2.9.0      |
| seldon-core-v2-runtime    | seldon-system  | deployed  | seldon-core-v2-runtime-2.9.0 | 2.9.0      |
| seldon-core-v2-servers    | seldon-system  | deployed  | seldon-core-v2-servers-2.9.0 | 2.9.0      |
| seldon-core-v2-setup      | seldon-system  | deployed  | seldon-core-v2-setup-2.9.0   | 2.9.0      |

### Seldon Core v2 Experiment Configuration

The heart of our A/B testing is a [Seldon Experiment resource](https://docs.seldon.io/projects/seldon-core/en/latest/contents/experiments/experiments.html):

```yaml
apiVersion: mlops.seldon.io/v1alpha1
kind: Experiment
metadata:
  name: financial-ab-test-experiment
  namespace: seldon-system
spec:
  default: baseline-predictor
  candidates:
    - name: baseline-predictor
      weight: 70
    - name: enhanced-predictor
      weight: 30
  mirror:
    percent: 100
    name: traffic-mirror
```

**Key features:**
- **70/30 traffic split**: Conservative approach for financial models
- **Default fallback**: Automatic routing to baseline if enhanced fails
- **Traffic mirroring**: Copy requests for offline analysis

## Comprehensive Metrics Collection

### Prometheus Integration

We collect comprehensive metrics for both models using [Prometheus](https://prometheus.io/docs/introduction/overview/) for MLOps monitoring:

```python
# Request metrics
ab_test_requests_total{model_name="baseline-predictor",status="success"} 1851
ab_test_requests_total{model_name="enhanced-predictor",status="success"} 649

# Response time distribution
ab_test_response_time_seconds_bucket{model_name="baseline-predictor",le="0.05"} 1245
ab_test_response_time_seconds_bucket{model_name="enhanced-predictor",le="0.05"} 523

# Model accuracy (real production results)
ab_test_model_accuracy{model_name="baseline-predictor"} 48.2
ab_test_model_accuracy{model_name="enhanced-predictor"} 44.2

# Business impact
ab_test_business_impact{model_name="enhanced-predictor",metric_type="net_business_value"} 3.3
```

### Custom Metrics Implementation

Here's how we implement custom business metrics using the [Prometheus Python client](https://prometheus.io/docs/instrumenting/clientlibs/):

```python
from prometheus_client import Counter, Histogram, Gauge
import time

# Define metrics
REQUEST_COUNT = Counter('ab_test_requests_total', 
                       'Total requests by model', 
                       ['model_name', 'status'])

RESPONSE_TIME = Histogram('ab_test_response_time_seconds',
                         'Response time by model',
                         ['model_name'])

MODEL_ACCURACY = Gauge('ab_test_model_accuracy',
                      'Model accuracy score',
                      ['model_name'])

BUSINESS_IMPACT = Gauge('ab_test_business_impact',
                       'Business impact metrics',
                       ['model_name', 'metric_type'])

class ABTestMetrics:
    def __init__(self):
        self.start_time = time.time()
        
    def record_request(self, model_name: str, status: str):
        REQUEST_COUNT.labels(model_name=model_name, status=status).inc()
        
    def record_response_time(self, model_name: str, duration: float):
        RESPONSE_TIME.labels(model_name=model_name).observe(duration)
        
    def update_accuracy(self, model_name: str, accuracy: float):
        MODEL_ACCURACY.labels(model_name=model_name).set(accuracy)
        
    def update_business_impact(self, model_name: str, metric_type: str, value: float):
        BUSINESS_IMPACT.labels(model_name=model_name, metric_type=metric_type).set(value)
```

## Implementation: Running Production A/B Tests

### The A/B Testing Pipeline

Our implementation follows [GitOps principles](https://opengitops.dev/principles/) for ML deployment:

```bash
# 1. Train models using Argo Workflows
argo submit --from workflowtemplate/financial-training-pipeline-template \
  -p model-variant=enhanced -p data-version=v2.3.0

# 2. Deploy via GitOps
./scripts/gitops-model-update.sh enhanced v1.2.0

# 3. Run A/B test
python3 scripts/demo/advanced-ab-demo.py --scenarios 2500 --workers 5
```

![Live A/B testing execution with real-time metrics collection](images/terminal_metrics_view_real_20250712_180952.png)

*Live A/B testing execution with real-time metrics collection*

### Real-World A/B Testing Script

Here's the complete implementation of our A/B testing system:

```python
#!/usr/bin/env python3
"""
Production A/B Testing System for Financial ML Models
"""
import asyncio
import aiohttp
import time
import json
import numpy as np
from datetime import datetime
from typing import Dict, List, Tuple
import logging

class ProductionABTester:
    def __init__(self, config: Dict):
        self.config = config
        self.metrics = ABTestMetrics()
        self.results = {
            'baseline-predictor': {'requests': 0, 'responses': [], 'errors': 0},
            'enhanced-predictor': {'requests': 0, 'responses': [], 'errors': 0}
        }
        
    async def run_test(self, scenarios: int, workers: int):
        """Run A/B test with specified scenarios and workers"""
        print(f"🚀 Starting A/B test: {scenarios} scenarios, {workers} workers")
        
        # Create test scenarios
        test_data = self._generate_test_scenarios(scenarios)
        
        # Run concurrent tests
        tasks = []
        for i in range(workers):
            worker_data = test_data[i::workers]  # Distribute data across workers
            task = asyncio.create_task(self._worker(i, worker_data))
            tasks.append(task)
        
        # Wait for all workers to complete
        await asyncio.gather(*tasks)
        
        # Analyze results
        self._analyze_results()
        
    async def _worker(self, worker_id: int, test_data: List[Dict]):
        """Worker function to process test scenarios"""
        async with aiohttp.ClientSession() as session:
            for scenario in test_data:
                try:
                    # Make prediction request
                    start_time = time.time()
                    response = await self._make_prediction(session, scenario)
                    duration = time.time() - start_time
                    
                    # Extract model name from response headers
                    model_name = response.headers.get('x-model-name', 'unknown')
                    
                    # Record metrics
                    self.metrics.record_request(model_name, 'success')
                    self.metrics.record_response_time(model_name, duration)
                    
                    # Store results
                    self.results[model_name]['requests'] += 1
                    self.results[model_name]['responses'].append({
                        'duration': duration,
                        'accuracy': response.get('accuracy', 0),
                        'prediction': response.get('prediction', 0)
                    })
                    
                except Exception as e:
                    logging.error(f"Worker {worker_id} error: {e}")
                    self.metrics.record_request('unknown', 'error')
                    
    async def _make_prediction(self, session: aiohttp.ClientSession, scenario: Dict) -> Dict:
        """Make prediction request to A/B testing endpoint"""
        url = f"{self.config['endpoint']}/predict"
        
        payload = {
            'data': scenario['features'],
            'timestamp': datetime.now().isoformat()
        }
        
        async with session.post(url, json=payload) as response:
            result = await response.json()
            result['headers'] = dict(response.headers)
            return result
            
    def _generate_test_scenarios(self, count: int) -> List[Dict]:
        """Generate realistic test scenarios"""
        scenarios = []
        
        for i in range(count):
            # Generate realistic financial features
            scenario = {
                'features': {
                    'price': np.random.normal(100, 10),
                    'volume': np.random.exponential(1000000),
                    'volatility': np.random.beta(2, 5),
                    'rsi': np.random.uniform(20, 80),
                    'macd': np.random.normal(0, 1),
                    'moving_avg_5': np.random.normal(100, 8),
                    'moving_avg_20': np.random.normal(100, 12)
                },
                'market_condition': np.random.choice(['bull', 'bear', 'sideways']),
                'scenario_id': i
            }
            scenarios.append(scenario)
            
        return scenarios
        
    def _analyze_results(self):
        """Analyze A/B test results and generate recommendations"""
        print("\n📊 A/B Test Results Analysis")
        print("=" * 50)
        
        for model_name, data in self.results.items():
            if data['requests'] > 0:
                responses = data['responses']
                avg_duration = np.mean([r['duration'] for r in responses])
                p95_duration = np.percentile([r['duration'] for r in responses], 95)
                avg_accuracy = np.mean([r['accuracy'] for r in responses])
                error_rate = data['errors'] / data['requests'] * 100
                
                print(f"\n{model_name}:")
                print(f"  Requests: {data['requests']}")
                print(f"  Avg Response Time: {avg_duration:.3f}s")
                print(f"  P95 Response Time: {p95_duration:.3f}s")
                print(f"  Avg Accuracy: {avg_accuracy:.1f}%")
                print(f"  Error Rate: {error_rate:.1f}%")
                
                # Update Prometheus metrics
                self.metrics.update_accuracy(model_name, avg_accuracy)
                
        # Calculate business impact
        self._calculate_business_impact()
        
    def _calculate_business_impact(self):
        """Calculate business impact of A/B test"""
        baseline_data = self.results['baseline-predictor']
        enhanced_data = self.results['enhanced-predictor']
        
        if baseline_data['requests'] > 0 and enhanced_data['requests'] > 0:
            # Calculate performance differences
            baseline_accuracy = np.mean([r['accuracy'] for r in baseline_data['responses']])
            enhanced_accuracy = np.mean([r['accuracy'] for r in enhanced_data['responses']])
            
            baseline_latency = np.mean([r['duration'] for r in baseline_data['responses']])
            enhanced_latency = np.mean([r['duration'] for r in enhanced_data['responses']])
            
            # Business impact calculation
            accuracy_improvement = enhanced_accuracy - baseline_accuracy
            latency_increase = enhanced_latency - baseline_latency
            
            # Revenue impact (0.5% revenue per 1% accuracy improvement)
            revenue_lift = accuracy_improvement * 0.5
            
            # Cost impact (0.1% cost per ms latency increase)
            cost_impact = latency_increase * 1000 * 0.1  # Convert to ms
            
            # Net business value
            net_value = revenue_lift - cost_impact
            
            print(f"\n💰 Business Impact Analysis")
            print(f"  Accuracy Improvement: {accuracy_improvement:.1f}%")
            print(f"  Latency Increase: {latency_increase*1000:.1f}ms")
            print(f"  Revenue Lift: {revenue_lift:.1f}%")
            print(f"  Cost Impact: {cost_impact:.1f}%")
            print(f"  Net Business Value: {net_value:.1f}%")
            
            # Update business impact metrics
            self.metrics.update_business_impact('enhanced-predictor', 'net_business_value', net_value)
            
            # Make recommendation
            if net_value > 2.0:
                recommendation = "STRONG RECOMMEND"
            elif net_value > 0.5:
                recommendation = "RECOMMEND"
            else:
                recommendation = "CONTINUE TESTING"
                
            print(f"\n✅ Recommendation: {recommendation}")

# Configuration
config = {
    'endpoint': 'http://seldon-system-gateway:8080',
    'duration': 3600,  # 1 hour
    'prometheus_port': 8080
}

# Run A/B test
if __name__ == "__main__":
    tester = ProductionABTester(config)
    asyncio.run(tester.run_test(scenarios=2500, workers=5))
```

## Advanced Monitoring and Observability

### Dual Dashboard Strategy

Production ML A/B testing requires monitoring both **development processes** and **production outcomes**. Our approach uses two complementary dashboards:

#### 1. MLflow Development Dashboard
**Purpose**: Track model development and training progress
- **Experiment Tracking** - All model variants and hyperparameter combinations
- **Training Metrics** - Real-time accuracy, loss, and validation scores
- **Model Lineage** - Complete development history and artifact management
- **Collaboration** - Team visibility into ongoing experiments

```bash
# Monitor live training experiments
./scripts/run-live-ab-dashboard.sh
```

#### 2. Seldon Production Dashboard  
**Purpose**: Monitor live A/B test business impact
- **Traffic Distribution** - Real-time 70/30 split monitoring
- **Model Performance** - Live accuracy comparison between variants
- **Response Times** - P50/P95/P99 latency tracking under production load
- **Business Impact** - Net value calculations and ROI analysis

This dual approach ensures we have **complete visibility** from development through production deployment.

### Critical Production Alerts

```yaml
# Model accuracy degradation
- alert: ModelAccuracyDegraded
  expr: ab_test_model_accuracy < 75
  for: 5m
  labels:
    severity: critical
  annotations:
    summary: "Model accuracy dropped below 75%"

# High response time
- alert: HighResponseTime
  expr: histogram_quantile(0.95, rate(ab_test_response_time_seconds_bucket[5m])) > 0.200
  for: 3m
  labels:
    severity: warning
  annotations:
    summary: "P95 response time exceeds 200ms"

# Traffic imbalance
- alert: TrafficImbalanceDetected
  expr: abs(rate(ab_test_requests_total{model_name="baseline-predictor"}[5m]) - rate(ab_test_requests_total{model_name="enhanced-predictor"}[5m]) * 2.33) > 0.1
  for: 10m
  labels:
    severity: warning
  annotations:
    summary: "Traffic distribution deviates from expected 70/30 split"
```

![Production monitoring dashboard with automated alerting and KPI tracking](images/monitoring_alerts_dashboard_real_20250712_180952.png)

*Production monitoring dashboard with automated alerting and KPI tracking*

## Production Best Practices

### 1. Experiment Design

```python
experiment_plan = {
    "hypothesis": "Enhanced model improves accuracy by 3%+",
    "success_criteria": {
        "primary": "net_business_value > 2%",
        "secondary": "p95_latency < 200ms",
        "guardrail": "error_rate < 2%"
    },
    "traffic_allocation": {"baseline": 70, "enhanced": 30},
    "duration": "48 hours minimum"
}
```

### 2. Automated Decision Making

```python
def make_deployment_decision(metrics):
    """Automated decision framework"""
    net_value = metrics['net_business_value']
    latency = metrics['p95_latency']
    error_rate = metrics['error_rate']
    
    # Guardrails
    if error_rate > 2.0:
        return "REJECT - High error rate"
    if latency > 200:
        return "REJECT - High latency"
    
    # Business value assessment
    if net_value > 2.0:
        return "STRONG_RECOMMEND"
    elif net_value > 0.5:
        return "RECOMMEND"
    else:
        return "CONTINUE_TESTING"
```

### 3. Safety Mechanisms

```python
class SafetyController:
    def __init__(self):
        self.circuit_breaker = CircuitBreaker(
            failure_threshold=5,
            recovery_timeout=60,
            expected_exception=ModelException
        )
        
    async def safe_predict(self, model_name: str, data: Dict):
        """Prediction with circuit breaker protection"""
        try:
            return await self.circuit_breaker.call(
                self._make_prediction, model_name, data
            )
        except CircuitBreakerOpenException:
            # Fallback to baseline model
            return await self._fallback_prediction(data)
```

### 4. Gradual Rollout Strategy

```python
rollout_plan = {
    "phase_1": {"duration": "24h", "traffic": {"baseline": 90, "enhanced": 10}},
    "phase_2": {"duration": "48h", "traffic": {"baseline": 70, "enhanced": 30}},
    "phase_3": {"duration": "72h", "traffic": {"baseline": 50, "enhanced": 50}},
    "phase_4": {"duration": "∞", "traffic": {"baseline": 0, "enhanced": 100}}
}
```

## Key Implementation Lessons

### 1. Start Conservative
- Begin with 90/10 or 80/20 traffic splits
- Gradually increase challenger traffic
- Always maintain fallback mechanisms

### 2. Monitor Everything
- Response times and error rates
- Model accuracy and business metrics
- System resource utilization
- Traffic distribution patterns

### 3. Automate Decisions
- Remove human bias from deployment decisions
- Use statistical significance testing
- Implement automated rollback triggers

### 4. Test Infrastructure
- Validate A/B testing infrastructure before production
- Test failover mechanisms regularly
- Monitor monitoring systems

## Additional Resources

### 📚 **Essential Reading**
- [Seldon Core v2 Documentation](https://docs.seldon.io/projects/seldon-core/en/latest/) - Complete guide to Seldon Core implementation
- [GitOps Principles](https://opengitops.dev/principles/) - OpenGitOps working group best practices
- [MLOps Maturity Model](https://ml-ops.org/content/mlops-principles) - MLOps.org community guidelines
- [Google ML Engineering Best Practices](https://developers.google.com/machine-learning/guides/rules-of-ml) - Google's production ML guidelines

### 🛠️ **Tools and Frameworks** 
- [Prometheus Documentation](https://prometheus.io/docs/) - Monitoring and alerting toolkit
- [Argo Workflows](https://argoproj.github.io/argo-workflows/) - Kubernetes-native workflow engine
- [MLServer](https://mlserver.readthedocs.io/) - Python inference server for ML models
- [Kubernetes Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) - External access to cluster services

### 📊 **A/B Testing Resources**
- [Netflix A/B Testing Platform](https://netflixtechblog.com/its-all-a-bout-testing-the-netflix-experimentation-platform-4e1ca458c15) - Production A/B testing at scale
- [Uber's Experimentation Platform](https://eng.uber.com/experimentation-platform/) - Large-scale experimentation architecture
- [Continuous Delivery for Machine Learning](https://martinfowler.com/articles/cd4ml.html) - Martin Fowler's CD4ML principles
- [Statistical Significance in A/B Testing](https://blog.optimizely.com/2015/01/20/statistics-for-the-internet-age-the-story-behind-optimizelys-new-stats-engine/) - Optimizely's statistical approach

## What's Next

In **Part 3** of this series, we'll dive into the business impact:

- **ROI Calculation**: Measuring return on A/B testing infrastructure
- **Business Metrics**: Translating technical improvements to business value
- **Risk Assessment**: Quantifying and mitigating deployment risks
- **Stakeholder Communication**: Building business cases for ML A/B testing

We'll analyze real business impact calculations and ROI frameworks that justify A/B testing infrastructure investment.

---

## Key Takeaways

1. **Seldon Core v2 provides enterprise-grade A/B testing** - Traffic splitting, fallback mechanisms, and monitoring built-in
2. **Comprehensive metrics are essential** - Monitor performance, business impact, and system health
3. **Automation reduces risk** - Automated decisions and safety mechanisms prevent human error
4. **Start small and scale** - Begin with conservative traffic splits and proven infrastructure

---

**Ready to measure the business impact?** Continue with Part 3 where we'll calculate ROI and build the business case for ML A/B testing.

## Social Media & SEO

**Tags**: #MLOps #SeldonCore #KubernetesMLOps #ABTesting #GitOps #Prometheus #MachineLearning #ProductionML #MLInfrastructure #DevOps

**Share this article**: Learn how to build production-ready A/B testing infrastructure for ML models with Seldon Core v2, GitOps automation, and enterprise-grade monitoring. Perfect for platform engineers building reliable MLOps systems.

---

*This is Part 2 of the "A/B Testing in Production MLOps" series. The complete implementation is available as open source:*

- **Platform**: [github.com/jtayl222/ml-platform](https://github.com/jtayl222/ml-platform)
- **Application**: [github.com/jtayl222/seldon-system](https://github.com/jtayl222/seldon-system)

*Follow me for more enterprise MLOps content and practical implementation guides.*