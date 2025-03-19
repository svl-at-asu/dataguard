import numpy as np
import pandas as pd
from scipy.spatial.distance import jensenshannon
from scipy.stats import chi2_contingency
import random

def is_numerical_list(values):

    try:
        [float(value) for value in values]
        return True
    except ValueError:
        return False

def compute_jsd(specificationData, privacyPreservedData, privacyIdentifier):

    def extract_values_for_identifier(dataset, identifier):
        return [row[identifier] for row in dataset if identifier in row]

    def create_value_dict(spec_values, priv_values):
        unique_values = set(spec_values).union(set(priv_values))
        return {val: 0 for val in unique_values}

    def values_to_distribution(values, possible_values_dict):
        value_counts = possible_values_dict.copy()  
        for val in values:
            if val in value_counts:
                value_counts[val] += 1
        
        distribution = np.array(list(value_counts.values()), dtype=np.float64)
        distribution /= distribution.sum()  
        return distribution

    spec_values = extract_values_for_identifier(specificationData, privacyIdentifier)
    priv_values = extract_values_for_identifier(privacyPreservedData, privacyIdentifier)

    possible_values_dict = create_value_dict(spec_values, priv_values)

    spec_dist = values_to_distribution(spec_values, possible_values_dict)
    priv_dist = values_to_distribution(priv_values, possible_values_dict)

    jsd_value = jensenshannon(spec_dist, priv_dist)

    return jsd_value

def compute_mse_and_mae(specificationData, privacyPreservedData, privacyIdentifier):

    spec_values = [row[privacyIdentifier] for row in specificationData if privacyIdentifier in row]
    priv_values = [row[privacyIdentifier] for row in privacyPreservedData if privacyIdentifier in row]

    if is_numerical_list(priv_values):  
        priv_values = np.array([float(val) for val in priv_values])

        mse = np.mean((spec_values - priv_values) ** 2)
        mae = np.mean(np.abs(spec_values - priv_values))
        return mse, mae
    else:
        return 0, 0

def compute_chi_squared_test(specificationData, privacyPreservedData, privacyIdentifier):
    spec_values = [str(row[privacyIdentifier]) for row in specificationData if privacyIdentifier in row]
    priv_values = [str(row[privacyIdentifier]) for row in privacyPreservedData if privacyIdentifier in row]

    data = {'Original': spec_values, 'PrivacyPreserved': priv_values}
    contingency_table = pd.crosstab(data['Original'], data['PrivacyPreserved'])

    chi2, p, dof, expected = chi2_contingency(contingency_table)
    
    return p

def compute_random_utility():

    return random.uniform(0, 1)

def compute_utility(jsd_similarity, prop_shared, mse, max_mse, mae, max_mae, chi_squared, privacyPreservedData, privacyIdentifier):
    priv_values = [row[privacyIdentifier] for row in privacyPreservedData if privacyIdentifier in row]

    if is_numerical_list(priv_values):
        if max_mae != 0:
            normalized_mse = mse/max_mse  
            normalized_mae = mae/max_mae 
        else:
            normalized_mae = 0
            normalized_mse = 0

        utility = np.mean([
            1 - jsd_similarity,
            1 - normalized_mse,
            1 - normalized_mae,
            1 - chi_squared
        ])
    else:
        utility = np.mean([
            1 - chi_squared,
            1 - jsd_similarity,
            prop_shared
        ])

    return utility


def compute_shared_records_proportion(specificationData, privacyPreservedData, privacyIdentifier):
    spec_values = [str(row[privacyIdentifier]) for row in specificationData if privacyIdentifier in row]
    priv_values = [str(row[privacyIdentifier]) for row in privacyPreservedData if privacyIdentifier in row]

    shared_count = sum(1 for spec_val in spec_values if spec_val in priv_values)

    total_count = len(spec_values)
    proportion_shared = shared_count / total_count if total_count > 0 else 0

    return proportion_shared

def compare_datasets(specificationData, privacyPreservedDatasets, privacyIdentifier):
    dataset_metrics_pairs = []
    mse_list = []
    mae_list = []
    i = 0 
    for dataset in privacyPreservedDatasets: 
        mse, mae = compute_mse_and_mae(specificationData, dataset, privacyIdentifier)
        mse_list.append(mse)
        mae_list.append(mae)

    max_mse = max(mse_list, default=0.000001)
    max_mae = max(mae_list, default=0.000001)

    for dataset in privacyPreservedDatasets:
        jsd_similarity = compute_jsd(specificationData, dataset, privacyIdentifier)
        prop_shared = compute_shared_records_proportion(specificationData, dataset, privacyIdentifier)
        chi_squared = compute_chi_squared_test(specificationData, dataset, privacyIdentifier)

        mse = mse_list[i]
        mae = mae_list[i]
        i+=1

        utility = compute_utility(jsd_similarity, prop_shared, mse, max_mse, mae, max_mae, chi_squared, dataset, privacyIdentifier)

        dataset_metrics_pairs.append((dataset, (utility, jsd_similarity, prop_shared, mse, mae, chi_squared)))
    
    sorted_pairs = sorted(dataset_metrics_pairs, key=lambda x: x[1][0], reverse=True)

    sorted_datasets, sorted_metrics = zip(*sorted_pairs)
    
    priv_values = [row[privacyIdentifier] for row in privacyPreservedDatasets[0] if privacyIdentifier in row]

    if is_numerical_list(priv_values):
        labelled_sorted_metrics = [{
            "utility": values[0], 
            "Jensen-Shannon distance": values[1], 
            "mean squared error": values[3], 
            "mean absolute error": values[4], 
            "χ-squared independence test": values[5], 
        } for values in sorted_metrics]
    else:
        labelled_sorted_metrics = [{
            "utility": values[0], 
            "Jensen-Shannon distance": values[1], 
            "proportion of shared records": values[2], 
            "χ-squared independence test": values[5], 
        } for values in sorted_metrics]
    
    return list(sorted_datasets), list(labelled_sorted_metrics)
