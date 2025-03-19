# DATAGUARD

DATAGUARD is a Flask-based web application designed to automate the mitigation of privacy risks in visualizations through a structured, privacy-preserving approach.

---

## Prerequisites

- Python 3.x
- Git

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/svl-at-asu/dataguard.git
cd dataguard
```

### 2. Create a Virtual Environment

**Windows (PowerShell)**

```powershell
python -m venv .venv
# If script execution is blocked, run:
#Set-ExecutionPolicy RemoteSigned -Scope Process
.venv\Scripts\activate
pip install -r requirements.txt
```

**macOS/Linux (Bash)**

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

## Running the Application

Activate your virtual environment and start the Flask server:

**Windows (PowerShell)**

```powershell
.venv\Scripts\activate
python main.py
```

**macOS/Linux (Bash)**

```bash
source .venv/bin/activate
python main.py
```

The application will typically run on `http://localhost:8080`.

---

## Project Structure

```
dataguard/
├── app/                   # Core Flask application
│   ├── __init__.py        # App initialization
│   ├── routes.py          # API endpoints
│   ├── privacy/           # Privacy modules
│   │   ├── differential_privacy.py
│   │   ├── k_anonymity.py
│   │   ├── l_diversity.py
│   │   └── t_closeness.py
│   ├── utils/             # Helper functions
│   │   ├── data_partitioning.py
│   │   ├── metrics.py
│   │   └── helpers.py
│   ├── templates/         # HTML templates
│   │   └── index.html
│   └── static/            # Static assets
│       ├── css/
│       ├── js/
│       └── imgs/
├── .venv/                 # Python virtual environment
├── requirements.txt       # Project dependencies
├── .gitignore             # Git ignore configurations
├── main.py                # Entry point to run the app
└── README.md              # (You are here!)
```

---

## Contributions

Contributions are welcomed and encouraged! Feel free to fork the repository and submit a pull request.

---

## License

This project is licensed under the GNU GPL v3.0.

