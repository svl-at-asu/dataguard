from flask import Flask
from .routes import main_routes
# from .privacy import differential_privacy, k_anonymity, l_diversity, t_closeness
# from .utils import data_partitioning, helpers

def create_app():
    app = Flask(__name__)

    app.register_blueprint(main_routes)

    return app