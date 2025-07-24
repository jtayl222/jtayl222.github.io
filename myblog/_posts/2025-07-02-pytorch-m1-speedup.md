# ~7x Speedup: PyTorch on Apple M1 Pro for MLOps

[Jeffrey Taylor](https://jeftaylo.medium.com/?source=post_page---byline--fa1c10482c65---------------------------------------)

_Achieved ~7x speedup in PyTorch on Apple M1 Pro using MLflow. Learn MLOps optimization & debugging for deep learning. Results vary by setup._

---

## Introduction: The Need for Speed in MLOps

In the fast-paced world of machine learning, MLOps engineers are tasked with delivering faster iterations, quicker insights, and cost-effective solutions.

Initially, I trained a deep learning model for image classification using PyTorch on an Intel Core i7-10710U, achieving an epoch time of 690 seconds. On an Apple M1 Pro, the baseline epoch time was ~563 seconds. While MLflow effectively tracked my experiments, I saw an opportunity for optimization.

This article details how I optimized the training pipeline on the Apple M1 Pro, achieving a **6.8x speedup** (epoch time 82.5 seconds), outperforming the Intel i7 by **8.4x**, all while maintaining robust experiment tracking with MLflow.

_Your mileage may vary depending on hardware age, model architecture, dataset size, and system configurations like PyTorch or macOS versions._

**Key Learnings:**
- Optimize PyTorch workloads for Apple Silicon using Metal Performance Shaders (MPS).
- Debug complex cross-platform issues in MLOps pipelines.
- Leverage MLflow for performance tracking and reproducibility.
- Apply hardware-aware performance engineering in MLOps.

---

## The Starting Point: Performance on Intel Core i7 and Apple M1 Pro

**Intel Core i7-10710U:**
- Epoch Time: 690 seconds.
- Observations: The Python process consumed 550% CPU (5.5 cores out of 12), with overall CPU usage at ~45%.
- Interpretation: MKL optimized CPU computations, but the absence of a dedicated GPU limited parallel computations.

**Apple M1 Pro (Baseline, CPU-only):**
- Epoch Time: 563 seconds.
- Interpretation: The M1’s ARM-based CPU was ~18% faster than the Intel i7, likely due to efficiency and unified memory, but still suboptimal without leveraging the GPU.

---

## Hypothesis

Both CPUs were limited for deep learning’s parallel computations. I hypothesized that enabling the M1 Pro’s GPU via Metal Performance Shaders (MPS) would unlock significant performance gains, especially compared to the Intel system’s CPU-only setup.

---

## The Transition to Apple M1 Pro: A New Horizon

The Apple M1 Pro is designed for machine learning workloads, with:
- **ARM-based Architecture:** Optimized for efficiency.
- **Unified Memory Architecture:** CPU, GPU, and Neural Engine share high-bandwidth RAM.
- **Integrated GPU with Metal Performance Shaders (MPS):** High-performance computing, accessible via PyTorch’s MPS backend.

---

## The Optimization Journey: Debugging and Discovering Speed

To leverage the M1 Pro’s GPU, I updated the device selection logic:

```python
device = torch.device(
    "mps" if torch.backends.mps.is_available() 
    else "cuda:0" if torch.cuda.is_available() 
    else "cpu"
)
model.to(device)
```

### Challenge 1: RuntimeError: Mismatched Tensor Types in NNPack ConvolutionOutput

**Problem:**  
After enabling MPS, encountered:
```
RuntimeError: Mismatched tensor types in NNPack convolutionOutput
```
**Cause:**  
Tensors (inputs, labels) not explicitly moved to the mps device.

**Solution:**  
- Verified MPS availability with `torch.backends.mps.is_available()`.
- Ensured all tensors were moved:  
  ```python
  inputs, labels = inputs.to(device), labels.to(device)
  ```
- Disabled NNPack with  
  ```python
  os.environ["PYTORCH_ENABLE_NNPACK"] = "0"
  ```
  as a fallback.

### Challenge 2: RuntimeError: Too Many Open Files with num_workers

**Problem:**  
Increasing `num_workers` in the DataLoader caused:
```
RuntimeError: Too many open files
```
**Cause:**  
macOS’s default file descriptor limit (`ulimit -n 256`).

**Solution:**  
- Temporarily increased the limit:  
  ```bash
  ulimit -n 4096
  ```
- Set sharing strategy:
  ```python
  import torch.multiprocessing as mp
  mp.set_sharing_strategy('file_system')
  ```
- Reduced `num_workers` and disabled `pin_memory`.

### Challenge 3: TypeError: Can’t Convert MPS Tensor to NumPy (MLflow Logging)

**Problem:**  
Logging an input_example to MLflow raised:
```
TypeError: can't convert mps:0 device type tensor to numpy
```
**Cause:**  
NumPy requires CPU memory, but MPS tensors are on the GPU.

**Solution:**  
- Used `.cpu().detach().numpy()` to move tensors to CPU:
  ```python
  single_input_example_np = single_input_example.cpu().detach().numpy()
  ```
- Fixed a trailing comma bug.

---

## The Breakthrough: ~7x Speedup on M1 Pro

After resolving these issues, the M1 Pro achieved an average epoch time of **82.5 seconds**, compared to:
- 563 seconds (baseline on M1 Pro, CPU-only): ~6.8x speedup.
- 690 seconds (Intel i7): ~8.4x speedup.

---

## Why So Fast?

- **MPS Backend:** Offloads computations to the M1’s GPU, optimized for parallel operations.
- **Unified Memory:** Eliminates CPU-GPU data transfer bottlenecks.
- **Efficiency:** Leverages specialized hardware for high performance.

_Note: Results may vary based on hardware, model complexity, dataset size, batch size, or software versions._

---

## MLOps Takeaways & Conclusion

This project demonstrates key MLOps skills:
- **Performance Engineering:** Achieved ~6.8x speedup on M1 Pro and ~8.4x over Intel i7.
- **Hardware Awareness:** Optimized for Apple Silicon’s MPS and unified memory.
- **Troubleshooting:** Resolved complex errors across PyTorch and MLflow.
- **Cross-Platform Adaptation:** Migrated and optimized a pipeline for a new architecture.
- **MLflow Observability:** Tracked experiments for reproducibility.
- **Continuous Improvement:** Iteratively refined the pipeline.

MLOps engineers must understand compute environments to build scalable solutions.  
_Explore the code on GitHub, review the MLflow setup, and follow the [MLOps Engineering Portfolio](https://jeftaylo.medium.com/mlops-engineering-portfolio-3946a461efda) for more insights._

---

[Written by Jeffrey Taylor](https://jeftaylo.medium.com/?source=post_page---post_author_info--fa1c10482c65---------------------------------------)
