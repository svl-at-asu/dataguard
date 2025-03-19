from flask import Blueprint, render_template, request, jsonify
from .utils import helpers, metrics

main_routes = Blueprint('main_routes', __name__)

@main_routes.route('/')

def index():
    return render_template('index.html')

@main_routes.route('/query_pvt', methods=['POST'])
def query_pvt():

    specificationData = request.json # this is the dataset (i.e., "data")

    privacyMethod = request.args.get('method', default="k-anonymity", type=str)
    privacySensitive = request.args.get('sensitive', default=list(specificationData[0].keys())[1], type=str)
    privacyQuasiIdentifier = request.args.get('quasi_identifier', default=list(specificationData[0].keys())[0], type=str)
    privacyParameter = request.args.get('parameter', default=1, type=float)
    
    align_width = 35
    print("[/query_pvt]:")
    print(f"    - Privacy Method:".ljust(align_width) + f" {privacyMethod}")
    print(f"    - Privacy Sensitive Attribute:".ljust(align_width) + f" {privacySensitive}")
    print(f"    - Privacy Quasi-Identifier:".ljust(align_width) + f" {privacyQuasiIdentifier}")
    print(f"    - Privacy Parameter:".ljust(align_width) + f" {privacyParameter}")

    privacyPreservedDatasets = helpers.apply_rule(specificationData, privacyMethod, privacyQuasiIdentifier, privacyParameter, privacySensitive)

    if privacyMethod == "l-diversity":
        sortedDatasets, sortedMetrics = metrics.compare_datasets(specificationData, privacyPreservedDatasets, privacySensitive)
    else:
        sortedDatasets, sortedMetrics = metrics.compare_datasets(specificationData, privacyPreservedDatasets, privacyQuasiIdentifier)


    response = {
        "data": sortedDatasets,
        "metrics": sortedMetrics
    }

    return response
