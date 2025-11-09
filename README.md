
# Fin-R1: A Local-First Financial LLM Project

This repository provides a complete, runnable PyTorch project for training and running a financial reasoning model (Fin-R1) entirely on your local machine. It is designed to be modular, extensible, and easy to use with VS Code and a local GPU.

## Features

- **End-to-End Workflow**: Includes data loading, preprocessing, training, evaluation, and inference.
- **PyTorch-Powered**: Built with PyTorch for flexibility and performance.
- **GPU & Mixed Precision**: Supports CUDA for GPU acceleration and `torch.cuda.amp` for efficient mixed-precision training.
- **Config-Driven**: Hyperparameters and settings are managed via a `config.yaml` file, which can be overridden with command-line arguments.
- **Checkpointing**: Automatically saves and loads model, optimizer, and scheduler states.
- **Modular Code**: Well-structured and commented code to facilitate easy extension and modification.
- **Reproducible**: Includes `requirements.txt` and a `Dockerfile` for consistent environments.

---

## Quick Start: How to Run Locally (VS Code)

### 1. System Requirements

- Python 3.9+
- NVIDIA GPU with CUDA 11.8+ installed
- `git`

### 2. Setup Project

First, clone the repository and navigate into the project directory:
```bash
git clone <your-repo-url>
cd <your-repo-name>
```

### 3. Create Virtual Environment

Create and activate a Python virtual environment. This keeps your project dependencies isolated.

```bash
# For MacOS/Linux
python3 -m venv .venv
source .venv/bin/activate

# For Windows
python -m venv .venv
.\.venv\Scripts\activate
```

### 4. Install Dependencies

Install all required Python packages using `pip`:
```bash
pip install -r requirements.txt
```

### 5. Prepare Data

Create a `data/` directory in the project root. For this example, we will create a dummy CSV file for training and validation.

```bash
mkdir data
```
Now, create a file named `data/sample_data.csv` with some dummy data. The model expects numerical features and a single target column.

**`data/sample_data.csv` example:**
```csv
feature_1,feature_2,feature_3,feature_4,target
0.1,0.5,0.2,0.8,1.2
0.2,0.4,0.3,0.7,1.4
0.3,0.3,0.4,0.6,1.6
0.4,0.2,0.5,0.5,1.8
0.5,0.1,0.6,0.4,2.0
... (add more rows) ...
```
*Update `config.yaml` to point `train_data_path` and `val_data_path` to your CSV file.*

### 6. Run Training

Launch the training process using the provided shell script or by running `train.py` directly. The script will use the settings from `config.yaml`.

```bash
# Using the script
sh scripts/run_train.sh

# Or directly
python -m finr1.train --config config.yaml
```
Checkpoints will be saved to the `checkpoints/` directory.

### 7. Run Inference

Once you have a trained model checkpoint, you can run inference on new data.

```bash
# Using the script
# (Make sure to update the checkpoint path in the script if needed)
sh scripts/run_eval.sh

# Or directly
python -m finr1.inference \
  --checkpoint_path checkpoints/best_model.pth.tar \
  --input_data_path data/sample_data.csv \
  --output_path outputs/predictions.csv
```
Predictions will be saved to `outputs/predictions.csv`.

---

## Troubleshooting

- **GPU Not Found / CUDA Not Available**:
  - **Verify Installation**: Ensure your NVIDIA drivers and a compatible version of CUDA are installed. Run `nvidia-smi` in your terminal to check.
  - **PyTorch Installation**: Make sure you installed the CUDA-enabled version of PyTorch. If `torch.cuda.is_available()` returns `False` in Python, you may have the CPU-only version. Reinstall with the correct command from the [PyTorch website](https://pytorch.org/get-started/locally/).
  - **VS Code Interpreter**: Ensure your VS Code is using the Python interpreter from the `.venv` virtual environment where you installed the dependencies.

- **CUDA Version Mismatch**:
  - The error might look like `CUDA error: no kernel image is available for execution on the device`.
  - This means the PyTorch CUDA version doesn't match your system's CUDA driver version. Reinstall PyTorch with the correct CUDA version specifier (e.g., `cu118` for CUDA 11.8, `cu121` for CUDA 12.1).
