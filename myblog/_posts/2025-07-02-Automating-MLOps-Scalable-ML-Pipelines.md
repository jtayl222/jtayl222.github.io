# Automating MLOps: Scalable ML Pipelines

Automate MLOps pipelines with Ansible, MLflow, and Argo Workflows to build scalable, production-ready ML systems on Kubernetes.

MLOps automation turns notebooks into scalable ML pipelines, bridging data science and production. Using Ansible, MLflow, and Argo Workflows, I built a Kubernetes ML pipeline that streamlines deployment. This automation reflects my MLOps engineering journey, explored in my [guide to scalable ML systems](https://jeftaylo.medium.com/from-devops-to-mlops-why-employers-care-and-how-i-built-a-fortune-500-stack-in-my-spare-bedroom-ce0d06dd3c61).

---

## 🧱 System Overview (with Automated Stack Setup)

**Goal:** Build a real-world MLOps pipeline that starts with `train.py` on a laptop and ends with a live model server in Kubernetes.

Key repositories:
- [ml-platform](https://github.com/jtayl222/ml-platform): Ansible roles and playbooks to install infrastructure and MLOps tools
- [homelab-mlops-demo](https://github.com/jtayl222/homelab-mlops-demo): Sample training script, Argo workflows, sealed secrets, and manifests
- [aipnd-project](https://github.com/jtayl222/aipnd-project): Model training code that registers models with MLflow and stores artifacts in MinIO

**Stack Components:**
- ☁️ K3s (lightweight Kubernetes) as the cluster
- 💾 MinIO as a local S3 store
- 📊 MLflow for experiment tracking and model registry
- 🔁 Argo Workflows for pipeline automation
- 🔒 Sealed Secrets for secure credential management

Ansible automates infrastructure setup for scalable ML pipelines. The [ml-platform](https://github.com/jtayl222/ml-platform) repo is organized into [Ansible roles](https://github.com/jtayl222/ansible_homelab_kubernetes/tree/main/roles), each responsible for one component of the MLOps stack. The master playbook, [`playbooks/site.yml`](https://github.com/jtayl222/ansible_homelab_kubernetes/blob/main/playbooks/site.yml), acts as the automation hub—setting up the cluster, storage, observability, and the full MLOps toolchain.

Each role is idempotent and taggable, so you can run only what you need:

```bash
ansible-playbook -i inventory/production/hosts playbooks/site.yml --tags mlflow
```

Or launch the full stack in one go. This ensures every service is installed in the right order, and gives you a single, repeatable entry point to spin up your entire homelab environment.

---

## 🧪 Manual Training Step: `train.py`

Currently, training happens manually (or via Jupyter/CI). Example command:

```bash
MLFLOW_TRACKING_URI=http://192.168.1.85:32000 \
MLFLOW_S3_ENDPOINT_URL=http://192.168.1.85:30140 \
AWS_ACCESS_KEY_ID=minioadmin \
AWS_SECRET_ACCESS_KEY=minioadmin \
python train.py --save_dir models --arch vgg16 --epochs 5
```

This script:
- Logs metrics and params to MLflow
- Registers the model as `cnn_classifier`
- Saves artifacts to MinIO (`s3://mlflow/`)

> 💡 These credentials are for local homelab use. In production, use sealed secrets or a vault.

Once this is done, we’re ready to serve.

---

## 🚀 Role: `mlflow_model_server`

This role picks up only after training is complete. It:
- Creates a MinIO bucket (if needed)
- Deploys a Kubernetes Deployment to run `mlflow.models.serve`
- Waits for the rollout to complete

If your model isn’t registered yet, this role fails—which is the correct behavior.

---

## 🧠 MLOps Lesson: Order Matters

MLOps is about orchestration, not just tools.
- Secrets must be in place before workflows can run
- Training must happen before deployment
- Registries must be queried before you try to serve

The `mlops_demo_app` role is about environment prep. The `mlflow_model_server` role is about post-training deployment. They must run in the correct order—and that’s what infrastructure as code allows you to express.

---

## 🔎 Related Work

For a practical walkthrough of model experimentation and training, see my earlier piece: [Using Convolutional Neural Networks for Classification — From Training to Deployment](https://medium.com/@jeftaylo/using-convolutional-neural-networks-for-classification-from-training-to-deployment-08dd9480dd87).

That article covers:
- Using transfer learning and PyTorch to train a classifier
- Tuning hyperparameters and logging metrics with MLflow
- Saving and registering the model to the MLflow model registry
- Model signature, input/output format, and deployment considerations

Together, these articles form a complete MLOps narrative—from Jupyter-based training to Kubernetes-based serving.

---

## 📌 Final Thoughts

You don’t need Terraform. You don’t need AWS. You don’t need to reinvent ML serving.

You just need:
- A clear system layout
- Thoughtful sequencing
- Real automation

If you’re trying to learn MLOps or build a portfolio, clone [these repos](https://github.com/jtayl222) and try to break it. Then try to improve it.

This is what MLOps looks like in practice—not in theory.

---

*Thanks for reading! For more technical walkthroughs and DevOps/MLOps tooling writeups, visit [medium.com/@jeftaylo](https://medium.com/@jeftaylo).* 
